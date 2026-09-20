const slug = new URLSearchParams(window.location.search).get('slug') || window.location.pathname.slice(1);
const container = document.querySelector('#date-container');
const confirmation = document.querySelector('#date-confirmation');
const loading = document.querySelector('#date-loading');
const question = document.querySelector('#date-question');
const yes = document.querySelector('#yes');
const no = document.querySelector('#no');
const finalText = document.querySelector('#final-text');
const fix = document.querySelector('#fix');
let noIsEscaping = false;
let lastNoMove = 0;
let noAnimationFrame = null;

function track(event) {
  fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify({ slug, event }) }).catch(() => {});
}

function showError(message) {
  loading.textContent = message;
}

function moveNoButton(pointerX = null, pointerY = null, snap = false) {
  no.style.position = 'absolute';
  no.style.zIndex = '20';
  const containerRect = container.getBoundingClientRect();
  const answerBox = container.querySelector('.answer-box');
  const answerBoxRect = answerBox.getBoundingClientRect();
  const maxX = Math.max(0, container.clientWidth - no.offsetWidth);
  const containerMaxY = Math.max(0, container.clientHeight - no.offsetHeight);
  const answerZoneTop = Math.max(0, answerBoxRect.top - containerRect.top - 18);
  const answerZoneBottom = Math.min(containerMaxY, answerBoxRect.bottom - containerRect.top - no.offsetHeight + 18);
  const minY = Math.min(answerZoneTop, answerZoneBottom);
  const maxY = Math.max(minY, answerZoneBottom);
  let xPosition = 0;
  let yPosition = minY;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidateX = Math.floor(Math.random() * (maxX + 1));
    const candidateY = minY + Math.floor(Math.random() * (maxY - minY + 1));
    const candidateCenterX = containerRect.left + candidateX + no.offsetWidth / 2;
    const candidateCenterY = containerRect.top + candidateY + no.offsetHeight / 2;
    const distanceFromPointer = pointerX === null ? Infinity : Math.hypot(candidateCenterX - pointerX, candidateCenterY - pointerY);
    xPosition = candidateX;
    yPosition = candidateY;
    if (distanceFromPointer > 140) break;
  }

  if (snap) {
    no.style.left = `${xPosition}px`;
    no.style.top = `${yPosition}px`;
    return;
  }

  const startX = Number.parseFloat(no.style.left) || no.offsetLeft || 0;
  const startY = Number.parseFloat(no.style.top) || no.offsetTop || minY;
  const isArched = Math.random() > 0.45;
  const midpointX = (startX + xPosition) / 2;
  const midpointY = (startY + yPosition) / 2;
  const direction = Math.random() > 0.5 ? 1 : -1;
  const curveAmount = isArched ? (70 + Math.random() * 90) * direction : 0;
  const controlX = Math.min(maxX, Math.max(0, midpointX - curveAmount));
  const controlY = Math.min(maxY, Math.max(minY, midpointY + curveAmount * 0.55));
  const duration = 650 + Math.random() * 350;
  const startTime = performance.now();

  if (noAnimationFrame !== null) cancelAnimationFrame(noAnimationFrame);
  const animate = (currentTime) => {
    const progress = Math.min(1, (currentTime - startTime) / duration);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const inverse = 1 - easedProgress;
    const currentX = inverse * inverse * startX + 2 * inverse * easedProgress * controlX + easedProgress * easedProgress * xPosition;
    const currentY = inverse * inverse * startY + 2 * inverse * easedProgress * controlY + easedProgress * easedProgress * yPosition;
    no.style.left = `${currentX}px`;
    no.style.top = `${currentY}px`;
    if (progress < 1) noAnimationFrame = requestAnimationFrame(animate);
    else noAnimationFrame = null;
  };
  noAnimationFrame = requestAnimationFrame(animate);
}

function showFinal(link) {
  container.hidden = true;
  confirmation.hidden = false;
  finalText.textContent = link.finalText;
  fix.textContent = link.finalButtonText;
  fix.onclick = () => {
    track('whatsapp_click');
    window.location.href = `https://wa.me/${link.dialCode.replace(/\D/g, '')}${link.phone}?text=${encodeURIComponent(link.finalText)}`;
  };
}

async function load() {
  if (!slug) return showError('This date link is missing.');
  try {
    const response = await fetch(`/api/links/${encodeURIComponent(slug)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'This date link does not exist.');
    const link = data.link;
    question.textContent = link.question;
    yes.textContent = link.yesText;
    no.textContent = link.noText;
    container.hidden = false;
    loading.hidden = true;

    track('page_view');
    yes.addEventListener('click', () => { track('yes_click'); showFinal(link); });
    no.addEventListener('click', (event) => {
      noIsEscaping = true;
      moveNoButton(event.clientX, event.clientY, true);
    });
    no.addEventListener('pointerenter', (event) => {
      if (noIsEscaping) {
        lastNoMove = Date.now();
        moveNoButton(event.clientX, event.clientY);
      }
    });
    document.addEventListener('pointermove', (event) => {
      if (!noIsEscaping || Date.now() - lastNoMove < 280) return;
      const rect = no.getBoundingClientRect();
      const distance = Math.hypot(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2));
      if (distance < 150) {
        lastNoMove = Date.now();
        moveNoButton(event.clientX, event.clientY);
      }
    });
  } catch (error) {
    showError(error.message);
  }
}

fetch('/api/visitor', { credentials: 'same-origin' }).catch(() => {});
load();
