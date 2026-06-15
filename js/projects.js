'use strict';

/* =============================================
   PROJECTS DATA + DOM RENDERING
   All project data lives here — add new
   projects to the array, the DOM updates itself.
   ============================================= */

const PROJECTS = [
  {
    id: 1,
    name: 'Essiz Beauty Hub',
    tagline: 'E-commerce for campus life',
    description:
      'A full e-commerce platform built for campus students in Nairobi — making skincare, haircare, and perfume products accessible with delivery right to your doorstep. Designed with the student budget and convenience in mind.',
    tech: ['PHP', 'MySQL', 'XAMPP', 'HTML', 'CSS'],
    filters: ['php', 'css'],
    emoji: '💄',
    color: '#9B59F5',
    github: 'https://github.com/muleiesther8/EssizBeautyHub.git',
    live: null,
    highlights: ['Delivery system', 'Product catalogue', 'Student-focused UX'],
    year: '2024'
  },
  {
    id: 2,
    name: 'Essiz Omega Drift',
    tagline: 'Where code meets creativity',
    description:
      'A creative platform where users interact with syntax and code in a playful, poetic way. Features a growing library of poems, plus a personal space where users can write, save, and revisit their own poetry in their profile.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    filters: ['javascript', 'css'],
    emoji: '✍️',
    color: '#FF6DF4',
    github: 'https://github.com/muleiesther8/EssizOmega-Drift.git',
    live: null,
    highlights: ['Poem library', 'User profiles', 'Write & save poems'],
    year: '2025'
  }
];

/* === DOM RENDERER === */
const ProjectsRenderer = {
  grid: null,
  currentFilter: 'all',

  init() {
    this.grid = document.getElementById('projectsGrid');
    if (!this.grid) return;
    this.render(PROJECTS);
    this.bindFilters();
  },

  /**
   * Safely render project cards into the grid using DOM methods
   * (no innerHTML with user data — XSS safe by construction)
   */
  render(projects) {
    this.grid.innerHTML = '';

    if (!projects.length) {
      const empty = document.createElement('p');
      empty.className = 'no-results';
      empty.textContent = 'No projects match this filter yet.';
      this.grid.appendChild(empty);
      return;
    }

    projects.forEach((project, i) => {
      const card = this.buildCard(project, i);
      this.grid.appendChild(card);

      // Trigger scroll reveal
      setTimeout(() => {
        if (window.IntersectionObserver) {
          const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
              if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
              }
            });
          }, { threshold: 0.1 });
          observer.observe(card);
        } else {
          card.classList.add('visible');
        }
      }, i * 100);
    });
  },

  buildCard(project, index) {
    const card = document.createElement('article');
    card.className = 'project-card card reveal';
    card.setAttribute('aria-label', `Project: ${project.name}`);

    // Header
    const header = document.createElement('div');
    header.className = 'project-header';

    const emoji = document.createElement('span');
    emoji.className = 'project-emoji';
    emoji.textContent = project.emoji;
    emoji.style.setProperty('--project-color', project.color);

    const meta = document.createElement('div');
    meta.className = 'project-meta';

    const year = document.createElement('span');
    year.className = 'project-year mono';
    year.textContent = project.year;

    meta.appendChild(year);
    header.appendChild(emoji);
    header.appendChild(meta);

    // Body
    const body = document.createElement('div');
    body.className = 'project-body';

    const tagline = document.createElement('p');
    tagline.className = 'project-tagline mono';
    tagline.textContent = project.tagline;

    const name = document.createElement('h3');
    name.className = 'project-name';
    name.textContent = project.name;

    const desc = document.createElement('p');
    desc.className = 'project-desc';
    desc.textContent = project.description;

    // Highlights
    const hlList = document.createElement('ul');
    hlList.className = 'project-highlights';
    project.highlights.forEach(hl => {
      const li = document.createElement('li');
      li.textContent = hl;
      hlList.appendChild(li);
    });

    body.appendChild(tagline);
    body.appendChild(name);
    body.appendChild(desc);
    body.appendChild(hlList);

    // Tech tags
    const tags = document.createElement('div');
    tags.className = 'project-tags';
    project.tech.forEach(t => {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = t;
      tags.appendChild(tag);
    });

    // Links
    const links = document.createElement('div');
    links.className = 'project-links';

    if (project.github) {
      const ghLink = document.createElement('a');
      ghLink.href = project.github;
      ghLink.target = '_blank';
      ghLink.rel = 'noopener noreferrer';
      ghLink.className = 'btn btn-outline';
      ghLink.setAttribute('aria-label', `View ${project.name} on GitHub`);
      ghLink.textContent = '🐙 GitHub';
      links.appendChild(ghLink);
    }

    if (project.live) {
      const liveLink = document.createElement('a');
      liveLink.href = project.live;
      liveLink.target = '_blank';
      liveLink.rel = 'noopener noreferrer';
      liveLink.className = 'btn btn-primary';
      liveLink.setAttribute('aria-label', `View ${project.name} live`);
      liveLink.textContent = '🚀 Live Demo';
      links.appendChild(liveLink);
    }

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(tags);
    card.appendChild(links);

    return card;
  },

  bindFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        this.currentFilter = filter;
        const filtered = filter === 'all'
          ? PROJECTS
          : PROJECTS.filter(p => p.filters.includes(filter));
        this.render(filtered);
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => ProjectsRenderer.init());