const card = document.querySelector('#date-card');
const slug = new URLSearchParams(window.location.search).get('slug') || window.location.pathname.slice(1);

function showError(message) {
  card.innerHTML = `<p class="eyebrow">Oops</p><h1>This little link is missing.</h1><p class="date-message">${message}</p><a class="button" href="/">Go home</a>`;
}

function render(link) {
  card.innerHTML = '';
  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = link.name ? `A question from ${link.name}` : 'A tiny question for you';
  const title = document.createElement('h1');
  title.textContent = link.question;
  const art = document.createElement('div');
  art.className = 'date-art';
  art.textContent = '💌';
  const actions = document.createElement('div');
  actions.className = 'date-actions';
  const yes = document.createElement('button');
  yes.className = 'button';
  yes.textContent = link.yesText;
  const no = document.createElement('button');
  no.className = 'button no-button';
  no.textContent = link.noText;
  actions.append(yes, no);
  const final = document.createElement('div');
  final.className = 'final-state';
  const finalTitle = document.createElement('h2');
  finalTitle.textContent = link.finalText;
  const finalButton = document.createElement('a');
  finalButton.className = 'button';
  finalButton.textContent = link.finalButtonText;
  finalButton.href = `https://wa.me/${link.dialCode.replace(/\D/g, '')}${link.phone}?text=${encodeURIComponent(link.finalText)}`;
  final.append(finalTitle, finalButton);
  card.append(eyebrow, title, art, actions, final);

  let escaped = false;
  let frame = null;
  const moveNo = (event) => {
    escaped = true;
    no.style.position = 'absolute';
    const area = actions.getBoundingClientRect();
    const x = Math.random() * Math.max(0, area.width - no.offsetWidth);
    const y = Math.random() * Math.max(0, area.height - no.offsetHeight);
    no.style.left = `${x}px`;
    no.style.top = `${y}px`;
  };
  no.addEventListener('click', moveNo);
  no.addEventListener('pointerenter', (event) => { if (escaped) moveNo(event); });
  yes.addEventListener('click', () => { actions.style.display = 'none'; art.style.display = 'none'; final.classList.add('visible'); });
}

async function load() {
  if (!slug) return showError('The address does not include a date page.');
  try {
    const response = await fetch(`/api/links/${encodeURIComponent(slug)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'This page may have been deleted.');
    render(data.link);
  } catch (error) {
    showError(error.message);
  }
}

fetch('/api/visitor', { credentials: 'same-origin' }).catch(() => {});
load();
