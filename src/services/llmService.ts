import { FlowNodeId } from '../chatbot/types';
import { FLOW_CONFIG } from '../chatbot/flowConfig';

const LLM_ENDPOINT = 'https://cloudapi.123ivr.in/vllm/v1/chat/completions';

// ─── VALID SERVICE FLOW IDs (single source of truth — from flowConfig) ─────────
const VALID_SERVICE_FLOWS: FlowNodeId[] = [
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

function isValidServiceFlow(flowId: string): boolean {
  return VALID_SERVICE_FLOWS.includes(flowId);
}

// ─── INTENT RESOLUTION TYPE ────────────────────────────────────────────────────
type IntentType = 'SERVICE_LIST' | 'SERVICE_REQUEST' | 'GENERAL_CONVERSATION' | 'FLOW_CONTINUATION' | 'UNKNOWN';

interface IntentResolution {
  intentType: IntentType;
  flowId: FlowNodeId | null;
  source: 'deterministic' | 'llm' | 'context' | 'fallback';
}

export interface LLMResponse {
  text: string;
  matchedFlowIds: FlowNodeId[];
  isFallback?: boolean;
}

// ─── SERVICE LIST DETECTION PHRASES (must be checked FIRST, before any service matching) ──
const SERVICE_LIST_PHRASES: string[] = [
  'list of service', 'list of services', 'show service', 'show services',
  'show all service', 'show all services', 'what services', 'what service do you',
  'what can you help', 'what can you do', 'what options', 'tell me your service',
  'tell me the service', 'service list', 'service menu', 'how can you help',
  'what requests can', 'what are your service', 'what are the service',
  'all services', 'all service', 'available service', 'services available',
  'what do you offer', 'what do you provide', 'what can i do here',
  'i need help', 'i want help', 'can you help me', 'help me',
  'what other service', 'other service', 'more service', 'what else can you',
  'what else do you'
];

// ─── SPECIFIC SERVICE INTENT RULES ─────────────────────────────────────────────
// Only trigger when user is clearly asking for THIS specific service, not generic browsing
const SPECIFIC_SERVICE_RULES: Array<{
  flowId: FlowNodeId;
  phrases: string[];            // must match a full phrase
  exactKeywords: string[];      // must be standalone words (not substrings)
}> = [
  {
    flowId: 'no_power_start',
    phrases: [
      'no electric', 'no electricity', 'no power', 'no light', 'no current',
      'power cut', 'light cut', 'power gone', 'light gone', 'current gone',
      'power off', 'light off', 'blackout', 'black out', 'tripping',
      'flickering', 'sparking wire', 'voltage issue', 'voltage low', 'voltage high',
      'fluctuation', 'line cut', 'line fault', 'electricity gone', 'electricity off',
      'electricity cut', 'no electricity at home', 'no power at home'
    ],
    exactKeywords: ['outage', 'blackout', 'tripping', 'flickering', 'sparking']
  },
  {
    flowId: 'bill_payment_start',
    phrases: [
      'pay my bill', 'pay bill', 'view my bill', 'view bill', 'my bill',
      'bill amount', 'bill payment', 'electricity bill', 'electric bill',
      'duplicate bill', 'bill receipt', 'last payment', 'payment history',
      'dues amount', 'pay now', 'bill pdf', 'billing details', 'pay my electricity',
      'pay electricity', 'want to pay'
    ],
    exactKeywords: ['invoice', 'dues']
  },
  {
    flowId: 'connection_start',
    phrases: [
      'new connection', 'apply connection', 'apply for connection',
      'new electric connection', 'residential connection', 'commercial connection',
      'industrial connection', 'lt connection', 'ht connection', 'get connection',
      'need connection', 'want connection'
    ],
    exactKeywords: []
  },
  {
    flowId: 'app_related_start',
    phrases: [
      'application status', 'my application', 'name change', 'load extension',
      'load reduction', 'meter shifting', 'load shift', 'transfer deed',
      'service removal', 'check my application'
    ],
    exactKeywords: []
  },
  {
    flowId: 'meter_request_start',
    phrases: [
      'meter fast', 'meter defective', 'display blank', 'meter replacement',
      'meter broken', 'meter noise', 'meter running fast', 'meter defect',
      'my meter is', 'meter problem', 'meter issue', 'faulty meter'
    ],
    exactKeywords: []
  },
  {
    flowId: 'meter_reading_start',
    phrases: [
      'meter reading', 'self reading', 'submit reading', 'kwh reading',
      'reading date', 'reading schedule', 'submit meter'
    ],
    exactKeywords: ['kwh']
  },
  {
    flowId: 'update_details_start',
    phrases: [
      'update my details', 'update my mobile', 'update my email',
      'change my mobile', 'change my email', 'e-bill registration',
      'ebill registration', 'paperless bill', 'whatsapp alert', 'sms alert', 'power alert'
    ],
    exactKeywords: ['ebill']
  },
  {
    flowId: 'safety_related_start',
    phrases: [
      'electrical safety', 'fallen wire', 'live wire', 'transformer fire',
      'wire sparking', 'emergency wire', 'elcb', 'electric shock',
      'dangerous wire', 'electrical hazard'
    ],
    exactKeywords: []
  },
  {
    flowId: 'theft_reporting_start',
    phrases: [
      'report theft', 'power theft', 'line hooking', 'meter tampering',
      'vigilance tip', 'illegal connection', 'someone stealing electricity',
      'electricity theft'
    ],
    exactKeywords: ['theft', 'hooking', 'tampering', 'vigilance']
  },
  {
    flowId: 'helpline_nos_start',
    phrases: [
      'customer care number', 'helpline number', 'toll free number',
      'contact number', 'phone number', 'call center', 'speak to agent',
      'human agent', 'contact support', 'customer support number'
    ],
    exactKeywords: ['1912']
  }
];

// ─── LLM SYSTEM PROMPT ─────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are ANN (Artificial Neural Network Assistant), Torrent Power's compassionate, polite, and empathetic GenAI Customer Support Assistant.

IMPORTANT: You are a service-routing assistant. You help identify which Torrent Power service a customer needs.

ALLOWED INTENT TAGS — you may ONLY use these exact flow IDs:
no_power_start, app_related_start, connection_start, bill_payment_start,
meter_request_start, meter_reading_start, update_details_start,
safety_related_start, theft_reporting_start, helpline_nos_start

SPECIAL INTENT: SERVICE_LIST — use this when the user asks what services are available, what you can do, or requests a list of services.

RULES:
1. Respond in 1-2 warm, empathetic sentences. Acknowledge problems with care.
2. ONLY append [INTENT: flow_id] if the user is explicitly asking for a specific service.
   - "I want to pay my bill" → [INTENT: bill_payment_start]
   - "no electricity at home" → [INTENT: no_power_start]
   - "what services do you offer" → [INTENT: SERVICE_LIST]
3. Do NOT append any intent if the user is making small talk, greetings, or general questions.
4. Do NOT invent flow IDs. Only use those listed above.
5. NEVER use [INTENT: bill_payment_start] just because the word "bill", "service", or "payment" appears in a general or browsing context.
6. Maintain context from chat history for follow-up replies.
7. Keep your text response brief (2-3 sentences max).`;

// ─── DEV DEBUG LOGGER ──────────────────────────────────────────────────────────
function debugLog(label: string, data: Record<string, any>): void {
  if (typeof window !== 'undefined' && (window as any).__ANN_DEBUG__) {
    console.groupCollapsed(`[ANN INTENT DEBUG] ${label}`);
    Object.entries(data).forEach(([k, v]) => console.log(`${k}:`, v));
    console.groupEnd();
  }
}

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────────
export async function queryANNAssistant(
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  userMessage: string
): Promise<LLMResponse> {
  // STEP 1: Resolve intent deterministically BEFORE calling LLM
  const resolution = resolveIntent(userMessage, chatHistory);

  debugLog(userMessage, {
    'USER MESSAGE': userMessage,
    'INTENT TYPE': resolution.intentType,
    'FLOW ID': resolution.flowId,
    'SOURCE': resolution.source
  });

  // STEP 2: SERVICE_LIST — return immediately, do not call LLM
  if (resolution.intentType === 'SERVICE_LIST') {
    return {
      text: `Certainly! Here are the Torrent Power services I can assist you with. Please select the service you need:`,
      matchedFlowIds: ['main_menu'],
      isFallback: false
    };
  }

  // STEP 3: Known specific service — still call LLM for warm response, but pin the intent
  const messagesPayload = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...chatHistory.slice(-8),
    { role: 'user', content: userMessage }
  ];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(LLM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'default',
        messages: messagesPayload,
        temperature: 0.3,
        max_tokens: 250
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`LLM API status ${response.status}`);

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '';
    if (!rawContent.trim()) throw new Error('Empty response');

    // Extract [INTENT: flow_id] from LLM output
    const intentMatch = rawContent.match(/\[INTENT:\s*([^\]]+)\]/i);
    let llmFlowIds: FlowNodeId[] = [];
    let cleanedText = rawContent.replace(/\[INTENT:\s*[^\]]+\]/gi, '').trim();

    if (intentMatch) {
      const raw = intentMatch[1].trim();
      if (raw === 'SERVICE_LIST') {
        // LLM also detected service list — override cleanly
        return {
          text: cleanedText || `Certainly! Here are the Torrent Power services I can assist you with. Please select the service you need:`,
          matchedFlowIds: ['main_menu'],
          isFallback: false
        };
      }
      // Only accept valid service flow IDs from LLM
      llmFlowIds = raw
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => isValidServiceFlow(s)) as FlowNodeId[];
    }

    debugLog('LLM result', { 'LLM_RAW': rawContent, 'LLM_FLOW_IDS': llmFlowIds });

    // Deterministic resolution takes priority over LLM if deterministic found a specific service
    const finalFlowIds = resolution.flowId
      ? [resolution.flowId]
      : llmFlowIds.length > 0
        ? llmFlowIds
        : [];

    return {
      text: cleanedText,
      matchedFlowIds: finalFlowIds,
      isFallback: false
    };

  } catch (error) {
    console.warn('GenAI API fallback triggered:', error);
    return buildFallbackResponse(resolution);
  }
}

// ─── INTENT RESOLVER (deterministic — single responsibility) ───────────────────
function resolveIntent(
  userMessage: string,
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): IntentResolution {
  const msgLower = userMessage.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const msgWords = new Set(msgLower.split(' '));

  // ── Priority 1: Explicit service-list/discovery request ──────────────────────
  for (const phrase of SERVICE_LIST_PHRASES) {
    if (msgLower.includes(phrase)) {
      return { intentType: 'SERVICE_LIST', flowId: null, source: 'deterministic' };
    }
  }

  // ── Priority 2: Specific service phrase matching (greedy phrase-first) ────────
  for (const rule of SPECIFIC_SERVICE_RULES) {
    for (const phrase of rule.phrases) {
      if (msgLower.includes(phrase)) {
        return { intentType: 'SERVICE_REQUEST', flowId: rule.flowId, source: 'deterministic' };
      }
    }
  }

  // ── Priority 3: Exact keyword matching (standalone words only) ────────────────
  for (const rule of SPECIFIC_SERVICE_RULES) {
    for (const kw of rule.exactKeywords) {
      if (msgWords.has(kw)) {
        return { intentType: 'SERVICE_REQUEST', flowId: rule.flowId, source: 'deterministic' };
      }
    }
  }

  // ── Priority 4: Context from recent chat history (short follow-ups only) ──────
  // Only use history context if user message is very short (likely follow-up)
  if (msgLower.split(' ').length <= 4) {
    const CONTINUITY_WORDS = new Set(['yes', 'ok', 'okay', 'proceed', 'sure', 'go ahead', 'confirm', 'please', 'yep', 'yeah', 'right', 'correct']);
    const isContinuityMessage = [...msgWords].some(w => CONTINUITY_WORDS.has(w));

    if (isContinuityMessage && chatHistory.length > 0) {
      const recentText = chatHistory
        .slice(-4)
        .map((m) => m.content)
        .join(' ')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ');

      // Only carry context if history clearly belongs to a specific flow
      for (const rule of SPECIFIC_SERVICE_RULES) {
        for (const phrase of rule.phrases) {
          if (recentText.includes(phrase)) {
            return { intentType: 'FLOW_CONTINUATION', flowId: rule.flowId, source: 'context' };
          }
        }
      }
    }
  }

  // ── Priority 5: Let LLM decide for truly ambiguous or conversational messages ──
  return { intentType: 'UNKNOWN', flowId: null, source: 'llm' };
}

// ─── FALLBACK RESPONSES (when LLM is unavailable) ─────────────────────────────
function buildFallbackResponse(resolution: IntentResolution): LLMResponse {
  if (resolution.intentType === 'SERVICE_LIST') {
    return {
      text: `Certainly! Here are the Torrent Power services I can assist you with. Please select the service you need:`,
      matchedFlowIds: ['main_menu'],
      isFallback: true
    };
  }

  if (resolution.flowId === 'no_power_start') {
    return {
      text: `I am so sorry to hear about your power interruption! I completely understand how stressful a power cut can be. Please click below to log a No Power complaint so our emergency field crew can restore your supply:`,
      matchedFlowIds: ['no_power_start'],
      isFallback: true
    };
  }

  if (resolution.flowId === 'bill_payment_start') {
    return {
      text: `I would be delighted to assist you with your electricity bill! You can view your bill details and make a secure payment using the option below:`,
      matchedFlowIds: ['bill_payment_start'],
      isFallback: true
    };
  }

  if (resolution.flowId === 'connection_start') {
    return {
      text: `It is my pleasure to assist you with applying for a new Torrent Power connection! Please select below to view requirements and begin:`,
      matchedFlowIds: ['connection_start'],
      isFallback: true
    };
  }

  if (resolution.flowId === 'meter_request_start') {
    return {
      text: `I completely understand your concern about your electricity meter! Please click below to request a technical inspection:`,
      matchedFlowIds: ['meter_request_start'],
      isFallback: true
    };
  }

  if (resolution.flowId === 'safety_related_start') {
    return {
      text: `Your safety is our highest priority! Please maintain a safe distance from any sparking or fallen wires while I connect you to emergency support:`,
      matchedFlowIds: ['safety_related_start'],
      isFallback: true
    };
  }

  if (resolution.flowId) {
    return {
      text: `I'd be glad to assist you! Please click the service option below to proceed:`,
      matchedFlowIds: [resolution.flowId],
      isFallback: true
    };
  }

  return {
    text: `Thank you for contacting Torrent Power! I'm here to help with bill payments, power outages, new connections, and meter services. How may I assist you today?`,
    matchedFlowIds: [],
    isFallback: true
  };
}
