"""
email_listener.py — Gmail IMAP listener
Polls the inbox for unread emails and returns structured email data.
"""
import imaplib
import email
import re
from email.header import decode_header
from email.utils import parseaddr
from config import EMAIL_ADDRESS, EMAIL_APP_PASSWORD, IMAP_HOST, IMAP_PORT, WHITELIST_EMAILS


def _decode_str(value: str) -> str:
    """Decode encoded email header strings."""
    if not value:
        return ""
    parts = decode_header(value)
    decoded = []
    for part, charset in parts:
        if isinstance(part, bytes):
            try:
                decoded.append(part.decode(charset or "utf-8", errors="replace"))
            except Exception:
                decoded.append(part.decode("utf-8", errors="replace"))
        else:
            decoded.append(part)
    return " ".join(decoded).strip()


def _get_body(msg) -> str:
    """Extract plain-text body from an email message."""
    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            disposition = str(part.get("Content-Disposition", ""))
            if ctype == "text/plain" and "attachment" not in disposition:
                try:
                    charset = part.get_content_charset() or "utf-8"
                    body = part.get_payload(decode=True).decode(charset, errors="replace")
                    break
                except Exception:
                    continue
    else:
        try:
            charset = msg.get_content_charset() or "utf-8"
            body = msg.get_payload(decode=True).decode(charset, errors="replace")
        except Exception:
            body = ""
    return body.strip()


def fetch_unread_complaints() -> list[dict]:
    """
    Connect to Gmail IMAP, fetch all UNSEEN emails, and return a list of dicts.
    Each dict: {message_id, sender_name, sender_email, subject, body}
    Marks fetched emails as SEEN so they are not re-processed.
    """
    emails = []

    try:
        mail = imaplib.IMAP4_SSL(IMAP_HOST, IMAP_PORT)
        mail.login(EMAIL_ADDRESS, EMAIL_APP_PASSWORD)
        mail.select("INBOX")

        _, data = mail.search(None, "UNSEEN")
        all_ids = data[0].split()

        if not all_ids:
            print("[IMAP] No new emails.")
            mail.logout()
            return []

        # Only take the most recent 5 to avoid AI rate limits on backlogs
        ids = all_ids[-5:]
        
        print(f"[IMAP] Found {len(all_ids)} unread email(s), processing latest {len(ids)}.")

        for num in ids:
            _, msg_data = mail.fetch(num, "(RFC822)")
            raw = msg_data[0][1]
            msg = email.message_from_bytes(raw)

            # Extract message-id for deduplication
            message_id = msg.get("Message-ID", "").strip()
            if not message_id:
                message_id = f"no-id-{num.decode()}"

            # Extract sender
            raw_from = msg.get("From", "")
            sender_name, sender_email_addr = parseaddr(raw_from)
            sender_name  = _decode_str(sender_name) or sender_email_addr
            sender_email_addr = sender_email_addr.lower()

            # Skip emails from ourselves (avoid reply loops)
            if sender_email_addr == EMAIL_ADDRESS.lower():
                continue

            # Safety lock: Only process emails from the authorised whitelist
            if sender_email_addr not in WHITELIST_EMAILS:
                print(f"[IMAP] Skipping email from {sender_email_addr} (not whitelisted)")
                continue

            subject = _decode_str(msg.get("Subject", "(No Subject)"))
            body    = _get_body(msg)

            # Mark as read
            mail.store(num, "+FLAGS", "\\Seen")

            emails.append({
                "message_id":   message_id,
                "sender_name":  sender_name,
                "sender_email": sender_email_addr,
                "subject":      subject,
                "body":         body,
            })
            print(f"[IMAP] Email from: {sender_email_addr} | Subject: {subject[:60]}")

        mail.logout()

    except imaplib.IMAP4.error as e:
        print(f"[IMAP] Login failed: {e}")
        print("[IMAP] Check your App Password and make sure IMAP is enabled in Gmail settings.")
    except Exception as e:
        print(f"[IMAP] Unexpected error: {e}")

    return emails
