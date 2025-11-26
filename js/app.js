// Live Google Sheet CSV URL (tickets data)
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbbDDjYaOGEd9bgF9IKaarmaWw-Yz2Pd0f_C4gelacmktiqjris1vqBufc-G-acPQJ12kOhBZYHpeR/pub?output=csv";

// EXPECTED COLUMN NAMES (you can adjust)
const STATUS_COLUMN = "Status"; // e.g. "Scanned", "Pending"
const GATE_COLUMN = "Gate"; // gate name/number

async function fetchTickets() {
  try {
    const res = await fetch(SHEET_CSV_URL, { cache: "no-store" });
    const csvText = await res.text();
    const { headers, rows } = parseCsv(csvText);

    updateDashboard(headers, rows);
  } catch (err) {
    console.error("Error fetching tickets CSV:", err);
  }
}

// Simple CSV parser (no quotes handling — good for clean sheets)
function parseCsv(csv) {
  const lines = csv.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] ? values[i].trim() : "";
    });
    return obj;
  });
  return { headers, rows };
}

function updateDashboard(headers, rows) {
  const totalTickets = rows.length;

  // Count scanned tickets based on status column = "Scanned"
  let scanned = 0;
  let gatesSet = new Set();

  rows.forEach((row) => {
    const statusVal = (row[STATUS_COLUMN] || "").toLowerCase();
    if (statusVal === "scanned" || statusVal === "used") {
      scanned++;
    }

    const gateVal = row[GATE_COLUMN];
    if (gateVal && gateVal.trim() !== "") {
      gatesSet.add(gateVal.trim());
    }
  });

  const pending = totalTickets - scanned;
  const gateCount = gatesSet.size;

  // Update KPI cards
  setText("totalTickets", totalTickets);
  setText("scannedTickets", scanned);
  setText("pendingTickets", pending);
  setText("gateCount", gateCount);

  // Fill table preview
  renderTable(headers, rows);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderTable(headers, rows) {
  const headEl = document.getElementById("ticketsHead");
  const bodyEl = document.getElementById("ticketsBody");
  if (!headEl || !bodyEl) return;

  // Build header row
  headEl.innerHTML = "";
  const headerRow = document.createElement("tr");
  headers.forEach((h) => {
    const th = document.createElement("th");
    th.textContent = h;
    headerRow.appendChild(th);
  });
  headEl.appendChild(headerRow);

  // Body: show up to 20 rows
  bodyEl.innerHTML = "";
  const maxRows = 20;
  rows.slice(0, maxRows).forEach((row) => {
    const tr = document.createElement("tr");
    headers.forEach((h) => {
      const td = document.createElement("td");
      td.textContent = row[h] || "";
      tr.appendChild(td);
    });
    bodyEl.appendChild(tr);
  });
}

// Auto-run
document.addEventListener("DOMContentLoaded", () => {
  fetchTickets();
  // Optional auto-refresh every 60 seconds:
  setInterval(fetchTickets, 60000);
});
