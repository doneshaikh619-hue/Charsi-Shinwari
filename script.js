(() => {
  const header = document.getElementById('siteHeader');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primaryNav');
  const backTop = document.querySelector('.backtop');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
    backTop.classList.toggle('show', window.scrollY > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const open = header.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('menu-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.setAttribute('aria-label', 'Open menu');
    });
  });

  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  const slides = [...document.querySelectorAll('.review-card')];
  const dots = [...document.querySelectorAll('.dot')];
  let slideIndex = 0;
  let sliderTimer;

  const setSlide = index => {
    if (!slides.length) return;
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === slideIndex));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === slideIndex));
  };
  const resetTimer = () => {
    window.clearInterval(sliderTimer);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    sliderTimer = window.setInterval(() => setSlide(slideIndex + 1), 6500);
  };

  document.querySelector('[data-prev]')?.addEventListener('click', () => { setSlide(slideIndex - 1); resetTimer(); });
  document.querySelector('[data-next]')?.addEventListener('click', () => { setSlide(slideIndex + 1); resetTimer(); });
  dots.forEach(dot => dot.addEventListener('click', () => { setSlide(Number(dot.dataset.index)); resetTimer(); }));
  setSlide(0);
  resetTimer();

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    document.body.style.overflow = '';
  };
  document.querySelectorAll('[data-gallery]').forEach(tile => {
    tile.addEventListener('click', () => {
      lightboxImage.src = tile.dataset.gallery;
      lightboxImage.alt = tile.querySelector('img')?.alt || 'Restaurant gallery image';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });
  document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(); });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
