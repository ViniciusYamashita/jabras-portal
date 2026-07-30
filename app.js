const modules = [
  ['dashboard', '⌂', 'Dashboard'],
  ['employees', '👥', 'Funcionários'],
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
      <div class="brand">
        <div class="brand-mark">JN</div>
        <div><strong>JABRAS NEO</strong><span>Portal Administrativo</span></div>
      </div>
      <div class="nav-title">MENU PRINCIPAL</div>
      <nav>${modules.map(([id, icon, label]) => `
        <button class="nav-item ${activeModule === id ? 'active' : ''}" data-module="${id}">
          <span class="nav-icon">${icon}</span><span>${label}</span>
        </button>`).join('')}</nav>
      <div class="sidebar-footer">Versão inicial do novo portal<br><strong>Ambiente de desenvolvimento</strong></div>
    </aside>`;
}

function header(title, subtitle) {
  return `
    <header class="header">
      <div><h1>${title}</h1><p>${subtitle}</p></div>
      <div class="header-actions">
        <input class="search" placeholder="Pesquisar no portal..." />
        <div class="avatar">VF</div>
      </div>
    </header>`;
}

function dashboard() {
  return `
    ${header('Dashboard', 'Visão geral da operação')}
    <main class="content">
      <section class="hero">
        <div><h2>Boa tarde 👋</h2><p>Acompanhe as principais informações da Jabras Neo.</p></div>
        <button class="primary-btn" data-module="leave">＋ Nova solicitação de 有休</button>
      </section>
      <section class="stats">
        ${stat('👥', 'Funcionários ativos', '186', '+4 neste mês')}
        ${stat('休', '有休 pendentes', '12', '3 revisões aguardando')}
        ${stat('✓', 'Aprovadas hoje', '8', '32 dias autorizados')}
        ${stat('◷', 'Ausentes hoje', '6', 'Em 4 locais de trabalho')}
      </section>
      <section class="grid">
        <div class="card panel">
          <div class="panel-head"><h3>Solicitações recentes</h3><button class="link-btn" data-module="leave">Ver todas</button></div>
          <div class="table-wrap"><table class="table">
            <thead><tr><th>Funcionário</th><th>Local</th><th>Período</th><th>Status</th></tr></thead>
            <tbody>${requests.map(r => `<tr><td><div class="employee"><div class="mini-avatar">${r.initials}</div><strong>${r.name}</strong></div></td><td>${r.workplace}</td><td>${r.period}</td><td><span class="badge ${r.status}">${r.label}</span></td></tr>`).join('')}</tbody>
          </table></div>
        </div>
        <div class="card panel">
          <div class="panel-head"><h3>Próximas ausências</h3><button class="link-btn" data-module="leave">Calendário</button></div>
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
  return `<article class="card stat"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon}</span></div><strong>${value}</strong><small>${note}</small></article>`;
}
function event(day, month, name, detail) {
  return `<div class="event"><div class="event-date"><strong>${day}</strong>${month}</div><div><h4>${name}</h4><p>${detail}</p></div></div>`;
}

function placeholder(id) {
  const item = modules.find(m => m[0] === id);
  const label = item?.[2] || 'Módulo';
  return `${header(label, 'Módulo em preparação')}<main class="content"><section class="card module-placeholder"><div style="font-size:44px">${item?.[1] || '◻'}</div><h2>${label}</h2><p>A estrutura visual está pronta. Este módulo será desenvolvido nas próximas etapas.</p><button class="primary-btn" data-module="dashboard">Voltar ao dashboard</button></section></main>`;
}

function render() {
  document.querySelector('#app').innerHTML = `<div class="app-shell">${sidebar()}<div class="main">${activeModule === 'dashboard' ? dashboard() : placeholder(activeModule)}</div></div>`;
  document.querySelectorAll('[data-module]').forEach(button => button.addEventListener('click', () => {
    activeModule = button.dataset.module;
    render();
  }));
}

render();
