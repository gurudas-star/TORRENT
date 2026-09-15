"""
ai_analyzer.py — Google Gemini AI integration
Analyses complaint emails and generates professional, personalised replies.
"""
import json
import re
import urllib.request
import urllib.error
from config import OLLAMA_BASE_URL, OLLAMA_MODEL, COMPANY_NAME, ITC_PRODUCT_CATALOG


def get_salutation(sender_name: str) -> str:
    if not sender_name or '@' in sender_name:
        return "Sir/Madam"
    
    first = sender_name.split()[0]
    # If the first name has digits or is extremely long, treat it as a random string
    if any(char.isdigit() for char in first) or len(first) > 20:
        return "Sir/Madam"
        
    return first.capitalize()


ANALYSIS_PROMPT_TEMPLATE = """
You are an expert customer-care AI assistant for {company_name}.

{product_catalog}

A customer has sent the following email:
---
FROM: {sender_name} <{sender_email}>
SUBJECT: {subject}
REFERENCE ID: {reference_id}

{body}
---

Your tasks:
1. Identify which ITC product or service this message is about (if any).
2. Classify the message into ONE of these high-level **Categories**:
   - **Complaint**: Issues regarding product, delivery, billing, or quality.
   - **Query**: Questions about price, product features, or general information.
   - **Suggestion**: Ideas for improvement or new products.
   - **Feedback**: General comments on the brand or service.
   - **Compliment**: Positive appreciation and gratitude.
   - **Irrelevant**: Messages completely unrelated to ITC products, services, or businesses (e.g., personal issues, plumbing, internet problems, spam).

3. Assign a specific **Sub-category** based on the content (e.g., "Quality Issue", "Price Comparison", "Brand Support", etc.).

4. Assess urgency: High / Medium / Low
   - High: customer is very angry, health risk, urgent refund demand, or critical complaint.
   - Medium: dissatisfaction, technical query, or suggestion requiring attention.
   - Low: general info, compliments, or minor feedback.

4. Write a professional, contextual reply email in English.
   IF THE MESSAGE IS IRRELEVANT (Not related to ITC):
   - Address the customer with: "Dear {salutation_name},"
   - Politely inform them that they have reached ITC Customer Care and their message appears to be unrelated to our products or services.
   - Do NOT apologize for the issue and do NOT ask for product details.
   - Wish them well and close the email.

   IF IT IS A COMPLAINT / ISSUE (Related to ITC):
   - Address the customer with: "Dear {salutation_name},"
   - Acknowledge their specific problem clearly & apologize sincerely.
   - IF IT IS A QUALITY/FOOD COMPLAINT:
     * Warmly state this doesn't meet ITC standards.
     * **CRITICAL**: Use **BOLD** for any safety warnings (e.g., "**DO NOT CONSUME THE PRODUCT**").
     * Ask for details using a **BULLETED LIST** with **BOLD** labels and dashes:
       • **Product Name** - 
       • **Batch Number** - (printed on the pack)
       • **Date of Purchase** - 
       • **Store Name** - 
       • **Photo of packaging** - (if possible)
   - For all other complaints, explain that ITC will investigate on priority.

   IF IT IS POSITIVE FEEDBACK OR A COMPLIMENT (e.g. low prices):
   - Address the customer with: "Dear {salutation_name},"
   - Express genuine gratitude for their support, loyalty, and kind words
   - Highlight that ITC is highly committed to providing competitive pricing and great value.
   - Do NOT apologize. Keep the tone very warm and positive.

   The reply must end with a warm closing and ITC contact info. Sound human, empathetic, and NEVER use generic robotic statements. 
   Include the [Reference ID: {reference_id}] at the very end of the email.
   Max 250 words.

Return your response ONLY as valid JSON:
{{
  "product_name": "...",
  "issue_category": "...",
  "sub_category": "...",
  "urgency": "High|Medium|Low",
  "customer_first_name": "...",
  "ai_reply": "Full reply email body here..."
}}
"""


def analyze_and_reply(
    sender_name: str,
    sender_email: str,
    subject: str,
    body: str,
    reference_id: str = "ITC-GEN-0000",
) -> dict:
    """
    Send email content to Gemini and return structured analysis + reply.
    Returns a dict with keys: product_name, issue_category, urgency, ai_reply
    """
    salutation = get_salutation(sender_name)
    display_sender_name = sender_name if salutation != "Sir/Madam" else "Customer"
    
    prompt = ANALYSIS_PROMPT_TEMPLATE.format(
        company_name=COMPANY_NAME,
        product_catalog=ITC_PRODUCT_CATALOG,
        sender_name=display_sender_name,
        sender_email=sender_email,
        salutation_name=salutation,
        subject=subject,
        body=body[:3000], 
        reference_id=reference_id,
    )

    try:
        print(f"[AI] Sending local analysis request to {OLLAMA_MODEL}...")
        payload = {
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "format": "json"
        }
        req = urllib.request.Request(
            f"{OLLAMA_BASE_URL}/api/generate",
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        with urllib.request.urlopen(req) as response:
            result_raw = json.loads(response.read().decode('utf-8'))
            raw_text = result_raw.get('response', '{}').strip()

        # Strip markdown code fences if Ollama wraps in ```json ... ```
        raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
        raw_text = re.sub(r"\s*```$", "", raw_text)

        result = json.loads(raw_text)

        # Ensure all required keys exist
        result.setdefault("product_name", "ITC Product")
        result.setdefault("issue_category", "Feedback")
        result.setdefault("sub_category", "General")
        result.setdefault("urgency", "Medium")
        result["customer_first_name"] = salutation
        result.setdefault("ai_reply", _fallback_reply(sender_name, subject, reference_id))

        print(f"[AI] Analysed: product={result['product_name']} | "
              f"cat={result['issue_category']} | sub={result['sub_category']} | urgency={result['urgency']}")
        return result

    except Exception as e:
        print(f"[AI] Error during analysis: {e}")
        return {
            "product_name": "Unknown",
            "issue_category": "General Inquiry",
            "urgency": "Medium",
            "customer_first_name": get_salutation(sender_name),
            "ai_reply": _fallback_reply(sender_name, subject, reference_id),
        }


def _fallback_reply(sender_name: str, subject: str, reference_id: str) -> str:
    """Fallback reply when AI fails — still professional."""
    salutation = get_salutation(sender_name)
    return f"""Dear {salutation},

Thank you for reaching out to ITC Customer Care (Ref ID: {reference_id}).

We have received your email regarding "{subject}" and sincerely apologise for the experience. Our team is investigating this on priority.

To help us resolve this faster, please reply to this email with:
• Product Name
• Batch Number (printed on the pack)
• Date of Purchase
• Store Name

We value your loyalty and assure you of a resolution within 2-3 business days.

Warm regards,
ITC Customer Care Team
[Reference ID: {reference_id}]
"""
