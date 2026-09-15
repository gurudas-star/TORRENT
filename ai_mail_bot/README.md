# ITC AI Email Bot 🤖

Automated customer complaint email handler for ITC Limited.
Receives complaint emails → Analyses with Ollama AI → Sends personalised reply.

---

## ⚡ Quick Start (5 Steps)

### Step 1 — Install Python dependencies
```bash
cd ai_mail_bot
pip install -r requirements.txt
```

### Step 2 — Get your Gmail App Password
1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Click **"Create"** → Select **"Mail"** → Copy the 16-character password

### Step 3 — Install and Run Ollama
1. Download Ollama from [ollama.com](https://ollama.com)
2. Run `ollama run llama3` to download the model

### Step 4 — Enable IMAP in Gmail
1. Open Gmail → **Settings** (⚙️) → **See all settings**
2. Go to **"Forwarding and POP/IMAP"** tab
3. Under **IMAP Access**, select **"Enable IMAP"** → **Save Changes**

### Step 5 — Configure your `.env` file
```bash
# Copy the example file
copy .env.example .env
```
Then open `.env` and fill in:
```
EMAIL_ADDRESS=your_email@gmail.com
EMAIL_APP_PASSWORD=your_app_password
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

### Step 6 — Run the Bot!
```bash
python main.py
```

Open your browser: **[http://localhost:8000](http://localhost:8000)**

---

#
# 🧪 Testing Without Real Emails

You don't need to wait for real emails to test!
1. Open the dashboard at `http://localhost:8000`
2. Click **"Simulate Email"** button
3. Fill in a fake complaint → Click **"Run AI Bot"**
4. Watch the AI analyse and generate a reply in seconds!

---

## 🗂 Project Structure

```
ai_mail_bot/
├── main.py             # FastAPI server + dashboard serving
├── config.py           # All configuration
├── database.py         # SQLite database operations
├── email_listener.py   # Gmail IMAP — reads unread emails
├── email_sender.py     # Gmail SMTP — sends replies
├── ai_analyzer.py      # Ollama AI — analyses & generates reply
├── scheduler.py        # Background polling engine (every 60s)
├── requirements.txt    # Python dependencies
├── .env                # ⚠️ Your secrets (never share this!)
├── .env.example        # Template for .env
├── itc_complaints.db   # Auto-created SQLite database
└── dashboard/
    ├── index.html      # Dashboard UI
    ├── style.css       # Dark premium styles
    └── app.js          # Live data & interactivity
```

---

## 🔄 How It Works

```
Every 60 seconds:
  1. Bot connects to Gmail via IMAP
  2. Fetches all UNREAD emails from inbox
  3. For each email:
     a. Sends to Ollama AI with ITC product context
     b. AI returns: product_name, issue_category, urgency, reply_text
     c. Reply is sent back to customer via Gmail SMTP
     d. Complaint + reply saved to SQLite database
     e. Dashboard auto-refreshes every 30 seconds
```

---

## 📊 Dashboard Features

| Feature | Description |
|---|---|
| 📈 Live Stats | Total, Replied, Today, Pending counts |
| 🔍 Search | Filter by sender, product, subject |
| 🏷️ Category Filter | Delivery, Defect, Quality, Billing, etc. |
| 🔥 Urgency Badges | High / Medium / Low |
| 👁️ Detail View | Full email + full AI reply in modal |
| 🧪 Simulate | Test AI pipeline without real emails |
| 🔄 Auto Refresh | Dashboard updates every 30 seconds |

---

## 🔒 Security

- **NEVER** commit `.env` to git (it's in `.gitignore`)
- App Password ≠ your Gmail password (safe to use)
- All data stored locally in `itc_complaints.db`

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| `IMAP Login failed` | Check App Password, enable IMAP in Gmail settings |
| `Ollama connection failed` | Ensure Ollama is running (`ollama serve`) |
| `No emails being picked up` | Make sure emails are UNREAD in inbox |
| Bot replies to itself | Already handled — bot skips its own email address |
| Dashboard shows blank | Make sure `python main.py` is running on port 8000 |

---

## 📞 ITC Customer Care Contact
- 📞 1800-345-6789 (Toll-Free)
- 📧 customercare@itcportal.com
- 🌐 www.itcportal.com
