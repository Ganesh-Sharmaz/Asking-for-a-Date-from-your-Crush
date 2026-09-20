fetch('/api/visitor', { credentials: 'same-origin' }).catch(() => {});

if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
  let promo;
  let promoTimer;

  const showPromo = () => {
    if (promo && document.body.contains(promo)) return;
    promo = document.createElement('aside');
    promo.className = 'base-promo';
    promo.innerHTML = '<p><strong>Have a question for someone?</strong><br>Make a cute page of your own.</p><a class="button" href="/landing">See how</a><button type="button" aria-label="Close">\u00d7</button>';
    const dismissPromo = () => {
      promo.remove();
      clearTimeout(promoTimer);
      promoTimer = setTimeout(showPromo, 10000);
    };
    promo.querySelector('button').addEventListener('click', dismissPromo);
    document.body.append(promo);
    promoTimer = setTimeout(() => {
      if (document.body.contains(promo)) {
        promo.remove();
        promoTimer = setTimeout(showPromo, 10000);
      }
    }, 10000);
  };

  showPromo();

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
