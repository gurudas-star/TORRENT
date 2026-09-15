"""
email_sender.py — SMTP email sender via Gmail
Sends the AI-generated reply back to the customer.
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import (
    EMAIL_ADDRESS, EMAIL_APP_PASSWORD,
    SMTP_HOST, SMTP_PORT, COMPANY_NAME, BCC_EMAIL
)

ITC_SIGNATURE = """

──────────────────────────────────────
{company_name} | Customer Care Team
📞 1800-345-6789 (Toll-Free, 9AM–6PM)
📧 customercare@itcportal.com
🌐 www.itcportal.com
──────────────────────────────────────
This is an automated response. For further assistance, please reply to this email.
""".format(company_name=COMPANY_NAME)


def send_reply(
    to_email: str,
    to_name: str,
    subject: str,
    body: str,
) -> bool:
    """
    Send an email reply via Gmail SMTP.
    Returns True on success, False on failure.
    """
    try:
        msg = MIMEMultipart("alternative")
        msg["From"]    = f"{COMPANY_NAME} Customer Care <{EMAIL_ADDRESS}>"
        msg["To"]      = f"{to_name} <{to_email}>"
        msg["Subject"] = f"Re: {subject}" if not subject.startswith("Re:") else subject

        if BCC_EMAIL:
            msg["Bcc"] = BCC_EMAIL

        # Combine AI reply with professional signature
        full_body = body.strip() + ITC_SIGNATURE

        # Plain text part
        msg.attach(MIMEText(full_body, "plain"))

        # HTML part (nicely formatted)
        html_body = _to_html(full_body)
        msg.attach(MIMEText(html_body, "html"))

        # Send via Gmail SMTP
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_APP_PASSWORD)
            recipients = [to_email]
            if BCC_EMAIL:
                recipients.append(BCC_EMAIL)
            server.sendmail(EMAIL_ADDRESS, recipients, msg.as_string())

        print(f"[SMTP] Reply sent successfully to {to_email}")
        return True

    except smtplib.SMTPAuthenticationError:
        print("[SMTP] Authentication failed. Check EMAIL_APP_PASSWORD in .env")
        return False
    except Exception as e:
        print(f"[SMTP] Failed to send email: {e}")
        return False


def _to_html(text: str) -> str:
    """Convert plain text to a styled HTML email."""
    lines = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    paragraphs = "".join(
        f"<p style='margin:0 0 12px 0;'>{line}</p>" if line.strip() else "<br>"
        for line in lines.splitlines()
    )
    return f"""
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;font-size:14px;color:#333;
             max-width:600px;margin:0 auto;padding:20px;">
  <div style="background:#1a472a;padding:16px 24px;border-radius:8px 8px 0 0;">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVteGK2JpivOb-Rw9Be2W1YwRpd6NIYS-WYg&s"
         alt="ITC" height="40" style="vertical-align:middle;">
    <span style="color:white;font-size:16px;margin-left:12px;font-weight:bold;">
      Customer Care
    </span>
  </div>
  <div style="border:1px solid #ddd;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
    {paragraphs}
  </div>
</body>
</html>
"""
