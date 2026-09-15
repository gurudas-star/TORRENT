"""
database.py — SQLite database setup and all CRUD operations
"""
import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "itc_complaints.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create tables on first run."""
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS complaints (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_email    TEXT NOT NULL,
            sender_name     TEXT,
            subject         TEXT,
            body            TEXT,
            product_name    TEXT,
            issue_category  TEXT,
            sub_category    TEXT,
            urgency         TEXT,
            ai_reply        TEXT,
            status          TEXT DEFAULT 'pending',
            received_at     TEXT,
            replied_at      TEXT,
            message_id      TEXT UNIQUE,
            reference_id    TEXT
        )
    """)
    # Migration: Ensure new columns exist if table was already created
    try:
        conn.execute("ALTER TABLE complaints ADD COLUMN reference_id TEXT")
    except sqlite3.OperationalError:
        pass # Column already exists
    try:
        conn.execute("ALTER TABLE complaints ADD COLUMN sub_category TEXT")
    except sqlite3.OperationalError:
        pass # Column already exists
    conn.commit()
    conn.close()
    print("[DB] Database initialised.")


def is_already_processed(message_id: str) -> bool:
    """Check if this email was already handled (avoid duplicates)."""
    conn = get_connection()
    row = conn.execute(
        "SELECT id FROM complaints WHERE message_id = ?", (message_id,)
    ).fetchone()
    conn.close()
    return row is not None


def save_complaint(
    sender_email: str,
    sender_name: str,
    subject: str,
    body: str,
    product_name: str,
    issue_category: str,
    sub_category: str,
    urgency: str,
    ai_reply: str,
    message_id: str,
    reference_id: str = None,
    status: str = "replied",
) -> int:
    """Insert a new complaint record and return its ID."""
    conn = get_connection()
    now = datetime.now().isoformat()
    cur = conn.execute(
        """
        INSERT INTO complaints
            (sender_email, sender_name, subject, body, product_name,
             issue_category, sub_category, urgency, ai_reply, status, 
             received_at, replied_at, message_id, reference_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            sender_email, sender_name, subject, body, product_name,
            issue_category, sub_category, urgency, ai_reply, status, 
            now, now, message_id, reference_id,
        ),
    )
    conn.commit()
    row_id = cur.lastrowid
    conn.close()
    return row_id


def get_all_complaints(limit: int = 200):
    """Fetch all complaints ordered by newest first."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM complaints ORDER BY received_at DESC LIMIT ?", (limit,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_stats():
    """Return summary statistics for the dashboard."""
    conn = get_connection()

    total     = conn.execute("SELECT COUNT(*) FROM complaints").fetchone()[0]
    replied   = conn.execute("SELECT COUNT(*) FROM complaints WHERE status='replied'").fetchone()[0]
    pending   = conn.execute("SELECT COUNT(*) FROM complaints WHERE status='pending'").fetchone()[0]
    today_str = datetime.now().strftime("%Y-%m-%d")
    today     = conn.execute(
        "SELECT COUNT(*) FROM complaints WHERE replied_at LIKE ?", (f"{today_str}%",)
    ).fetchone()[0]

    # Category breakdown
    categories = conn.execute(
        "SELECT issue_category, COUNT(*) as cnt FROM complaints GROUP BY issue_category"
    ).fetchall()

    # Urgency breakdown
    urgencies = conn.execute(
        "SELECT urgency, COUNT(*) as cnt FROM complaints GROUP BY urgency"
    ).fetchall()

    conn.close()
    return {
        "total":       total,
        "replied":     replied,
        "pending":     pending,
        "today":       today,
        "categories":  {r["issue_category"]: r["cnt"] for r in categories},
        "urgencies":   {r["urgency"]: r["cnt"] for r in urgencies},
    }
