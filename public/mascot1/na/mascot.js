const stage = document.getElementById("mascot-stage");
const mascot = document.getElementById("mascot");
const kickPoseImg = document.getElementById("mascot-kick-pose");
const kickToe = document.getElementById("kick-toe");

const KICK_DURATION_MS = 1000;
const KICK_BALL_RELEASE_MS = 160;
const KICK_FACING_INVERT = false;

/**
 * Flying ball size + toe spawn (normalized in shell 0-1). Ball image only while shooting.
 */
const BALL = {
  diameterRatio: 0.19,
  diameterCoverBoost: 1.0,
  toeX: 0.56,
  toeY: 0.9,
};

const ASSETS = {
  juggle: ["./assets/mascot_juggle.mp4"],
  kickPose: "./assets/mascot_kick.png",
  ball: ["./assets/ball_logo.png.png"],
};

let isLocked = false;
let activeAnimationId = 0;
let facing = "right";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const easeOutCubic = (t) => 1 - (1 - t) ** 3;
const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

function mascotShell() {
  return stage.querySelector(".mascot-shell");
}

function withFallback(img, sources) {
  let index = 0;
  const loadCurrent = () => {
    img.src = sources[index];
  };
  img.onerror = () => {
    index += 1;
    if (index < sources.length) {
      loadCurrent();
    }
  };
  loadCurrent();
}

function isRasterImageUrl(url) {
  return /\.(png|jpe?g|webp|avif)$/i.test(url.toLowerCase());
}

function loadMascotClip(sources, { loop }) {
  const video = mascot;
  let index = 0;
  video.loop = Boolean(loop);

  const tryNext = () => {
    while (index < sources.length && isRasterImageUrl(sources[index])) {
      index += 1;
    }
    if (index >= sources.length) {
      video.removeAttribute("src");
      video.load();
      return;
    }

    const url = sources[index];

    const onError = () => {
      video.removeEventListener("error", onError);
      video.removeEventListener("loadeddata", onLoaded);
      index += 1;
      tryNext();
    };

    const onLoaded = () => {
      video.removeEventListener("error", onError);
      video.removeEventListener("loadeddata", onLoaded);
      video.play().catch(() => {});
    };

    video.addEventListener("error", onError, { once: true });
    video.addEventListener("loadeddata", onLoaded, { once: true });
    video.src = url;
    video.load();
  };

  tryNext();
}

function setFacingTowardClick(clickX) {
  const rect = stage.getBoundingClientRect();
  const stageMidX = rect.left + rect.width * 0.5;
  let towardRight = clickX >= stageMidX;
  if (KICK_FACING_INVERT) {
    towardRight = !towardRight;
  }
  facing = towardRight ? "right" : "left";
  stage.style.setProperty("--facing", facing === "right" ? "1" : "-1");
}

function ballDiameterPx() {
  const sh = mascotShell();
  if (!sh) {
    return 48;
  }
  const base = sh.clientWidth * BALL.diameterRatio * BALL.diameterCoverBoost;
  return clamp(base, 22, 120);
}

function positionKickToeAnchor() {
  const sh = mascotShell();
  if (!sh || !kickToe) {
    return;
  }
  const w = sh.clientWidth;
  const h = sh.clientHeight;
  kickToe.style.left = `${w * BALL.toeX}px`;
  kickToe.style.top = `${h * BALL.toeY}px`;
}

function getToeAnchorViewport() {
  const sh = mascotShell();
  if (kickToe) {
    const r = kickToe.getBoundingClientRect();
    return {
      x: r.left + r.width / 2,
      y: r.top + r.height / 2,
    };
  }
  if (!sh) {
    return { x: 0, y: 0 };
  }
  const r = sh.getBoundingClientRect();
  const w = sh.clientWidth;
  const h = sh.clientHeight;
  return {
    x: r.left + w * BALL.toeX,
    y: r.top + h * BALL.toeY,
  };
}

/** Only one flying ball in the DOM at a time. */
function removeAllShotBalls() {
  document.querySelectorAll(".shot-ball").forEach((el) => {
    el.remove();
  });
}

function createShotBall(startPosition) {
  const node = document.createElement("div");
  const img = document.createElement("img");
  const d = ballDiameterPx();

  node.className = "shot-ball";
  node.style.width = `${d}px`;
  node.style.height = `${d}px`;
  node.style.left = `${startPosition.x}px`;
  node.style.top = `${startPosition.y}px`;

  withFallback(img, ASSETS.ball);

  node.appendChild(img);
  document.body.appendChild(node);
  return node;
}

function setShotBallTransform(node, x, y, rotationDeg, scale) {
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  node.style.transform = `translate(-50%, -50%) rotate(${rotationDeg}deg) scale(${scale})`;
}

function animateShot(start, end) {
  removeAllShotBalls();
  const shotId = ++activeAnimationId;
  const node = createShotBall(start);
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const duration = clamp(520 + distance * 0.45, 520, 1100);
  const arcHeight = clamp(distance * 0.22, 55, 200);
  const direction = end.x >= start.x ? 1 : -1;
  const startTime = performance.now();

  return new Promise((resolve) => {
    const step = (now) => {
      if (shotId !== activeAnimationId) {
        node.remove();
        resolve();
        return;
      }

      const t = clamp((now - startTime) / duration, 0, 1);
      const p = easeOutCubic(t);

      const x = start.x + (end.x - start.x) * p;
      const baseY = start.y + (end.y - start.y) * p;
      const arcY = arcHeight * 4 * p * (1 - p);
      const y = baseY - arcY;

      const rotation = direction * (35 + p * 620);
      const scale = 1 - p * 0.16;
      const fade = t > 0.92 ? 1 - (t - 0.92) / 0.08 : 1;

      node.style.opacity = String(fade);
      setShotBallTransform(node, x, y, rotation, scale);

      if (t < 1) {
        window.requestAnimationFrame(step);
        return;
      }

      node.classList.add("impact");
      window.setTimeout(() => {
        node.remove();
        resolve();
      }, 140);
    };

    window.requestAnimationFrame(step);
  });
}

async function handleKick(clickX, clickY) {
  if (isLocked) {
    return;
  }
  if (document.querySelector(".shot-ball")) {
    return;
  }

  isLocked = true;
  setFacingTowardClick(clickX);
  positionKickToeAnchor();

  const shell = mascotShell();
  mascot.pause();
  shell?.classList.add("kicking");

  const releaseMs = clamp(KICK_BALL_RELEASE_MS, 120, KICK_DURATION_MS - 80);
  await wait(releaseMs);

  positionKickToeAnchor();
  const start = getToeAnchorViewport();

  const shotPromise = animateShot(start, { x: clickX, y: clickY });

  await wait(KICK_DURATION_MS);

  shell?.classList.remove("kicking");
  loadMascotClip(ASSETS.juggle, { loop: true });

  await shotPromise;

  removeAllShotBalls();
  positionKickToeAnchor();
  isLocked = false;
}

function onClick(event) {
  if (event.button !== 0 && event.button !== undefined) {
    return;
  }
  handleKick(event.clientX, event.clientY);
}

function init() {
  if (kickPoseImg) {
    kickPoseImg.src = ASSETS.kickPose;
  }
  loadMascotClip(ASSETS.juggle, { loop: true });
  const idleTargetX = window.innerWidth * 0.65;
  setFacingTowardClick(idleTargetX);
  positionKickToeAnchor();

  window.addEventListener("click", onClick, { passive: true });
  window.addEventListener("resize", positionKickToeAnchor, { passive: true });
}

init();
