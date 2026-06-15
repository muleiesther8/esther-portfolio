'use strict';

/* =============================================
   SKILLS DATA + DOM RENDERING
   ============================================= */

const SKILLS = {
  frontend: [
    { name: 'HTML5',       level: 90, emoji: '🧱' },
    { name: 'CSS3',        level: 85, emoji: '🎨' },
    { name: 'JavaScript',  level: 80, emoji: '⚡' },
  ],
  backend: [
    { name: 'PHP',         level: 78, emoji: '🐘' },
    { name: 'Python',      level: 70, emoji: '🐍' },
    { name: 'MySQL',       level: 75, emoji: '🗄️' },
    { name: 'MongoDB',     level: 65, emoji: '🍃' },
    { name: 'Node.js',     level: 72, emoji: '🟢' },
  ],
  frameworks: [
    { name: 'MERN Stack',  level: 70, emoji: '⚛️' },
    { name: 'React',       level: 68, emoji: '💠' },
    { name: 'Express.js',  level: 70, emoji: '🚂' },
  ],
  tools: [
    { name: 'Git & GitHub',        level: 80, emoji: '🐙' },
    { name: 'XAMPP',               level: 82, emoji: '🖥️' },
    { name: 'Digital Products',    level: 75, emoji: '📦' },
    { name: 'Responsive Design',   level: 85, emoji: '📱' },
  ]
};

const SkillsRenderer = {
  init() {
    this.renderGroup('frontendGrid',   SKILLS.frontend);
    this.renderGroup('backendGrid',    SKILLS.backend);
    this.renderGroup('frameworkGrid',  SKILLS.frameworks);
    this.renderGroup('toolsGrid',      SKILLS.tools);
    this.animateBarsOnScroll();
  },

  renderGroup(containerId, skills) {
    const container = document.getElementById(containerId);
    if (!container) return;

    skills.forEach(skill => {
      const card = document.createElement('div');
      card.className = 'skill-card card reveal';

      // Top row: emoji + name + level %
      const top = document.createElement('div');
      top.className = 'skill-top';

      const left = document.createElement('div');
      left.className = 'skill-left';

      const emojiEl = document.createElement('span');
      emojiEl.className = 'skill-emoji';
      emojiEl.setAttribute('aria-hidden', 'true');
      emojiEl.textContent = skill.emoji;

      const nameEl = document.createElement('span');
      nameEl.className = 'skill-name';
      nameEl.textContent = skill.name;

      const levelEl = document.createElement('span');
      levelEl.className = 'skill-level mono';
      levelEl.textContent = `${skill.level}%`;

      left.appendChild(emojiEl);
      left.appendChild(nameEl);
      top.appendChild(left);
      top.appendChild(levelEl);

      // Progress bar
      const barWrap = document.createElement('div');
      barWrap.className = 'skill-bar-wrap';
      barWrap.setAttribute('role', 'progressbar');
      barWrap.setAttribute('aria-valuenow', skill.level);
      barWrap.setAttribute('aria-valuemin', 0);
      barWrap.setAttribute('aria-valuemax', 100);
      barWrap.setAttribute('aria-label', `${skill.name} proficiency: ${skill.level}%`);

      const bar = document.createElement('div');
      bar.className = 'skill-bar';
      bar.dataset.level = skill.level;
      // Start at 0, animate on scroll
      bar.style.width = '0%';

      barWrap.appendChild(bar);
      card.appendChild(top);
      card.appendChild(barWrap);
      container.appendChild(card);
    });
  },

  animateBarsOnScroll() {
    const bars = document.querySelectorAll('.skill-bar');
    if (!bars.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const level = bar.dataset.level;
          // Small delay for visual polish
          setTimeout(() => {
            bar.style.width = `${level}%`;
          }, 200);
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));
  }
};

document.addEventListener('DOMContentLoaded', () => SkillsRenderer.init());