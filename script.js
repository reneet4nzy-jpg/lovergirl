/* ============================= */
/* PASSWORD SYSTEM               */
/* ============================= */

const PASSWORD = "1234";

const messages = Array.from({ length: 30 }, (_, i) =>
  [
    "You are my calm in chaos.",
    "I still get excited every time I see you.",
    "You make ordinary days feel special.",
    "Your laugh is my favourite sound.",
    "You feel like home.",
    "I would choose you in every lifetime."
  ][i % 6]
);

const gate = document.getElementById("gate");
const app = document.getElementById("app");
const pw = document.getElementById("pw");
const enterBtn = document.getElementById("enterBtn");
const gateMsg = document.getElementById("gateMsg");

enterBtn.addEventListener("click", () => {
  if (pw.value === PASSWORD) {
    gate.classList.add("hidden");
    app.classList.remove("hidden");
  } else {
    gateMsg.textContent = "typo perchance? insert sad hampter";
  }
});

/* ============================= */
/* JAR + SPILL ANIMATION        */
/* ============================= */

const jarWrap = document.querySelector(".jarWrap");
const jar = document.getElementById("jar");
const papers = document.getElementById("papers");
const jarTitle = document.getElementById("jarTitle");

let hasSpilled = false;

jar.addEventListener("click", () => {
  if (hasSpilled) return;
  hasSpilled = true;

  if (jarTitle) jarTitle.style.display = "none";

  jarWrap.classList.add("tipped");

  setTimeout(() => {
    spillNotes();
  }, 500);
});

function spillNotes() {
  const papersRect = papers.getBoundingClientRect();

  messages.forEach((text, i) => {
    const note = document.createElement("div");
    note.className = "paper flying";

    // RANDOM PERMANENT TILT (-8deg to 8deg)
    const randomTilt = (Math.random() * 16 - 8).toFixed(2);
    note.style.setProperty("--rot", `${randomTilt}deg`);

    const preview = document.createElement("div");
    preview.className = "preview";
    preview.textContent = text;
    note.appendChild(preview);

    papers.appendChild(note);

    // start from jar area
    const startX = papersRect.width / 2 - 70;
    const startY = 40;

    note.style.setProperty("--tx", `${startX}px`);
    note.style.setProperty("--ty", `${startY}px`);

    // animate downward with slight horizontal drift
    setTimeout(() => {
      const drift = (Math.random() * 120 - 60);
      const drop = 350 + Math.random() * 120;

      note.style.setProperty("--tx", `${startX + drift}px`);
      note.style.setProperty("--ty", `${drop}px`);
    }, 50);
  });

  // after fall → convert to tray grid
  setTimeout(() => {
    papers.classList.add("tray");
    papers.classList.remove("flying");

    const grid = document.createElement("div");
    grid.className = "papersGrid";

    const notes = Array.from(document.querySelectorAll(".paper"));

    notes.forEach(note => {
      note.classList.remove("flying");

      // KEEP the same tilt (do not overwrite --rot)
      note.style.setProperty("--tx", "0px");
      note.style.setProperty("--ty", "0px");

      grid.appendChild(note);
    });

    papers.innerHTML = "";
    papers.appendChild(grid);

  }, 900);
}

/* ============================= */
/* MODAL SYSTEM                 */
/* ============================= */

const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeModal");

document.addEventListener("click", e => {
  const note = e.target.closest(".paper");
  if (!note) return;

  const fullText = note.querySelector(".preview").textContent;
  modalText.textContent = fullText;
  modal.classList.remove("hidden");
  note.classList.add("opened");
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  document.querySelectorAll(".paper.opened")
    .forEach(n => n.classList.remove("opened"));
});
