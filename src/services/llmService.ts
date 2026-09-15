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

// Comprehensive Domain Knowledge Base bounded for Torrent Power
export const TORRENT_POWER_CATALOG = `
Torrent Power Limited (₹45,000+ Cr Torrent Group):
• Integrated power utility serving 4.2+ Million customers across India with 6,494 MW generation capacity.
• 99.9% grid uptime and lowest T&D losses in India.
• Licensed & Distribution Franchisee Operational Areas:
  1. Gujarat: Ahmedabad, Gandhinagar, Surat, Dahej SEZ, Dholera SIR.
  2. Maharashtra: Bhiwandi (Distribution Franchisee).
  3. Uttar Pradesh: Agra (Distribution Franchisee).
  4. Union Territory: Dadra & Nagar Haveli (Silvassa), Daman and Diu (DNH-DD).
• 24x7 Central Toll-Free Helpline: 1912.

10 Core Service Verticals & Action Flows:
1. no_power_start: Complete power cut, outage, voltage fluctuation/low/high, tripping, line fault, feeder maintenance.
2. app_related_start: Application services — Name change / deed transfer, load revision (extension/reduction), meter shifting within premises, service removal, application tracking (e.g. APP-2026-XXXX).
3. connection_start: New power connections (LT Residential, LT Commercial, HT Industrial, Rooftop Solar Net Metering, Temporary event connections).
   • Required Documents:
     - Identity Proof (Aadhaar Card / PAN Card / Passport)
     - Ownership / Occupancy Proof (Registered Sale Deed / Index-II / Municipal Tax Bill)
     - Latest Electricity Bill of adjacent/existing premises
     - Licensed Electrical Contractor Test Report
4. bill_payment_start: View bill details, quick online payment, duplicate bill receipt, payment history, tariff slab info, high bill dispute.
5. meter_request_start: Meter complaints — fast meter, defective meter, blank/unreadable display, burnt meter, meter testing inspection.
6. meter_reading_start: Self-meter reading submission (kWh units), meter reading dates & billing cycle schedule.
7. update_details_start: Customer profile updates — mobile number change, email registration, WhatsApp bill alerts, paperless e-Bill registration.
8. safety_related_start: Electrical emergencies — fallen live wire, sparking transformer, electric shock hazard, fire near power lines, open pillar box.
   • Critical Safety Rule: Always keep a distance of at least 10 meters (33 feet) from fallen/sparking wires. Never touch nearby metal objects or water puddles. Contact emergency helpline 1912 immediately.
9. theft_reporting_start: Vigilance reporting — report power theft, illegal line hooking, meter tampering / bypassing (100% confidential).
10. helpline_nos_start: Customer care centres, Zonal Bhavans, 24x7 Helpline 1912, WhatsApp helpline.
`;

const SYSTEM_PROMPT = `You are ANN (Artificial Neural Network Assistant), the intelligent, compassionate, and helpful GenAI Customer Care Assistant for Torrent Power Limited.

${TORRENT_POWER_CATALOG}

GUIDELINES & BEHAVIOR:
1. Conversational & Context-Bounded:
   - Act as an authentic, intelligent customer support AI bounded strictly by Torrent Power's domain, operational territories, and electricity services.
   - Answer all user questions, explanations, greetings, and general questions naturally, accurately, and politely without hardcoded scripts.
   - For queries outside Torrent Power's operational scope (e.g., non-power queries like gas/plumbing, or non-Torrent regions like Delhi/Mumbai/Bangalore), politely clarify that you are Torrent Power's dedicated assistant serving Ahmedabad, Gandhinagar, Surat, Dahej, Dholera, Bhiwandi, Agra, and DNH-DD.

2. Safety First:
   - For any electrical hazard (fallen wires, sparking, shocks, fire), immediately provide safety warnings (maintain 10m distance) and the 1912 helpline, tagging [INTENT: safety_related_start].

3. Service Routing & Quick Actions:
   - When the user's intent matches one of the 10 core service functions, provide a helpful, natural response and append the appropriate intent tag at the end:
     [INTENT: no_power_start]
     [INTENT: app_related_start]
     [INTENT: connection_start]
     [INTENT: bill_payment_start]
     [INTENT: meter_request_start]
     [INTENT: meter_reading_start]
     [INTENT: update_details_start]
     [INTENT: safety_related_start]
     [INTENT: theft_reporting_start]
     [INTENT: helpline_nos_start]
   - If the user asks for all services, menu, or what you offer, summarize what you can do and append [INTENT: SERVICE_LIST].
   - If the query is a general question, explanation, greeting, or compliment, answer conversationally and informatively without adding an intent tag unless a specific action is needed.

4. Style & Formatting:
   - Keep responses clear, professional, warm, and concise.
   - Use bold text for key details, phone numbers (**1912**), and document names.`;

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
    const cleanedText = rawContent.replace(/\[INTENT:\s*[^\]]+\]/gi, '').trim();

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
      text: cleanedText,
      matchedFlowIds,
      isFallback: false
    };
  } catch (error) {
    console.warn('ANN Assistant GenAI call error:', error);
    return {
      text: `I am here to help you with all Torrent Power services across our operational areas. You can register power outage complaints, manage applications, apply for new connections, view or pay bills, or contact our 24x7 Helpline (**1912**). How may I assist you today?`,
      matchedFlowIds: ['main_menu'],
      isFallback: true
    };
  }
}
