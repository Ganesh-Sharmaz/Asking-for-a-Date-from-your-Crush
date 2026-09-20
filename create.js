const form = document.querySelector('#date-form');
const formStatus = document.querySelector('#form-status');
const listStatus = document.querySelector('#list-status');
const linkList = document.querySelector('#link-list');
const saveButton = document.querySelector('#save-button');
const cancelEdit = document.querySelector('#cancel-edit');
const successBox = document.querySelector('#success-box');
const createdLink = document.querySelector('#created-link');
const copyLink = document.querySelector('#copy-link');
let editingSlug = null;

function setStatus(element, message, error = false) {
  element.textContent = message;
  element.classList.toggle('error', error);
}

function readForm() {
  return Object.fromEntries(new FormData(form).entries());
}

function fillForm(link) {
  for (const [key, value] of Object.entries(link)) {
    const field = form.elements.namedItem(key);
    if (field) field.value = value || '';
  }
  editingSlug = link.slug;
  saveButton.textContent = 'Save changes ✨';
  cancelEdit.hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm(hideSuccess = true) {
  form.reset();
  editingSlug = null;
  saveButton.textContent = 'Save & create link ✨';
  cancelEdit.hidden = true;
  if (hideSuccess) successBox.classList.remove('visible');
  setStatus(formStatus, '');
}

function renderLinks(links, limit) {
  linkList.innerHTML = '';
  if (!links.length) {
    setStatus(listStatus, `No links yet. You can create ${limit} free links.`);
    return;
  }
  setStatus(listStatus, `${links.length} of ${limit} free links used.`);
  for (const link of links) {
    const card = document.createElement('article');
    card.className = 'link-card';
    const heading = document.createElement('h3');
    heading.textContent = link.name ? `${link.name}'s date page` : 'Your date page';
    const url = `${window.location.origin}/${link.slug}`;
    const description = document.createElement('p');
    description.textContent = url;
    const actions = document.createElement('div');
    actions.className = 'link-card-actions';
    actions.innerHTML = `<a class="mini-button" href="/${link.slug}" target="_blank" rel="noopener">Open</a><button class="mini-button" data-edit="${link.slug}" type="button">Edit</button><button class="mini-button" data-copy="${link.slug}" type="button">Copy</button><button class="mini-button" data-delete="${link.slug}" type="button">Delete</button>`;
    card.append(heading, description, actions);
    linkList.append(card);
  }
}

async function loadLinks() {
  try {
    const response = await fetch('/api/links', { credentials: 'same-origin' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not load your links.');
    renderLinks(data.links, data.limit);
    if (!data.canCreate && !editingSlug) saveButton.disabled = true;
  } catch (error) {
    setStatus(listStatus, error.message, true);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const wasEditing = Boolean(editingSlug);
  saveButton.disabled = true;
  setStatus(formStatus, editingSlug ? 'Saving your changes…' : 'Creating your little link…');
  try {
    const endpoint = editingSlug ? `/api/links/${editingSlug}` : '/api/links';
    const response = await fetch(endpoint, { method: editingSlug ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(readForm()) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not save this page.');
    if (!editingSlug) {
      const url = `${window.location.origin}${data.url}`;
      createdLink.href = url;
      createdLink.textContent = url;
      successBox.classList.add('visible');
    }
    setStatus(formStatus, editingSlug ? 'Your changes are saved.' : 'Your link is ready to share.');
    resetForm(wasEditing);
    await loadLinks();
  } catch (error) {
    setStatus(formStatus, error.message, true);
  } finally {
    saveButton.disabled = false;
  }
});

cancelEdit.addEventListener('click', resetForm);
copyLink.addEventListener('click', async () => {
  await navigator.clipboard.writeText(createdLink.href);
  copyLink.textContent = 'Copied 💘';
  setTimeout(() => { copyLink.textContent = 'Copy link'; }, 1600);
});

linkList.addEventListener('click', async (event) => {
  const target = event.target;
  const slug = target.dataset.edit || target.dataset.copy || target.dataset.delete;
  if (!slug) return;
  const response = await fetch('/api/links', { credentials: 'same-origin' });
  const data = await response.json();
  const link = data.links.find((item) => item.slug === slug);
  if (!link) return;
  if (target.dataset.edit) return fillForm(link);
  if (target.dataset.copy) {
    await navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
    target.textContent = 'Copied';
    setTimeout(() => { target.textContent = 'Copy'; }, 1200);
  }
  if (target.dataset.delete && window.confirm('Delete this date page? This cannot be undone.')) {
    const deleteResponse = await fetch(`/api/links/${slug}`, { method: 'DELETE', credentials: 'same-origin' });
    if (deleteResponse.ok) await loadLinks();
  }
});

fetch('/api/visitor', { credentials: 'same-origin' }).catch(() => {});
loadLinks();
