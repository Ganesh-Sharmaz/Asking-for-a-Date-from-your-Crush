fetch('/api/visitor', { credentials: 'same-origin' }).catch(() => {});

if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
  const promo = document.createElement('aside');
  promo.className = 'base-promo';
  promo.innerHTML = '<p><strong>Have a question for someone?</strong><br>Make a cute page of your own.</p><div class="promo-actions"><a class="button secondary" href="/landing">Landing page</a><a class="button" href="/create">Create your own page</a></div>';
  document.body.append(promo);

  const modal = document.createElement('div');
  modal.className = 'welcome-modal';
  modal.innerHTML = '<section class="welcome-box" role="dialog" aria-modal="true" aria-labelledby="welcome-title"><button class="welcome-close" type="button" aria-label="Close">\u00d7</button><div class="date-art">\u{1F48C}</div><h2 id="welcome-title">Want your own?</h2><p>This is the original playful date page. You can make a personalized version with your own words and shareable link.</p><a class="button" href="/create">Create my page</a></section>';
  const showModal = () => {
    if (!document.body.contains(modal)) document.body.append(modal);
    setTimeout(() => { if (document.body.contains(modal)) closeModal(); }, 9000);
  };
  const closeModal = () => {
    modal.remove();
    setTimeout(showModal, 10000);
  };
  modal.querySelector('.welcome-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
  setTimeout(showModal, 10000);
}
