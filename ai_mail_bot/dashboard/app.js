/**
 * app.js — ITC AI Email Bot Dashboard
 * Handles data fetching, rendering, filtering, and modals.
 */

let allComplaints = [];
let autoRefreshTimer = null;

// ── Initialise ──────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  startAutoRefresh();
  
  // Listen for category changes to update sub-category dropdown
  document.getElementById("filterCategory").addEventListener("change", updateSubCategoryOptions);
});

const SUB_CATEGORY_MAP = {
  "Complaint": ["Quality Issue", "Product Defect", "Delivery Issue", "Billing Issue", "Packaging Damage", "Other"],
  "Query": ["Price/Value Comparison", "General Inquiry", "Product Availability", "Other"],
  "Suggestion": ["Product Ideas", "Packaging Suggestions", "Other"],
  "Feedback": ["General Feedback", "Service Experience", "Other"],
  "Compliment": ["Appreciation", "Brand Support", "Other"]
};

function updateSubCategoryOptions() {
  const category = document.getElementById("filterCategory").value;
  const subSelect = document.getElementById("filterSubCategory");
  
  // Reset sub-category select
  subSelect.innerHTML = '<option value="">All Sub-categories</option>';
  
  if (category && SUB_CATEGORY_MAP[category]) {
    SUB_CATEGORY_MAP[category].forEach(sub => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      subSelect.appendChild(opt);
    });
  }
  
  // Trigger filter refresh
  applyFilters();
}

function startAutoRefresh() {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer);
  autoRefreshTimer = setInterval(loadData, 30000); // every 30 seconds
}

// ── Load Data ───────────────────────────────────────────────────────────────
async function loadData() {
  try {
    const [complaintsRes, statsRes] = await Promise.all([
      fetch("/api/complaints"),
      fetch("/api/stats"),
    ]);

    if (!complaintsRes.ok || !statsRes.ok) throw new Error("API error");

    allComplaints = await complaintsRes.json();
    const stats   = await statsRes.json();

    renderStats(stats);
    applyFilters();
    updateLastSync();
  } catch (err) {
    console.error("Failed to load data:", err);
    document.getElementById("tableBody").innerHTML =
      `<tr><td colspan="11" style="text-align:center;padding:40px;color:var(--red)">
        ⚠ Could not connect to the bot server. Make sure it's running on port 8000.
      </td></tr>`;
  }
}

function updateLastSync() {
  const now = new Date();
  document.getElementById("lastUpdate").textContent =
    `Last sync: ${now.toLocaleTimeString()}`;
}

// ── Render Stats ────────────────────────────────────────────────────────────
function renderStats(stats) {
  animateCount("valTotal",   stats.total   || 0);
  animateCount("valReplied", stats.replied || 0);
  animateCount("valToday",   stats.today   || 0);
  animateCount("valPending", (stats.pending || 0) + countFailed());
}

function countFailed() {
  return allComplaints.filter(c => c.status === "failed").length;
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const start   = parseInt(el.textContent) || 0;
  const diff    = target - start;
  const steps   = 20;
  let   step    = 0;
  const timer = setInterval(() => {
    step++;
    el.textContent = Math.round(start + (diff * step) / steps);
    if (step >= steps) { el.textContent = target; clearInterval(timer); }
  }, 25);
}

// ── Filter & Render Table ───────────────────────────────────────────────────
function applyFilters() {
  const search      = document.getElementById("searchInput").value.toLowerCase();
  const category    = document.getElementById("filterCategory").value;
  const subCategory = document.getElementById("filterSubCategory").value;
  const urgency     = document.getElementById("filterUrgency").value;
  const status      = document.getElementById("filterStatus").value;

  const filtered = allComplaints.filter(c => {
    const matchSearch =
      !search ||
      (c.sender_email  || "").toLowerCase().includes(search) ||
      (c.sender_name   || "").toLowerCase().includes(search) ||
      (c.subject       || "").toLowerCase().includes(search) ||
      (c.product_name  || "").toLowerCase().includes(search) ||
      (c.issue_category|| "").toLowerCase().includes(search) ||
      (c.sub_category  || "").toLowerCase().includes(search);

    const matchCat    = !category || c.issue_category === category;
    const matchSubCat = !subCategory || c.sub_category === subCategory;
    const matchUrg    = !urgency  || c.urgency        === urgency;
    const matchStatus = !status   || c.status         === status;

    return matchSearch && matchCat && matchSubCat && matchUrg && matchStatus;
  });

  renderTable(filtered);

  const empty = document.getElementById("emptyState");
  const wrap  = document.querySelector(".table-wrap");
  if (filtered.length === 0) {
    empty.style.display = "block";
    wrap.style.display  = "none";
  } else {
    empty.style.display = "none";
    wrap.style.display  = "block";
  }
}

function renderTable(complaints) {
  const tbody = document.getElementById("tableBody");
  if (!complaints.length) {
    tbody.innerHTML = "";
    return;
  }

  tbody.innerHTML = complaints.map((c, idx) => `
    <tr onclick="openDetail(${c.id})" title="Click to view full details">
      <td class="td-num">#${c.id}</td>
      <td>
        <div class="sender-name">${esc(c.sender_name || "Unknown")}</div>
        <div class="sender-email">${esc(c.sender_email)}</div>
      </td>
      <td class="td-ref"><code>${esc(c.reference_id || "—")}</code></td>
      <td class="td-subject" title="${esc(c.subject)}">${esc(c.subject || "—")}</td>
      <td class="td-product" title="${esc(c.product_name)}">${esc(c.product_name || "Unknown")}</td>
      <td>
        <span class="badge badge-category">${esc(c.issue_category || "Feedback")}</span>
      </td>
      <td>
        <span class="badge badge-subcat">${esc(c.sub_category || "General")}</span>
      </td>
      <td>
        <span class="badge badge-${urgencyClass(c.urgency)}">${esc(c.urgency || "—")}</span>
      </td>
      <td>
        <span class="badge badge-${c.status}">${esc(c.status)}</span>
      </td>
      <td class="td-time">${formatDate(c.received_at)}</td>
      <td>
        <button class="btn-view" onclick="event.stopPropagation(); openDetail(${c.id})">View</button>
      </td>
    </tr>
  `).join("");
}

function urgencyClass(u) {
  if (!u) return "medium";
  return u.toLowerCase();
}

function formatDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) +
      " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  } catch { return iso.slice(0, 16).replace("T", " "); }
}

function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Detail Modal ────────────────────────────────────────────────────────────
function openDetail(id) {
  const c = allComplaints.find(x => x.id === id);
  if (!c) return;

  document.getElementById("modalSubject").textContent = c.subject || "(No Subject)";
  document.getElementById("modalMeta").innerHTML =
    `From: <strong>${esc(c.sender_name)}</strong> &lt;${esc(c.sender_email)}&gt;
     &nbsp;·&nbsp; Received: ${formatDate(c.received_at)}
     &nbsp;·&nbsp; Replied: ${formatDate(c.replied_at)}`;

  document.getElementById("modalBadges").innerHTML = `
    <span class="badge badge-category">${esc(c.issue_category || "Feedback")}</span>
    <span class="badge badge-subcat">${esc(c.sub_category || "General")}</span>
    <span class="badge badge-${urgencyClass(c.urgency)}">${esc(c.urgency || "—")} Priority</span>
    <span class="badge badge-${c.status}">${esc(c.status)}</span>
    ${c.reference_id ? `<span class="badge" style="background:rgba(234,179,8,0.1);color:var(--yellow);border:1px solid rgba(234,179,8,0.3)">🆔 ${esc(c.reference_id)}</span>` : ""}
    ${c.product_name ? `<span class="badge" style="background:rgba(6,182,212,0.1);color:var(--cyan);border:1px solid rgba(6,182,212,0.3)">📦 ${esc(c.product_name)}</span>` : ""}
  `;

  document.getElementById("modalBody").textContent  = c.body    || "No body content.";
  document.getElementById("modalReply").textContent = c.ai_reply || "No reply generated.";

  document.getElementById("detailModal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDetailModal() {
  document.getElementById("detailModal").classList.remove("open");
  document.body.style.overflow = "";
}

function closeModal(event) {
  if (event.target === document.getElementById("detailModal")) closeDetailModal();
}

// ── Test / Simulate Modal ───────────────────────────────────────────────────
function openTestModal() {
  document.getElementById("testModal").classList.add("open");
  document.getElementById("testResult").style.display = "none";
  document.body.style.overflow = "hidden";
}

function closeTestModal() {
  document.getElementById("testModal").classList.remove("open");
  document.body.style.overflow = "";
}

function closeTestModalOut(event) {
  if (event.target === document.getElementById("testModal")) closeTestModal();
}

async function submitTestEmail() {
  const btn    = document.getElementById("submitTestBtn");
  const label  = document.getElementById("submitLabel");
  const result = document.getElementById("testResult");

  const payload = {
    sender_name:  document.getElementById("tName").value.trim(),
    sender_email: document.getElementById("tEmail").value.trim(),
    subject:      document.getElementById("tSubject").value.trim(),
    body:         document.getElementById("tBody").value.trim(),
  };

  if (!payload.sender_email || !payload.body) {
    showTestResult("error", "⚠ Please fill in all required fields.");
    return;
  }

  btn.disabled  = true;
  label.textContent = "⏳ AI is analysing…";

  try {
    const res  = await fetch("/api/test-email", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      showTestResult("success",
        `✅ AI Analysis Complete!\n\n` +
        `📦 Product: ${data.analysis.product_name}\n` +
        `🏷 Category: ${data.analysis.issue_category}\n` +
        `🧩 Sub-cat: ${data.analysis.sub_category}\n` +
        `🔥 Urgency: ${data.analysis.urgency}\n\n` +
        `The reply has been saved to the database. Refresh the table to see it.`
      );
      await loadData();
    } else {
      showTestResult("error", "❌ Something went wrong. Check the server console.");
    }
  } catch (err) {
    showTestResult("error", "❌ Connection failed. Is the bot server running?");
  } finally {
    btn.disabled     = false;
    label.textContent = "🚀 Run AI Bot";
  }
}

function showTestResult(type, msg) {
  const el = document.getElementById("testResult");
  el.className     = `test-result ${type}`;
  el.textContent   = msg;
  el.style.display = "block";
}
