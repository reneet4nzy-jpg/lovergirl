// =================================================
// PASSWORD
// =================================================

const PASSWORD = "1234";

// =================================================
// SAMPLE MESSAGES (replace later if you want)
// =================================================

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

// =================================================
// DOM
// =================================================

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

modal.classList.add("hidden");

let spilled = false;
let lastOpenedPaper = null;

// =================================================
// PASSWORD LOGIC
// =================================================

enterBtn.addEventListener("click", () => {
  if (pw.value === PASSWORD) {
    gate.classList.add("hidden");
    app.classList.remove("hidden");
  } else {
    gateMsg.textContent = "Wrong password 😭";
  }
});

pw.addEventListener("keydown", (e) => {
  if (e.key === "Enter") enterBtn.click();
});

// =================================================
// JAR TIP + SPILL
// =================================================

jar.addEventListener("click", () => {
  if (spilled) return;
  spilled = true;

  if (jarTitle) jarTitle.style.display = "none";

  // tip jar sideways
  jarWrap.classList.add("tipped");

  // wait for rotation animation before spilling
  setTimeout(() => {
    spillPapers(true);
  }, 500);
});

// =================================================
// SPILL FUNCTION (SIDE POUR)
// =================================================

function spillPapers(isTipped = false) {
  const W = papersWrap.clientWidth;
  const H = papersWrap.clientHeight;

  const pool = [...messages].sort(() => Math.random() - 0.5);
  const count = Math.min(100, pool.length);

  // jar mouth position (right side when tipped)
  const mouthX = isTipped ? W / 2 + 60 : W / 2;
  const mouthY = isTipped ? 60 : 35;

  for (let i = 0; i < count; i++) {

    const msg = pool[i];
    const preview = msg.slice(0, 22) + (msg.length > 22 ? "…" : "");

    const p = document.createElement("div");
    p.className = "paper";
    p.innerHTML = `<div class="preview">${preview}</div>`;

    p.style.left = mouthX + "px";
    p.style.top = mouthY + "px";

    const rot = rand(-35, 35);

    p.addEventListener("click", () => openMessage(msg, p));
    papersWrap.appendChild(p);

    // physics variables
    let x = 0;
    let y = 0;

    // sideways pour if tipped
    let vx = isTipped ? rand(4, 10) : rand(-4, 4);
    let vy = isTipped ? rand(-2, 2) : rand(2, 6);

    const gravity = 0.5;
    const friction = 0.985;
    const bounce = 0.55;

    const delay = i * 15;

    setTimeout(() => {

      function tick() {

        vy += gravity;
        vx *= friction;
        vy *= friction;

        x += vx;
        y += vy;

        const floor = H - 120;

        if (y > floor) {
          y = floor;
          vy = -vy * bounce;
          if (Math.abs(vy) < 0.8) vy = 0;
        }

        p.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;

        if (Math.abs(vx) > 0.2 || Math.abs(vy) > 0.2) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);

    }, delay);
  }
}

// =================================================
// MODAL
// =================================================

function openMessage(text, paperEl) {
  if (lastOpenedPaper && lastOpenedPaper !== paperEl) {
    lastOpenedPaper.classList.remove("opened");
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
  if (lastOpenedPaper) lastOpenedPaper.classList.remove("opened");
}

// =================================================
// UTIL
// =================================================

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
