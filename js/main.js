/* =============================================
   ESTHER MULEI PORTFOLIO — MAIN JS
   DOM · Events · Security · UX
   ============================================= */

'use strict';

// === SECURITY UTILITIES ===
const Security = {
  sanitize(str) {
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  },

  isValidEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(String(email).trim().toLowerCase());
  },

  rateLimiter: {
    attempts: {},
    maxAttempts: 3,
    windowMs: 60000,

    canSubmit(formId) {
      const now = Date.now();
      if (!this.attempts[formId]) this.attempts[formId] = [];
      this.attempts[formId] = this.attempts[formId].filter(t => now - t < this.windowMs);
      return this.attempts[formId].length < this.maxAttempts;
    },

    record(formId) {
      if (!this.attempts[formId]) this.attempts[formId] = [];
      this.attempts[formId].push(Date.now());
    }
  }
};

// === THEME MANAGER ===
const ThemeManager = {
  STORAGE_KEY: 'em-portfolio-theme',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    this.apply(theme);
    this.bindToggle();
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    const icon = document.querySelector('.theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  },

  bindToggle() {
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => this.toggle());
      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggle(); }
      });
    }
  }
};

// === NAVIGATION ===
const Nav = {
  init() {
    this.highlightActive();
    this.bindHamburger();
    this.bindScrollShadow();
    this.closeMenuOnOutsideClick();
  },

  highlightActive() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === current || (current === '' && href === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  },

  bindHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
  },

  bindScrollShadow() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 20
        ? '0 4px 24px rgba(0,0,0,0.3)'
        : 'none';
    }, { passive: true });
  },

  closeMenuOnOutsideClick() {
    document.addEventListener('click', e => {
      const menu = document.querySelector('.mobile-menu.open');
      const hamburger = document.querySelector('.hamburger');
      if (menu && !menu.contains(e.target) && !hamburger.contains(e.target)) {
        menu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });
  }
};

// === SCROLL REVEAL ===
const ScrollReveal = {
  init() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(el => observer.observe(el));
  }
};

// === BACK TO TOP ===
const BackToTop = {
  init() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// === CONTACT FORM ===
const ContactForm = {
  init() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    this.bindValidation(form);
    this.bindSubmit(form);
    this.bindCharCount();
  },

  bindValidation(form) {
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => this.clearError(field));
    });
  },

  validateField(field) {
    const value = field.value.trim();
    const name = field.name;
    let error = '';

    if (!value) {
      error = `${field.dataset.label || 'This field'} is required.`;
    } else if (name === 'email' && !Security.isValidEmail(value)) {
      error = 'Please enter a valid email address.';
    } else if (name === 'name' && value.length < 2) {
      error = 'Name must be at least 2 characters.';
    } else if (name === 'message' && value.length < 10) {
      error = 'Message must be at least 10 characters.';
    }

    this.setError(field, error);
    return !error;
  },

  setError(field, message) {
    const wrap = field.closest('.field-wrap');
    if (!wrap) return;
    let err = wrap.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      err.setAttribute('role', 'alert');
      wrap.appendChild(err);
    }
    err.textContent = message;
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    wrap.classList.toggle('has-error', !!message);
  },

  clearError(field) {
    const wrap = field.closest('.field-wrap');
    if (!wrap) return;
    const err = wrap.querySelector('.field-error');
    if (err) err.textContent = '';
    field.removeAttribute('aria-invalid');
    wrap.classList.remove('has-error');
  },

  bindCharCount() {
    const textarea = document.querySelector('textarea[name="message"]');
    const counter = document.querySelector('.char-count');
    if (!textarea || !counter) return;
    const max = parseInt(textarea.getAttribute('maxlength')) || 500;
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      counter.textContent = `${len} / ${max}`;
      counter.style.color = len > max * 0.9 ? 'var(--warning)' : 'var(--text-muted)';
    });
  },

  bindSubmit(form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      if (!Security.rateLimiter.canSubmit('contact')) {
        this.showToast('Too many attempts. Please wait a minute before trying again.', 'error');
        return;
      }

      const honeypot = form.querySelector('input[name="website"]');
      if (honeypot && honeypot.value) return;

      let valid = true;
      form.querySelectorAll('input:not([type="hidden"]), textarea').forEach(field => {
        if (field.name !== 'website' && !this.validateField(field)) valid = false;
      });

      if (!valid) {
        this.showToast('Please fix the errors above.', 'error');
        return;
      }

      Security.rateLimiter.record('contact');
      this.sendToFormspree(form);
    });
  },

  // ✅ REPLACE xxxxxxxx WITH YOUR FORMSPREE ID
  async sendToFormspree(form) {
    const btn = form.querySelector('.btn-submit');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    const data = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xojzrbrg', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        this.showToast('Message sent! Esther will get back to you soon. 💜', 'success');
      } else {
        this.showToast('Something went wrong. Please try emailing directly.', 'error');
      }
    } catch (err) {
      this.showToast('Network error. Please try again.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Message 💜';
    }
  },

  showToast(message, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = Security.sanitize(message);
    toast.className = `toast toast-${type} show`;
    setTimeout(() => toast.classList.remove('show'), 4000);
  }
};

// === TYPED EFFECT (hero page) ===
const TypedEffect = {
  init(selector, words, speed = 90, pause = 2000) {
    const el = document.querySelector(selector);
    if (!el) return;
    let wordIdx = 0, charIdx = 0, deleting = false;

    const tick = () => {
      const word = words[wordIdx];
      if (deleting) {
        el.textContent = word.substring(0, --charIdx);
      } else {
        el.textContent = word.substring(0, ++charIdx);
      }

      let delay = deleting ? speed / 2 : speed;

      if (!deleting && charIdx === word.length) {
        delay = pause;
        deleting = true;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        delay = 400;
      }

      setTimeout(tick, delay);
    };
    tick();
  }
};

// === INIT ON DOM READY ===
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Nav.init();
  ScrollReveal.init();
  BackToTop.init();
  ContactForm.init();

  TypedEffect.init('.typed-word', [
    'Full-Stack Developer',
    'Problem Solver',
    'Digital Creator',
    'MERN Developer',
    'Coder & Creative Designer',
  ]);
});