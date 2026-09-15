"""
config.py — Centralised configuration loader for ITC AI Email Bot
"""
import os
from dotenv import load_dotenv

load_dotenv()

# ── Gmail ────────────────────────────────────────────────────────────────────
EMAIL_ADDRESS       = os.getenv("EMAIL_ADDRESS", "gurudas99219@gmail.com")
EMAIL_APP_PASSWORD  = os.getenv("EMAIL_APP_PASSWORD", "")

IMAP_HOST = "imap.gmail.com"
IMAP_PORT = 993
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587

# ── Ollama Local AI ──────────────────────────────────────────────────────────
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL    = os.getenv("OLLAMA_MODEL", "llama3")

# ── Bot Behaviour ────────────────────────────────────────────────────────────
POLL_INTERVAL_SECONDS = int(os.getenv("POLL_INTERVAL_SECONDS", "60"))
COMPANY_NAME          = os.getenv("COMPANY_NAME", "ITC Limited")
BCC_EMAIL             = os.getenv("BCC_EMAIL", "")

# ── Whitelist (Safety Lock) ───────────────────────────────────────────────────
WHITELIST_EMAILS = [
    "gurunpr@gmail.com",
    "abhijit.pati@ikontel.com",
    "sanjay.rout@ikontel.com",
    "anoushka.agnihotri@ikontel.com"
]

# ── ITC Product Context (fed to the AI) ─────────────────────────────────────
ITC_PRODUCT_CATALOG = """
ITC Limited Product Categories:
1. FMCG - Foods: Aashirvaad Atta, Sunfeast Biscuits & Noodles, Bingo Chips,
   Yippee Noodles, B Natural Juices, Dark Fantasy, Farmland
2. FMCG - Personal Care: Fiama (shampoo/soap), Vivel (soap), Engage (deodorant),
   Dermafique (skincare), Savlon (antiseptic)
3. FMCG - Home Care: Nimyle (floor cleaner), Mangaldeep (agarbatti/incense),
   Classmate (stationery & notebooks)
4. Cigarettes & Cigars: Gold Flake, Classic, India Kings, Navy Cut, Wills
5. Hotels: ITC Hotels, WelcomHotel, Fortune Hotels
6. Agribusiness: Agri commodities, e-Choupal
7. Paperboards & Packaging: ITC Paperboards, Packaging solutions
"""