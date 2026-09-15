"""
main.py — FastAPI application entry point
Serves the dashboard and provides REST API for complaint data.
"""
import os
import atexit
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from database import init_db, get_all_complaints, get_stats, save_complaint
from scheduler import start_scheduler, stop_scheduler
from ai_analyzer import analyze_and_reply
from email_sender import send_reply
import uvicorn

app = FastAPI(title="ITC AI Email Bot", version="1.0.0")

# ── Serve Dashboard Static Files ─────────────────────────────────────────────
DASHBOARD_DIR = os.path.join(os.path.dirname(__file__), "dashboard")
app.mount("/static", StaticFiles(directory=DASHBOARD_DIR), name="static")


@app.get("/", include_in_schema=False)
async def serve_dashboard():
    return FileResponse(os.path.join(DASHBOARD_DIR, "index.html"))


# ── API Endpoints ─────────────────────────────────────────────────────────────

@app.get("/api/complaints")
def api_complaints(limit: int = 200):
    """Return all complaints as JSON."""
    return JSONResponse(content=get_all_complaints(limit))


@app.get("/api/stats")
def api_stats():
    """Return dashboard statistics."""
    return JSONResponse(content=get_stats())


class TestEmailPayload(BaseModel):
    sender_name:  str = "Test Customer"
    sender_email: str = "test@example.com"
    subject:      str = "Issue with my Sunfeast biscuits"
    body:         str = "I bought a pack of Sunfeast biscuits from the store yesterday and found foreign particles inside. This is very disappointing and I want a refund immediately."


@app.post("/api/test-email")
def api_test_email(payload: TestEmailPayload):
    """
    Simulate receiving an email — useful for testing without real Gmail.
    Runs full AI pipeline and saves to DB (does NOT send real email).
    """
    import time, random, string
    ref_date = time.strftime("%Y%m%d")
    ref_rand = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    fake_ref_id = f"ITC-TEST-{ref_date}-{ref_rand}"

    analysis = analyze_and_reply(
        sender_name=payload.sender_name,
        sender_email=payload.sender_email,
        subject=payload.subject,
        body=payload.body,
        reference_id=fake_ref_id,
    )

    # Manually ensure Reference ID is prominently included in the reply text
    final_reply = analysis["ai_reply"]
    if fake_ref_id not in final_reply:
        final_reply += f"\n\n---\n[Reference ID: {fake_ref_id}]"

    import hashlib, time
    fake_msg_id = hashlib.md5(f"{payload.sender_email}{payload.subject}{time.time()}".encode()).hexdigest()

    row_id = save_complaint(
        sender_email=payload.sender_email,
        sender_name=payload.sender_name,
        subject=payload.subject,
        body=payload.body,
        product_name=analysis["product_name"],
        issue_category=analysis["issue_category"],
        sub_category=analysis["sub_category"],
        urgency=analysis["urgency"],
        ai_reply=final_reply,
        message_id=fake_msg_id,
        reference_id=fake_ref_id,
        status="test",
    )

    return JSONResponse(content={
        "success": True,
        "id": row_id,
        "analysis": analysis,
    })


@app.get("/api/health")
async def health():
    return {"status": "ok", "bot": "ITC AI Email Bot v1.0"}


# ── Startup / Shutdown ────────────────────────────────────────────────────────

@app.on_event("startup")
async def on_startup():
    print("[APP] Initialising database...")
    init_db()
    print("[APP] Starting email scheduler...")
    start_scheduler()


@app.on_event("shutdown")
async def on_shutdown():
    stop_scheduler()


# ── Run ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
