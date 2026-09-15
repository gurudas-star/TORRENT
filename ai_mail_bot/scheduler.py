"""
scheduler.py — Background polling engine
Runs check_and_reply() every POLL_INTERVAL_SECONDS using APScheduler.
"""
import random
import string
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from config import POLL_INTERVAL_SECONDS
from email_listener import fetch_unread_complaints
from ai_analyzer import analyze_and_reply
from email_sender import send_reply
from database import is_already_processed, save_complaint

scheduler = BackgroundScheduler()


def check_and_reply():
    """
    Main pipeline:
    1. Fetch unread complaint emails
    2. Analyze each with Gemini AI
    3. Send reply
    4. Save to database
    """
    print("\n[BOT] ---- Checking inbox ----")
    emails = fetch_unread_complaints()

    for em in emails:
        msg_id = em["message_id"]

        # Skip duplicates
        if is_already_processed(msg_id):
            print(f"[BOT] Already processed: {msg_id[:40]}... skipping.")
            continue

        print(f"[BOT] Processing: {em['subject'][:60]} from {em['sender_email']}")

        # Generate unique reference ID
        ref_date = datetime.now().strftime("%Y%m%d")
        ref_rand = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        reference_id = f"ITC-REF-{ref_date}-{ref_rand}"

        # AI analysis + reply generation
        analysis = analyze_and_reply(
            sender_name=em["sender_name"],
            sender_email=em["sender_email"],
            subject=em["subject"],
            body=em["body"],
        )

        # Manually ensure Reference ID is prominently included in the reply text
        final_reply = analysis["ai_reply"]
        if reference_id not in final_reply:
            final_reply += f"\n\n---\n[Reference ID: {reference_id}]"

        # Send reply
        sent = send_reply(
            to_email=em["sender_email"],
            to_name=em["sender_name"],
            subject=em["subject"],
            body=final_reply,
        )

        # Save to DB
        save_complaint(
            sender_email=em["sender_email"],
            sender_name=em["sender_name"],
            subject=em["subject"],
            body=em["body"],
            product_name=analysis["product_name"],
            issue_category=analysis["issue_category"],
            sub_category=analysis["sub_category"],
            urgency=analysis["urgency"],
            ai_reply=final_reply,
            message_id=msg_id,
            reference_id=reference_id,
            status="replied" if sent else "failed",
        )

        print(f"[BOT] Done: status={'replied' if sent else 'FAILED'}\n")

    print("[BOT] ---- Cycle complete ----")


def start_scheduler():
    """Start background polling."""
    scheduler.add_job(
        check_and_reply,
        trigger="interval",
        seconds=POLL_INTERVAL_SECONDS,
        id="email_poll",
        replace_existing=True,
    )
    scheduler.start()
    print(f"[SCHEDULER] Polling inbox every {POLL_INTERVAL_SECONDS}s. Press Ctrl+C to stop.")


def stop_scheduler():
    """Gracefully shut down."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        print("[SCHEDULER] Stopped.")
