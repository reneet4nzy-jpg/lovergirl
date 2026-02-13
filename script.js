/* ================================= */
/* PASSWORD SYSTEM                   */
/* ================================= */

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

/* ================================= */
/* JAR + SPILL PHYSICS               */
/* ================================= */

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
  }, 450);
});

function spillNotes() {
  const W = papers.clientWidth;
  const H = papers.clientHeight;

  const states = [];

  messages.forEach((text) => {
    const note = document.createElement("div");
    note.className = "paper flying";

    const randomTilt = (Math.random() * 16 - 8).toFixed(2);
    note.style.setProperty("--rot", `${randomTilt}deg`);

    const preview = document.createElement("div");
    preview.className = "preview";
    preview.textContent = text;
    note.appendChild(preview);

    papers.appendChild(note);

    const startX = W / 2 - 70;
    const startY = 60;

    note.style.setProperty("--tx", `${startX}px`);
    note.style.setProperty("--ty", `${startY}px`);

    states.push({
      el: note,
      x: startX,
      y: startY,
      vx: (Math.random() * 10 - 5),
      vy: -(Math.random() * 8),
      tilt: randomTilt
    });
  });

  const gravity = 0.7;
  const bounce = 0.75;
  const friction = 0.992;
  const floor = H - 110;

  let start = null;
  const duration = 2600;

  function animate(time) {
    if (!start) start = time;
    const elapsed = time - start;

    states.forEach(s => {
      s.vy += gravity;
      s.x += s.vx;
      s.y += s.vy;

      s.vx *= friction;

      if (s.y > floor) {
        s.y = floor;
        s.vy *= -bounce;
      }

      if (s.x < 0 || s.x > W - 140) {
        s.vx *= -bounce;
      }

      s.el.style.setProperty("--tx", `${s.x}px`);
      s.el.style.setProperty("--ty", `${s.y}px`);
    });

    if (elapsed < duration) {
      requestAnimationFrame(animate);
    } else {
      settleIntoGrid(states);
    }
  }

  requestAnimationFrame(animate);
}

/* ================================= */
/* SMOOTH SETTLE INTO GRID           */
/* ================================= */

function settleIntoGrid(states) {
  papers.classList.add("tray");

  const grid = document.createElement("div");
  grid.className = "papersGrid";

  states.forEach((s, i) => {
    setTimeout(() => {
      s.el.classList.remove("flying");

      s.el.style.transition = "all 600ms cubic-bezier(.2,.9,.2,1)";
      s.el.style.setProperty("--tx", "0px");
      s.el.style.setProperty("--ty", "0px");

      grid.appendChild(s.el);
    }, i * 20);
  });

  setTimeout(() => {
    papers.innerHTML = "";
    papers.appendChild(grid);
  }, 800);
}

/* ================================= */
/* MODAL SYSTEM                      */
/* ================================= */

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
