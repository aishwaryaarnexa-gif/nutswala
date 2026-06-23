/* ======================================================
   NUTSWALA – JavaScript (Creative Redesign)
   Dev Enterprises | Vashi, Navi Mumbai
   ====================================================== */

// ─────────────────────────────────
// INIT
// ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNavbar();
  initHeroCanvas();
  initScrollEffects();
  initRevealAnimations();
  initCounters();
  initTicker();
  initSmoothScroll();
});

// ─────────────────────────────────
// LOADER
// ─────────────────────────────────
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hide');
    setTimeout(() => loader.remove(), 600);
  }, 2000);
}

// ─────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animFollower);
  }
  animFollower();

  // Hover effect on interactive elements
  const hoverables = document.querySelectorAll('a, button, .cat-card, .prod-card, .pf-btn');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('expand');
      follower.classList.add('expand');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('expand');
      follower.classList.remove('expand');
    });
  });
}

// ─────────────────────────────────
// NAVBAR
// ─────────────────────────────────
function initNavbar() {
  const header    = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  const announceBar = document.getElementById('announceBar');

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const announceH = announceBar ? announceBar.offsetHeight : 0;

    // Dark mode when scrolled past hero
    if (scrollY > window.innerHeight * 0.5) {
      header.classList.add('dark-mode');
    } else {
      header.classList.remove('dark-mode');
    }

    // Hide announce bar on scroll
    if (scrollY > 50 && announceBar) {
      announceBar.style.marginTop = `-${announceH}px`;
      announceBar.style.opacity = '0';
    } else if (announceBar) {
      announceBar.style.marginTop = '0';
      announceBar.style.opacity = '1';
    }

    // Scroll-to-top button
    const stb = document.getElementById('stb');
    if (stb) {
      scrollY > 500 ? stb.classList.add('show') : stb.classList.remove('show');
    }

    // Active nav link
    highlightNav(scrollY);
    lastScroll = scrollY;
  });

  // Mobile hamburger
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  navMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

function highlightNav(scrollY) {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');
  let current = '';
  sections.forEach(s => {
    if (scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navItems.forEach(n => {
    n.classList.remove('active');
    if (n.getAttribute('href') === `#${current}`) n.classList.add('active');
  });
}

// ─────────────────────────────────
// HERO CANVAS — Floating Particles
// ─────────────────────────────────
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = document.querySelector('.hero')?.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.8 + 0.4;
      this.sx = (Math.random() - 0.5) * 0.3;
      this.sy = -(Math.random() * 0.6 + 0.2);
      this.o  = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.sx;
      this.y += this.sy;
      if (this.y < -4) this.reset(), this.y = H + 4;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,145,58,${this.o})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}

// ─────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────
function initRevealAnimations() {
  const targets = document.querySelectorAll(
    '.prod-card, .cat-card, .wc-card, .tc, .story-stat, .sf-item, .ci'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 3) * 80}ms`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  targets.forEach(el => observer.observe(el));
}

// ─────────────────────────────────
// COUNTER ANIMATION
// ─────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.sstat-num[data-target]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      const dur    = 1800;
      let start    = null;
      function step(ts) {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - prog, 3); // ease out cubic
        el.textContent = Math.floor(ease * target);
        if (prog < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ─────────────────────────────────
// TICKER PAUSE ON HOVER
// ─────────────────────────────────
function initTicker() {
  const wrap  = document.querySelector('.ticker-wrap');
  const track = document.querySelector('.ticker-track');
  if (!wrap || !track) return;
  wrap.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  wrap.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}

// ─────────────────────────────────
// SMOOTH SCROLL
// ─────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ─────────────────────────────────
// SCROLL EFFECTS (general)
// ─────────────────────────────────
function initScrollEffects() {
  // announce bar transition
  const ab = document.getElementById('announceBar');
  if (ab) {
    ab.style.transition = 'margin-top 0.4s ease, opacity 0.4s ease';
  }
}

// ─────────────────────────────────
// PRODUCT FILTER
// ─────────────────────────────────
function filterProds(cat) {
  // Update filter buttons
  document.querySelectorAll('.pf-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === cat);
  });
  // Update category card active state
  document.querySelectorAll('.cat-card').forEach(c => {
    c.style.opacity = (cat === 'all' || c.dataset.cat === cat) ? '1' : '0.4';
  });
  // Show/hide product cards
  const cards = document.querySelectorAll('.prod-card');
  cards.forEach((card, i) => {
    const show = cat === 'all' || card.dataset.category === cat;
    if (show) {
      card.classList.remove('hidden');
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      requestAnimationFrame(() => {
        setTimeout(() => {
          card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 60);
      });
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => card.classList.add('hidden'), 350);
    }
  });
}

// ─────────────────────────────────
// MODAL
// ─────────────────────────────────
function openModal(product) {
  const bg   = document.getElementById('modalBg');
  const prod = document.getElementById('modalProd');
  if (!bg || !prod) return;
  prod.textContent = product;
  bg.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const bg = document.getElementById('modalBg');
  if (!bg) return;
  bg.classList.remove('open');
  document.body.style.overflow = '';
}

function handleModal(e) {
  e.preventDefault();
  const form    = e.target;
  const name    = form.querySelector('input[type="text"]').value;
  const phone   = form.querySelector('input[type="tel"]').value;
  const qty     = form.querySelector('input[type="number"]').value;
  const product = document.getElementById('modalProd').textContent;
  const msg = encodeURIComponent(
    `Hello Nutswala! 🥜\n\nI'd like to enquire about: *${product}*\n\nName: ${name}\nPhone: ${phone}${qty ? '\nQuantity: ' + qty + ' kg' : ''}\n\nPlease share your best wholesale price.`
  );
  window.open(`https://wa.me/919820000000?text=${msg}`, '_blank');
  closeModal();
}

// Close modal on Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ─────────────────────────────────
// CONTACT FORM
// ─────────────────────────────────
function handleForm(e) {
  e.preventDefault();
  const btn     = document.getElementById('cfSubmit');
  const success = document.getElementById('cfSuccess');

  btn.querySelector('span').textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    e.target.reset();
    btn.querySelector('span').textContent = 'Message Sent!';
    success.style.display = 'flex';
    setTimeout(() => {
      btn.querySelector('span').textContent = 'Send Message';
      btn.disabled = false;
      success.style.display = 'none';
    }, 5000);
  }, 1600);
}

// ─────────────────────────────────
// HERO PARALLAX
// ─────────────────────────────────
window.addEventListener('scroll', () => {
  const heroLeft = document.querySelector('.hero-left');
  if (heroLeft && window.scrollY < window.innerHeight) {
    const s = window.scrollY;
    heroLeft.style.transform = `translateY(${s * 0.20}px)`;
    heroLeft.style.opacity   = `${1 - s / (window.innerHeight * 0.75)}`;
  }
});
