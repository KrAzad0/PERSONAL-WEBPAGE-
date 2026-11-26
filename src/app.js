(() => {
  'use strict';
  document.documentElement.classList.add('js-ready');
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#site-nav');
  const closeMenu = (restoreFocus = false) => {
    if (!menu || !navigation) return;
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    if (restoreFocus) menu.focus();
  };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  navigation?.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(min-width: 651px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });

  const toolbar = document.querySelector('.project-toolbar');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.project-card')];
  const count = document.querySelector('#project-count');
  if (toolbar && cards.length) {
    toolbar.hidden = false;
    filters.forEach(button => {
      button.addEventListener('click', () => {
        const selected = button.dataset.filter;
        filters.forEach(filter => {
          const active = filter === button;
          filter.classList.toggle('is-active', active);
          filter.setAttribute('aria-pressed', String(active));
        });
        let visible = 0;
        cards.forEach(card => {
          card.hidden = selected !== 'all' && card.dataset.category !== selected;
          if (!card.hidden) visible += 1;
        });
        if (count) count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
      });
    });
  }

  const copyButton = document.querySelector('.copy-email');
  const copyStatus = document.querySelector('.copy-status');
  if (copyButton && navigator.clipboard?.writeText && window.isSecureContext) {
    copyButton.hidden = false;
    let copyReset;
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copyButton.dataset.email);
        copyButton.querySelector('span').textContent = 'Email copied';
        copyStatus.textContent = 'Email address copied to your clipboard.';
        window.clearTimeout(copyReset);
        copyReset = window.setTimeout(() => { copyButton.querySelector('span').textContent = 'Copy email'; }, 3000);
      } catch {
        copyStatus.classList.remove('sr-only');
        copyStatus.textContent = 'Please select the email address above to copy it.';
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const sections = [...document.querySelectorAll('main section[id]')];
    const links = [...document.querySelectorAll('.site-nav a')];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach(link => {
          const current = link.hash === `#${entry.target.id}`;
          link.classList.toggle('is-current', current);
          if (current) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }
})();
