/* =============================================
   GITHUB.JS — GitHub REST API integration
   ============================================= */

(function () {
  'use strict';

  const USERNAME = 'KgothatsoModise';
  const API_BASE = 'https://api.github.com';

  async function fetchGitHub(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    return res.json();
  }

  function setEl(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  async function loadProfile() {
    try {
      const user = await fetchGitHub(`/users/${USERNAME}`);

      // Avatar
      const avatarEl = document.getElementById('githubAvatar');
      if (avatarEl) { avatarEl.src = user.avatar_url; avatarEl.alt = user.name || USERNAME; }

      setEl('githubName', user.name || USERNAME);
      setEl('githubBio',  user.bio  || 'Software Developer | Python | C# | Cybersecurity enthusiast');
      setEl('ghRepos',     user.public_repos ?? '—');
      setEl('ghFollowers', user.followers ?? '—');
      setEl('ghFollowing', user.following ?? '—');

    } catch (e) {
      console.warn('GitHub profile load failed:', e.message);
    }
  }

  async function loadRepos() {
    const container = document.getElementById('githubRepos');
    if (!container) return;

    try {
      const repos = await fetchGitHub(
        `/users/${USERNAME}/repos?sort=updated&per_page=6&type=public`
      );

      // Count total stars
      const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
      setEl('ghStars', totalStars);

      if (!repos.length) {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:24px">No public repositories found.</p>';
        return;
      }

      container.innerHTML = repos.map(repo => `
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer"
           class="gh-repo-card" aria-label="Repository: ${escapeHtml(repo.name)}">
          <p class="gh-repo-name"><i class="fas fa-book" aria-hidden="true"></i> ${escapeHtml(repo.name)}</p>
          <p class="gh-repo-desc">${escapeHtml(repo.description || 'No description provided.')}</p>
          <div class="gh-repo-meta">
            ${repo.language ? `<span><i class="fas fa-circle" style="font-size:0.55rem;color:var(--accent-blue)"></i> ${escapeHtml(repo.language)}</span>` : ''}
            <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
            <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
            <span><i class="fas fa-clock"></i> ${formatDate(repo.updated_at)}</span>
          </div>
        </a>
      `).join('');

    } catch (e) {
      console.warn('GitHub repos load failed:', e.message);
      container.innerHTML = `
        <div class="gh-loading">
          <i class="fas fa-exclamation-circle" style="color:var(--text-muted)"></i>
          <p style="margin-top:8px;color:var(--text-muted)">
            Could not load repositories. 
            <a href="https://github.com/${USERNAME}" target="_blank" rel="noopener noreferrer" style="color:var(--accent-blue)">View on GitHub</a>
          </p>
        </div>`;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short' });
  }

  function init() {
    loadProfile();
    loadRepos();
  }

  // Run when GitHub section scrolls into view (lazy load)
  const section = document.getElementById('github-section');
  if (section) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          init();
          obs.unobserve(section);
        }
      });
    }, { threshold: 0.1 });
    obs.observe(section);
  } else {
    init();
  }
}());
