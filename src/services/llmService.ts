import { FlowNodeId } from '../chatbot/types';
import { FLOW_CONFIG } from '../chatbot/flowConfig';

const LLM_ENDPOINT = 'https://cloudapi.123ivr.in/vllm/v1/chat/completions';
const LLM_MODEL = 'sarvam-m';

// Valid core service flow IDs configured in the application
const VALID_SERVICE_FLOWS: FlowNodeId[] = [
  'main_menu',
  'no_power_start',
  'app_related_start',
  'connection_start',
  'bill_payment_start',
  'meter_request_start',
  'meter_reading_start',
  'update_details_start',
  'safety_related_start',
  'theft_reporting_start',
  'helpline_nos_start'
];

export interface LLMResponse {
  text: string;
  matchedFlowIds: FlowNodeId[];
  isFallback?: boolean;
}

// Bounded knowledge base for Torrent Power services
export const TORRENT_POWER_CATALOG = `
Service Knowledge & Capabilities:
- Power Outage & Grid Issues: No power, voltage fluctuations, feeder trip, line fault (Tag: [INTENT: no_power_start])
- Application Services: Name change, load change, meter shifting, tracking (Tag: [INTENT: app_related_start])
- New Connection: Residential, commercial, industrial, solar net metering (Tag: [INTENT: connection_start])
- Bill & Payment: View bill, pay online, duplicate receipt, tariff info (Tag: [INTENT: bill_payment_start])
- Meter Complaints: Fast meter, defective display, burnt meter, inspection (Tag: [INTENT: meter_request_start])
- Self-Meter Reading: Submit unit readings, reading schedules (Tag: [INTENT: meter_reading_start])
- Update Profile: Update mobile number, email, WhatsApp alerts (Tag: [INTENT: update_details_start])
- Safety Hazard: Fallen wires, sparking, fire hazard (Tag: [INTENT: safety_related_start])
- Power Theft: Confidential reporting of theft and hooking (Tag: [INTENT: theft_reporting_start])
- Helpline: 24x7 Helpline 1912 (Tag: [INTENT: helpline_nos_start])
`;

const SYSTEM_PROMPT = `You are ANN (Artificial Neural Network), the helpful and polite customer support AI assistant for Torrent Power.

${TORRENT_POWER_CATALOG}

CRITICAL RULES:
1. NEVER start responses by reciting operational areas, states, or locations (e.g. NEVER output "1. Gujarat: Ahmedabad...", "2. Maharashtra: Bhiwandi..."). Answer the user's question directly.
2. For greetings or general questions, respond warmly, concisely, and naturally without boilerplate lists.
3. For electrical emergencies, warn user to maintain 10 meters distance and dial 1912 immediately.
4. When routing to a specific service, append exactly one intent tag at the end (e.g. [INTENT: bill_payment_start] or [INTENT: no_power_start] or [INTENT: SERVICE_LIST]).
5. Keep your tone professional, concise, and helpful.`;

function cleanLLMResponse(rawContent: string): string {
  let cleaned = rawContent.replace(/\[INTENT:\s*[^\]]+\]/gi, '').trim();

  // Strip hallucinated/echoed territory listing headers if generated at the start
  cleaned = cleaned.replace(/^(?:(?:(?:Licensed & )?Distribution Franchisee Operational Areas:?|Torrent Power (?:Limited )?Operational Areas:?)\s*)?(?:(?:\d+[\.\)]\s*)?\*?\*?Gujarat\*?\*?:[^\n]+\n*)*(?:(?:\d+[\.\)]\s*)?\*?\*?Maharashtra\*?\*?:[^\n]+\n*)*(?:(?:\d+[\.\)]\s*)?\*?\*?Uttar Pradesh\*?\*?:[^\n]+\n*)*(?:(?:\d+[\.\)]\s*)?\*?\*?Union Territory\*?\*?:[^\n]+\n*)*/i, '').trim();

  // Strip standalone repeated city/state bullet prefixes
  cleaned = cleaned.replace(/^(?:(?:\d+[\.\)]\s*)?\*?\*?(?:Gujarat|Maharashtra|Uttar Pradesh|Union Territory)\*?\*?:[^\n]*\n*)+/gi, '').trim();

  return cleaned;
}

export async function queryANNAssistant(
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  userMessage: string
): Promise<LLMResponse> {
  const messagesPayload = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...chatHistory.slice(-10),
    { role: 'user', content: userMessage }
  ];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(LLM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages: messagesPayload,
        temperature: 0.3,
        max_tokens: 350
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`LLM API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '';

    if (!rawContent.trim()) {
      throw new Error('Empty response from LLM');
    }

    // Extract [INTENT: flow_id] or [INTENT: SERVICE_LIST]
    const intentMatch = rawContent.match(/\[INTENT:\s*([^\]]+)\]/i);
    let matchedFlowIds: FlowNodeId[] = [];
    const cleanedText = cleanLLMResponse(rawContent);

    if (intentMatch) {
      const intentValue = intentMatch[1].trim();
      if (intentValue.toUpperCase() === 'SERVICE_LIST' || intentValue === 'main_menu') {
        matchedFlowIds = ['main_menu'];
      } else {
        const candidateFlows = intentValue
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => VALID_SERVICE_FLOWS.includes(s as FlowNodeId)) as FlowNodeId[];

        if (candidateFlows.length > 0) {
          matchedFlowIds = candidateFlows;
        }
      }
    }

    return {
      text: cleanedText || rawContent.replace(/\[INTENT:\s*[^\]]+\]/gi, '').trim(),
      matchedFlowIds,
      isFallback: false
    };
  } catch (error) {
    console.warn('ANN Assistant GenAI call error:', error);
    return {
      text: `I am here to help you with all Torrent Power services. You can register power outage complaints, manage applications, apply for new connections, view or pay bills, or contact our 24x7 Helpline (**1912**). How may I assist you today?`,
      matchedFlowIds: ['main_menu'],
      isFallback: true
    };
  }
}
