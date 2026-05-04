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
  juggle: ["./assets/mascot_juggle.webm?v=2"],
  kickPose: "./assets/mascot_kick.png?v=2",
  ball: ["./assets/ball_logo.png.png?v=2"],
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

function isVideoUrl(url) {
  return /\.(mp4|webm|mov|avi)$/i.test(url.toLowerCase());
}

function createTransparentVideo(videoElement) {
  // Create canvas for chroma key processing
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas size to match video
  canvas.width = videoElement.videoWidth || 400;
  canvas.height = videoElement.videoHeight || 400;
  
  // Apply canvas styles
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.objectFit = 'contain';
  canvas.style.objectPosition = 'center bottom';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';
  
  // Function to process frame and remove black background
  function processFrame() {
    if (videoElement.readyState >= 2) {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      // Draw video frame to canvas
      ctx.drawImage(videoElement, 0, 0);
      
      // Get image data for processing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Process each pixel to remove black/dark backgrounds
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate brightness
        const brightness = (r + g + b) / 3;
        
        // If pixel is very dark (black background), make it transparent
        if (brightness < 30) {
          data[i + 3] = 0; // Set alpha to 0 (transparent)
        }
        // If pixel is dark but not black, reduce opacity
        else if (brightness < 60) {
          data[i + 3] = Math.max(0, (brightness - 30) * 8.5); // Gradual transparency
        }
      }
      
      // Put processed image data back to canvas
      ctx.putImageData(imageData, 0, 0);
    }
    
    // Continue processing if video is playing
    if (!videoElement.paused && !videoElement.ended) {
      requestAnimationFrame(processFrame);
    }
  }
  
  // Start processing when video loads
  videoElement.addEventListener('loadeddata', () => {
    processFrame();
  });
  
  // Continue processing when video plays
  videoElement.addEventListener('play', () => {
    processFrame();
  });
  
  return canvas;
}

function loadMascotClip(sources, { loop }) {
  const video = mascot;
  let index = 0;
  video.loop = Boolean(loop);

  const tryNext = () => {
    // Skip raster images, we want video files
    while (index < sources.length && isRasterImageUrl(sources[index])) {
      index += 1;
    }
    if (index >= sources.length) {
      video.removeAttribute("src");
      video.load();
      return;
    }

    const url = sources[index];
    console.log(`Loading mascot video: ${url}`);

    const onError = () => {
      console.error(`Failed to load video: ${url}`);
      video.removeEventListener("error", onError);
      video.removeEventListener("loadeddata", onLoaded);
      index += 1;
      tryNext();
    };

    const onLoaded = () => {
      console.log(`Successfully loaded video: ${url}`);
      video.removeEventListener("error", onError);
      video.removeEventListener("loadeddata", onLoaded);
      
      // Hide original video and create transparent version
      video.style.opacity = '0';
      
      // Create and insert transparent canvas
      const transparentCanvas = createTransparentVideo(video);
      const shell = mascotShell();
      if (shell && !shell.querySelector('canvas')) {
        shell.appendChild(transparentCanvas);
      }
      
      video.play().catch((err) => {
        console.error('Error playing video:', err);
      });
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
  console.log('Initializing mascot...');
  
  // Set kick pose image
  if (kickPoseImg) {
    kickPoseImg.src = ASSETS.kickPose;
    console.log('Kick pose image set:', ASSETS.kickPose);
  }
  
  // Check if video is already loaded
  const video = document.getElementById('mascot');
  if (video) {
    console.log('Video element found');
    console.log('Video src:', video.src);
    console.log('Video readyState:', video.readyState);
    
    // Force load the video if not already loading
    if (!video.src || video.src.includes('.mp4')) {
      console.log('Setting correct WebM source...');
      video.src = './assets/mascot_juggle.webm';
      video.load();
    }
    
    video.addEventListener('loadeddata', () => {
      console.log('Video loaded successfully!');
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
    });
    
    video.addEventListener('error', (e) => {
      console.error('Video loading error:', e);
    });
    
    // Try to play the video
    video.play().catch(err => {
      console.log('Autoplay prevented, video will play on user interaction');
    });
  }
  
  // Load mascot clip using the original function (but simplified)
  // loadMascotClip(ASSETS.juggle, { loop: true });
  
  const idleTargetX = window.innerWidth * 0.65;
  setFacingTowardClick(idleTargetX);
  positionKickToeAnchor();

  window.addEventListener("click", onClick, { passive: true });
  window.addEventListener("resize", positionKickToeAnchor, { passive: true });
}

init();

// Function to switch between different transparency modes
function setTransparencyMode(mode) {
  const stage = document.getElementById("mascot-stage");
  
  // Remove all mode classes
  stage.classList.remove('screen-mode', 'multiply-mode', 'chroma-mode', 'css-transparent');
  
  // Add the selected mode class
  if (mode !== 'default') {
    stage.classList.add(mode);
  }
  
  console.log(`Transparency mode set to: ${mode}`);
}

// Auto-detect best mode based on background
function autoDetectTransparencyMode() {
  // Simple heuristic: if background is light, use multiply; if dark, use screen
  const bodyBg = window.getComputedStyle(document.body).backgroundColor;
  const isLightBackground = bodyBg === 'rgb(255, 255, 255)' || bodyBg === 'white' || bodyBg === 'transparent';
  
  if (isLightBackground) {
    setTransparencyMode('multiply-mode');
  } else {
    setTransparencyMode('screen-mode');
  }
}

// Initialize with auto-detection
// autoDetectTransparencyMode();