/* ── Cursor ──────────────────────────────────────────────── */
(function() {
  const cursor = document.querySelector('.cursor');
  const ring   = document.querySelector('.cursor-ring');
  if (!cursor || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animate() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
    ring.style.left   = rx + 'px';
    ring.style.top    = ry + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  document.querySelectorAll('a, button, [data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('grow'); ring.classList.add('grow'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('grow'); ring.classList.remove('grow'); });
  });
})();

/* ── Nav scroll + active ────────────────────────────────── */
(function() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mark active link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── Mobile nav toggle ──────────────────────────────────── */
(function() {
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.nav-drawer');
  if (!toggle || !drawer) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    drawer.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  });
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ── Scroll reveal ──────────────────────────────────────── */
(function() {
  const els = document.querySelectorAll('.reveal, .reveal-l');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* ── Lightbox ───────────────────────────────────────────── */
(function() {
  const lb    = document.querySelector('.lightbox');
  if (!lb) return;
  const img   = lb.querySelector('img');
  const close = lb.querySelector('.lb-close');
  const prev  = lb.querySelector('.lb-prev');
  const next  = lb.querySelector('.lb-next');
  const ctr   = lb.querySelector('.lb-counter');
  const items = Array.from(document.querySelectorAll('.gallery-item img'));
  let cur = 0;

  function open(i) {
    cur = i;
    img.src = items[i].src;
    img.alt = items[i].alt;
    if (ctr) ctr.textContent = (i + 1) + ' / ' + items.length;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }

  items.forEach((im, i) => im.parentElement.addEventListener('click', () => open(i)));
  close && close.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  prev && prev.addEventListener('click', e => { e.stopPropagation(); open((cur - 1 + items.length) % items.length); });
  next && next.addEventListener('click', e => { e.stopPropagation(); open((cur + 1) % items.length); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft' && prev) open((cur - 1 + items.length) % items.length);
    if (e.key === 'ArrowRight' && next) open((cur + 1) % items.length);
  });
})();

/* ── Portfolio filter ───────────────────────────────────── */
(function() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card[data-cat]');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(c => {
        const show = cat === 'all' || c.dataset.cat === cat;
        c.style.opacity = show ? '1' : '0';
        c.style.transform = show ? '' : 'scale(0.95)';
        c.style.pointerEvents = show ? '' : 'none';
        c.style.transition = 'opacity .4s, transform .4s';
        setTimeout(() => { c.style.display = show ? '' : 'none'; }, show ? 0 : 400);
        if (show) requestAnimationFrame(() => { c.style.opacity = '1'; c.style.transform = ''; });
      });
    });
  });
})();
