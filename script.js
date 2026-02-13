// NOTE: Front-end passwords aren't truly secure on static sites.
// For casual privacy, it's fine.
const PASSWORD = "1234";

let spilled = false;
let lastOpenedPaper = null;

// You can replace these later with your real 100 messages.
const messages = [
  "You are my favourite hello and my hardest goodbye.",
  "I love the way your eyes soften when you smile.",
  "You make ordinary days feel like magic.",
  "Thank you for choosing me.",
  "You are my calm in every storm.",
  "I still get excited every time I see your name.",
  "You feel like home.",
  "I would choose you in every lifetime.",
  "You make my world warmer.",
  "Your laugh is my favourite sound."
];

// DOM
const gate = document.getElementById("gate");
const app = document.getElementById("app");
const pw = document.getElementById("pw");
const enterBtn = document.getElementById("enterBtn");
const gateMsg = document.getElementById("gateMsg");

const jar = document.getElementById("jar");
const jarWrap = document.getElementById("jarWrap");
const jarTitle = document.getElementById("jarTitle");

const papersWrap = document.getElementById("papers");

const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeModal");

// Ensure modal starts hidden even if CSS loads late
modal.classList.add("hidden");

// Password gate
enterBtn.addEventListener("click", () => {
  if (pw.value === PASSWORD) {
    gate.classList.add("hidden");
    app.classList.remove("hidden");
  } else {
    gateMsg.textContent = "Typo perchance? insert sad hampter";
  }
});

pw.addEventListener("keydown", (e) => {
  if (e.key === "Enter") enterBtn.click();
});

// Jar click: hide title, tip jar, then spill
jar.addEventListener("click", () => {
  if (spilled) return;
  spilled = true;

  if (jarTitle) jarTitle.style.display = "none";
  jarWrap.classList.add("tipped");

  setTimeout(() => spillPapers(true), 500);
});

function spillPapers(isTipped = false) {
  const W = papersWrap.clientWidth;
  const H = papersWrap.clientHeight;

  // Use up to 100 notes (repeat if you have <100 sample msgs)
  const pool = [];
  while (pool.length < 100) {
    pool.push(...messages);
  }
  pool.length = 100;

  // Where is the jar INSIDE the papers box?
  const papersRect = papersWrap.getBoundingClientRect();
  const jarRect = jarWrap.getBoundingClientRect();

  const jarCenterX = (jarRect.left + jarRect.width / 2) - papersRect.left;
  const jarCenterY = (jarRect.top + jarRect.height / 2) - papersRect.top;

  // Mouth offset: when tipped, pour from the right side of jar
  const mouthX = isTipped ? jarCenterX + 45 : jarCenterX;
  const mouthY = isTipped ? jarCenterY + 10 : jarCenterY;

  const PAPER_W = 110;
  const PAPER_H = 80;

  for (let i = 0; i < pool.length; i++) {
    const msg = pool[i];
    const preview = msg.slice(0, 22) + (msg.length > 22 ? "…" : "");

    const p = document.createElement("div");
    p.className = "paper";
    p.innerHTML = `<div class="preview">${escapeHtml(preview)}</div>`;

    // Anchor at jar mouth
    p.style.left = mouthX + "px";
    p.style.top = mouthY + "px";

    p.addEventListener("click", () => openMessage(msg, p));
    papersWrap.appendChild(p);

    // Physics-ish
    let x = 0, y = 0;
    const rot = rand(-35, 35);

    // Pour direction:
    // tipped: mostly right, a bit upward/downward, then gravity takes over
    let vx = isTipped ? rand(5, 12) : rand(-4, 4);
    let vy = isTipped ? rand(-3, 3) : rand(2, 6);

    const gravity = 0.55;
    const friction = 0.985;
    const bounce = 0.55;

    // keep inside box: clamp relative to mouth position
    const minX = -mouthX + 10;
    const maxX = (W - PAPER_W) - mouthX - 10;
    const minY = -mouthY + 10;
    const maxY = (H - PAPER_H) - mouthY - 10;

    // Stagger so it feels like a pour
    const delay = i * 16;

    setTimeout(() => {
      function tick() {
        // integrate
        vy += gravity;
        vx *= friction;
        vy *= friction;

        x += vx;
        y += vy;

        // bounce off boundaries
        if (x < minX) { x = minX; vx *= -0.6; }
        if (x > maxX) { x = maxX; vx *= -0.6; }
        if (y < minY) { y = minY; vy *= -0.6; }
        if (y > maxY) { y = maxY; vy *= -bounce; }

        p.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;

        // stop when basically settled
        const settled = Math.abs(vx) < 0.18 && Math.abs(vy) < 0.25;
        if (!settled) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }, delay);
  }
}

// Modal open/close
function openMessage(text, paperEl) {
  if (lastOpenedPaper && lastOpenedPaper !== paperEl) {
    lastOpenedPaper.classList.remove("opened");
    lastOpenedPaper.style.opacity = 1;
  }

  lastOpenedPaper = paperEl;
  paperEl.classList.add("opened");
  paperEl.style.opacity = 0.6;

  modalText.textContent = text;
  modal.classList.remove("hidden");
}

closeModal.addEventListener("click", closeModalFn);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModalFn();
});

function closeModalFn() {
  modal.classList.add("hidden");
  modalText.textContent = "";
  if (lastOpenedPaper) {
    lastOpenedPaper.classList.remove("opened");
    lastOpenedPaper.style.opacity = 1;
  }
}

// Helpers
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    "\"":"&quot;",
    "'":"&#39;"
  }[c]));
}
