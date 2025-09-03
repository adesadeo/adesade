const grid = document.getElementById('grid');
const search = document.getElementById('search');
const chipContainer = document.getElementById('chipContainer');
const year = document.getElementById('year');
year && (year.textContent = new Date().getFullYear());

let allProjects = [];
let activeTag = 'all';

fetch('projects.json')
  .then(r => r.json())
  .then(data => {
    allProjects = data;
    render();
  });

function render() {
  const q = (search?.value || '').toLowerCase();
  const filtered = allProjects.filter(p => {
    const matchesTag = activeTag === 'all' || (p.tags || []).includes(activeTag);
    const matchesQ = !q || p.title.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q));
    return matchesTag && matchesQ;
  });

  grid.innerHTML = filtered.map(p => `
    <article class="card" role="listitem">
      <a href="${p.page}" aria-label="${p.title}">
        <figure class="thumb">
          <img src="${p.cover}" alt="${p.title} cover image">
        </figure>
        <div class="card-body">
          <h3 class="card-title">${p.title}</h3>
          <p class="card-desc">${p.description || ''}</p>
          <div class="tags">${(p.tags||[]).map(t => `<span class="tag">${t}</span>`).join('')}</div>
        </div>
      </a>
    </article>
  `).join('');
}

search?.addEventListener('input', render);

chipContainer?.addEventListener('click', e => {
  const btn = e.target.closest('button[data-tag]');
  if(!btn) return;
  chipContainer.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  activeTag = btn.dataset.tag;
  render();
});