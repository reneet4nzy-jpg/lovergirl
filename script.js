const PASSWORD = "yourconstellationnowandforever";

let spilled = false;
let lastOpenedPaper = null;

// Replace later with your real 100 messages.
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

modal.classList.add("hidden");

// Password
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

// Jar click
jar.addEventListener("click", () => {
  if (spilled) return;
  spilled = true;

  if (jarTitle) jarTitle.style.display = "none";
  jarWrap.classList.add("tipped");

  setTimeout(() => {
    spillBurstThenArrange();
  }, 450);
});

function spillBurstThenArrange() {
  // clear old
  papersWrap.innerHTML = "";

  // build exactly 100 notes (repeat if needed for demo)
  const pool = [];
  while (pool.length < 100) pool.push(...messages);
  pool.length = 100;

  // jar mouth position inside papers
  const papersRect = papersWrap.getBoundingClientRect();
  const jarRect = jarWrap.getBoundingClientRect();
  const mouthX = (jarRect.left + jarRect.width / 2) - papersRect.left + 45; // right side
  const mouthY = (jarRect.top + jarRect.height / 2) - papersRect.top + 10;

  const W = papersWrap.clientWidth;
  const H = papersWrap.clientHeight;

  const created = [];

  // quick “burst spill” (short animation)
  for (let i = 0; i < pool.length; i++) {
    const msg = pool[i];
    const preview = msg.slice(0, 22) + (msg.length > 22 ? "…" : "");

    const p = document.createElement("div");
    p.className = "paper flying";
    p.innerHTML = `<div class="preview">${escapeHtml(preview)}</div>`;

    p.style.left = mouthX + "px";
    p.style.top = mouthY + "px";
    p.addEventListener("click", () => openMessage(msg, p));

    papersWrap.appendChild(p);
    created.push(p);

    const rot = rand(-25, 25);
    const dx = rand(30, 220);          // pour outward
    const dy = rand(-30, 140);         // slight up/down
    const settleY = rand(180, H - 150); // temporary “floor” in box

    const delay = i * 6;

    setTimeout(() => {
      // stage 1: shoot out from mouth
      p.animate(
        [
          { transform: `translate(0px,0px) rotate(${rot}deg)` },
          { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)` }
        ],
        { duration: 280, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
      );

      // stage 2: drop down to a random temporary landing (avoids big pile)
      setTimeout(() => {
        p.animate(
          [
            { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)` },
            { transform: `translate(${dx}px, ${settleY}px) rotate(${rot}deg)` }
          ],
          { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }
        );
      }, 260);
    }, delay);
  }

  // After burst, switch to tray layout
  setTimeout(() => {
    arrangeIntoScrollableGrid(created);
  }, 1400);
}

function arrangeIntoScrollableGrid(papers) {
  // Turn container into scroll tray
  papersWrap.classList.add("tray");

  // Make a grid wrapper
  const grid = document.createElement("div");
  grid.className = "papersGrid";

  // Move notes into grid and remove flying shadow
  papers.forEach((p) => {
    p.classList.remove("flying");
    p.style.opacity = 1;
    p.style.transform = "";
    grid.appendChild(p);
  });

  papersWrap.innerHTML = "";
  papersWrap.appendChild(grid);

  // Scroll to top neatly
  papersWrap.scrollTop = 0;
}

// Modal
function openMessage(text, paperEl) {
  if (lastOpenedPaper && lastOpenedPaper !== paperEl) {
    lastOpenedPaper.classList.remove("opened");
    lastOpenedPaper.style.opacity = 1;
  }

  lastOpenedPaper = paperEl;
  paperEl.classList.add("opened");
  paperEl.style.opacity = 0.85;

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

// utils
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
