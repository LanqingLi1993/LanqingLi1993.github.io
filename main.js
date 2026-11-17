(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('#theme-toggle');
  const menuToggle = document.querySelector('#menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');

  const savedTheme = window.localStorage.getItem('lanqing-theme');
  if (savedTheme === 'dark') root.dataset.theme = 'dark';

  themeToggle?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (nextTheme === 'dark') root.dataset.theme = 'dark';
    else delete root.dataset.theme;
    window.localStorage.setItem('lanqing-theme', nextTheme);
    themeToggle.setAttribute('aria-label', nextTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });

  menuToggle?.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    mobileNav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  const progress = document.querySelector('.scroll-progress');
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
    revealItems.forEach((item) => observer.observe(item));
  } else revealItems.forEach((item) => item.classList.add('is-visible'));

  document.querySelector('#year').textContent = new Date().getFullYear();

  document.querySelectorAll('.filter-button').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach((item) => item.classList.toggle('active', item === button));
    const filter = button.dataset.filter;
    document.querySelectorAll('.publication-item').forEach((item) => {
      item.classList.toggle('is-hidden', filter !== 'all' && item.dataset.category !== filter);
    });
  }));

  const visual = document.querySelector('.hero-visual');
  if (visual && window.matchMedia('(pointer: fine)').matches) {
    visual.addEventListener('pointermove', (event) => {
      const rect = visual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      visual.style.transform = `perspective(900px) rotateY(${x * 2.4}deg) rotateX(${y * -2.4}deg)`;
    });
    visual.addEventListener('pointerleave', () => { visual.style.transform = ''; });
  }
})();
