const ICON_DATA = "data:image/png;base64,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";

const modules = [
  ['dashboard', '⌂', 'Dashboard'],
  ['employees', '♙', 'Funcionários'],
  ['attendance', '◷', 'Ponto'],
  ['leave', '休', '有休 / Férias'],
  ['reports', '▤', 'Relatórios'],
  ['payslips', '¥', 'Holerites'],
  ['dormitory', '⌂', 'Dormitórios'],
  ['settings', '⚙', 'Configurações']
];

const requests = [
  { initials: 'CS', name: 'Carlos Silva', workplace: '岡崎', period: '05–06 ago.', status: 'pending', label: 'Em análise' },
  { initials: 'AS', name: 'Ana Souza', workplace: '花園', period: '08 ago.', status: 'approved', label: 'Aprovada' },
  { initials: 'PS', name: 'Pedro Santos', workplace: '関東', period: '12–14 ago.', status: 'review', label: 'Revisão' },
  { initials: 'MT', name: 'Mariana Tanaka', workplace: '豊橋', period: '18 ago.', status: 'pending', label: 'Em análise' }
];

let activeModule = 'dashboard';

function sidebar() {
  return `
    <aside class="sidebar">
      <div class="brand-block">
        <img src="${ICON_DATA}" class="brand-icon" alt="Jabras Neo" />
        <div class="brand-copy"><strong>JABRAS NEO</strong><span>Portal Administrativo</span></div>
      </div>
      <div class="nav-label">MENU PRINCIPAL</div>
      <nav>${modules.map(([id, icon, label]) => `
        <button class="nav-item ${activeModule === id ? 'active' : ''}" data-module="${id}">
          <span class="nav-icon">${icon}</span><span>${label}</span>
        </button>`).join('')}</nav>
      <div class="sidebar-footer">株式会社ジャブラスネオ<br><span>JABRAS NEO</span></div>
    </aside>`;
}

function header(title, subtitle) {
  return `
    <header class="topbar">
      <div class="topbar-title"><h1>${title}</h1><p>${subtitle}</p></div>
      <div class="topbar-actions">
        <div class="search-box"><span>⌕</span><input placeholder="Pesquisar no portal..." /></div>
        <button class="icon-btn" aria-label="Notificações">♢<span class="notification-dot"></span></button>
        <div class="user-block"><div class="avatar">VF</div><div><strong>Vinicius</strong><span>Administrador</span></div></div>
      </div>
    </header>`;
}

function dashboard() {
  return `
    ${header('Dashboard', 'Visão geral da operação')}
    <main class="content">
      <section class="page-heading">
        <div><span class="eyebrow">PORTAL ADMINISTRATIVO</span><h2>Boa tarde</h2><p>Acompanhe as principais informações da Jabras Neo.</p></div>
        <button class="primary-btn" data-module="leave">＋ Nova solicitação de 有休</button>
      </section>
      <section class="stats">
        ${stat('♙', 'Funcionários ativos', '186', '+4 neste mês')}
        ${stat('休', '有休 pendentes', '12', '3 revisões aguardando')}
        ${stat('✓', 'Aprovadas hoje', '8', '32 dias autorizados')}
        ${stat('◷', 'Ausentes hoje', '6', 'Em 4 locais de trabalho')}
      </section>
      <section class="dashboard-grid">
        <div class="card panel">
          <div class="panel-head"><div><span class="section-kicker">SOLICITAÇÕES</span><h3>Solicitações recentes</h3></div><button class="link-btn" data-module="leave">Ver todas →</button></div>
          <div class="table-wrap"><table class="table">
            <thead><tr><th>Funcionário</th><th>Local</th><th>Período</th><th>Status</th></tr></thead>
            <tbody>${requests.map(r => `<tr><td><div class="employee"><div class="mini-avatar">${r.initials}</div><strong>${r.name}</strong></div></td><td><span class="workplace">${r.workplace}</span></td><td>${r.period}</td><td><span class="badge ${r.status}">${r.label}</span></td></tr>`).join('')}</tbody>
          </table></div>
        </div>
        <div class="card panel">
          <div class="panel-head"><div><span class="section-kicker">CALENDÁRIO</span><h3>Próximas ausências</h3></div><button class="link-btn" data-module="leave">Abrir →</button></div>
          <div class="timeline">
            ${event('05', 'AGO', 'Carlos Silva', '岡崎 • 2 dias de 有休')}
            ${event('08', 'AGO', 'Ana Souza', '花園 • 1 dia de 有休')}
            ${event('12', 'AGO', 'Pedro Santos', '関東 • 3 dias de 有休')}
            ${event('18', 'AGO', 'Mariana Tanaka', '豊橋 • Meio período')}
          </div>
        </div>
      </section>
    </main>`;
}

function stat(icon, label, value, note) {
  return `<article class="card stat"><div class="stat-top"><span class="stat-icon">${icon}</span><span class="stat-label">${label}</span></div><b>${value}</b><small>${note}</small></article>`;
}
function event(day, month, name, detail) {
  return `<div class="event"><div class="event-date"><strong>${day}</strong>${month}</div><div><h4>${name}</h4><p>${detail}</p></div></div>`;
}

function placeholder(id) {
  const item = modules.find(m => m[0] === id);
  const label = item?.[2] || 'Módulo';
  return `${header(label, 'Módulo em preparação')}<main class="content"><section class="card module-placeholder"><div class="placeholder-icon">${item?.[1] || '◻'}</div><h2>${label}</h2><p>A estrutura visual está pronta. Este módulo será desenvolvido nas próximas etapas.</p><button class="primary-btn" data-module="dashboard">Voltar ao dashboard</button></section></main>`;
}

function render() {
  document.querySelector('#app').innerHTML = `<div class="app-shell">${sidebar()}<div class="main">${activeModule === 'dashboard' ? dashboard() : placeholder(activeModule)}</div></div>`;
  document.querySelectorAll('[data-module]').forEach(button => button.addEventListener('click', () => { activeModule = button.dataset.module; render(); }));
}
render();
