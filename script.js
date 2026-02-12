// NOTE: Front-end "passwords" are not truly secure on static sites.
// For casual privacy, this is fine.
const PASSWORD = "yourconstellationnowandforever";

let lastOpenedPaper = null;

const messages = [
  "Message 1: I love you.",
  "Message 2: You’re my favourite person.",
  "Message 3: Thank you for being you.",
  // ...replace with your full 100 messages
];

const gate = document.getElementById("gate");
const app = document.getElementById("app");
const pw = document.getElementById("pw");
const enterBtn = document.getElementById("enterBtn");
const gateMsg = document.getElementById("gateMsg");

const jar = document.getElementById("jar");
const papersWrap = document.getElementById("papers");

const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeModal");

enterBtn.addEventListener("click", () => {
  if (pw.value === PASSWORD) {
    gate.classList.add("hidden");
    app.classList.remove("hidden");
  } else {
    gateMsg.textContent = "Typo perhaps? insert sad hampter";
  }
});

pw.addEventListener("keydown", (e) => {
  if (e.key === "Enter") enterBtn.click();
});

let spilled = false;

jar.addEventListener("click", () => {
  if (spilled) return;
  spilled = true;
  jar.textContent = "🫙✨";
  spillPapers();
});

function spillPapers() {
  const W = papersWrap.clientWidth;
  const H = papersWrap.clientHeight;

  // Shuffle messages and use up to 100
  const pool = [...messages].sort(() => Math.random() - 0.5);
  const count = Math.min(100, pool.length);

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "paper";
const msg = pool[i];
const preview = msg.slice(0, 22) + (msg.length > 22 ? "…" : "");

p.innerHTML = `<div class="preview">${escapeHtml(preview)}</div>`;

    const startX = W * 0.5;
    const startY = 30;

    const endX = rand(20, W - 60);
    const endY = rand(70, H - 50);

    const rot = rand(-40, 40);
    p.style.setProperty("--rot", rot + "deg");

    p.style.left = startX + "px";
    p.style.top = startY + "px";
    p.style.opacity = 0;

    p.addEventListener("click", () => openMessage(msg, p));

    papersWrap.appendChild(p);

    // simple "spill" animation
    requestAnimationFrame(() => {
      p.style.opacity = 1;
      p.animate(
        [
          { transform: `translate(0,0) rotate(${rot}deg)` },
          { transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(${rot}deg)` }
        ],
        { duration: rand(500, 1200), easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }
      );
    });
  }
}

function openMessage(text, paperEl) {
  lastOpenedPaper = paperEl;   // remember which paper was clicked
  paperEl.classList.add("opened");

  modalText.textContent = text;
  modal.classList.remove("hidden");

  paperEl.style.opacity = 0.6;
}

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  if (lastOpenedPaper) lastOpenedPaper.classList.remove("opened");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    if (lastOpenedPaper) lastOpenedPaper.classList.remove("opened");
  }
});

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
