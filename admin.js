const login = document.querySelector('#admin-login');
const dashboard = document.querySelector('#admin-dashboard');
const loginForm = document.querySelector('#admin-login-form');
const loginStatus = document.querySelector('#login-status');
const metricGrid = document.querySelector('#metric-grid');
const adminLinks = document.querySelector('#admin-links');
const adminLinkStatus = document.querySelector('#admin-link-status');
const growthList = document.querySelector('#growth-list');

function status(element, message, error = false) {
  element.textContent = message;
  element.classList.toggle('error', error);
}

async function api(path, options = {}) {
  const response = await fetch(path, { credentials: 'same-origin', ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed.');
  return data;
}

function renderMetrics(links, analytics) {
  const cards = [
    ['Created links', links.length, 'Total saved date pages'],
    ['Page views', analytics.byEvent.page_view || 0, 'Recorded public visits'],
    ['Yes responses', analytics.byEvent.yes_click || 0, 'Positive button clicks'],
    ['WhatsApp clicks', analytics.byEvent.whatsapp_click || 0, 'Final CTA clicks']
  ];
  metricGrid.innerHTML = cards.map(([label, value, hint]) => `<article class="metric-card"><span>${label}</span><strong>${value}</strong><small>${hint}</small></article>`).join('');
}

function renderGrowth(byDay) {
  growthList.innerHTML = '';
  const days = Object.entries(byDay).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 14);
  if (!days.length) {
    growthList.innerHTML = '<p class="status">No analytics yet. Share a date link to start collecting events.</p>';
    return;
  }
  for (const [day, count] of days) {
    const row = document.createElement('div');
    row.className = 'growth-row';
    row.innerHTML = `<span>${day}</span><strong>${count}</strong>`;
    growthList.append(row);
  }
}

function renderLinks(links, analytics) {
  adminLinks.innerHTML = '';
  status(adminLinkStatus, `${links.length} link${links.length === 1 ? '' : 's'} stored.`);
  if (!links.length) {
    status(adminLinkStatus, 'No user links have been created yet.');
    return;
  }
  for (const link of links) {
    const card = document.createElement('article');
    card.className = 'admin-link-card';
    const title = document.createElement('h3');
    title.textContent = link.name || 'Unnamed creator';
    const details = document.createElement('p');
    details.textContent = `${link.dialCode}${link.phone} · ${link.slug}`;
    const question = document.createElement('p');
    question.textContent = link.question;
    const finalMessage = document.createElement('p');
    finalMessage.textContent = `Final message: ${link.finalText}`;
    const owner = document.createElement('small');
    owner.textContent = `Creator session: ${(link.ownerId || '').slice(0, 12)}…`;
    const stats = analytics.bySlug[link.slug] || { pageViews: 0, yesClicks: 0, whatsappClicks: 0 };
    const actions = document.createElement('div');
    actions.className = 'link-card-actions';
    actions.innerHTML = `<a class="mini-button" href="/${link.slug}" target="_blank" rel="noopener">Open</a><button class="mini-button danger" data-remove="${link.slug}" type="button">Remove</button>`;
    const statLine = document.createElement('small');
    statLine.textContent = `Views ${stats.pageViews} · Yes ${stats.yesClicks} · WhatsApp ${stats.whatsappClicks}`;
    card.append(title, details, question, finalMessage, owner, statLine, actions);
    adminLinks.append(card);
  }
}

async function loadDashboard() {
  try {
    const [links, analytics] = await Promise.all([api('/api/admin/links'), api('/api/admin/analytics')]);
    renderMetrics(links.links, analytics);
    renderLinks(links.links, analytics);
    renderGrowth(analytics.byDay);
  } catch (error) {
    status(adminLinkStatus, error.message, true);
    if (error.message.includes('authentication')) showLogin();
  }
}

function showDashboard() {
  login.hidden = true;
  dashboard.hidden = false;
  loadDashboard();
}

function showLogin() {
  dashboard.hidden = true;
  login.hidden = false;
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = loginForm.querySelector('button');
  button.disabled = true;
  status(loginStatus, 'Checking credentials…');
  try {
    await api('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: loginForm.elements.username.value, password: loginForm.elements.password.value }) });
    loginForm.reset();
    showDashboard();
  } catch (error) {
    status(loginStatus, error.message, true);
  } finally {
    button.disabled = false;
  }
});

document.querySelector('#logout-button').addEventListener('click', async () => {
  await api('/api/admin/logout', { method: 'POST' });
  showLogin();
});
document.querySelector('#refresh-button').addEventListener('click', loadDashboard);
adminLinks.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-remove]');
  if (!button || !window.confirm(`Remove ${button.dataset.remove}? This cannot be undone.`)) return;
  button.disabled = true;
  try {
    await api(`/api/admin/links/${button.dataset.remove}`, { method: 'DELETE' });
    await loadDashboard();
  } catch (error) {
    status(adminLinkStatus, error.message, true);
    button.disabled = false;
  }
});

api('/api/admin/me').then(showDashboard).catch(showLogin);
