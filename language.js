(() => {
  const STORAGE_KEY = 'jabras-portal-language';
  let currentLanguage = localStorage.getItem(STORAGE_KEY) || 'pt';

  const ptToJa = {
    'Dashboard': 'ダッシュボード',
    'Funcionários': '社員',
    'Ponto': '勤怠',
    '有休 / Férias': '有休',
    'Relatórios': 'レポート',
    'Holerites': '給与明細',
    'Dormitórios': '寮管理',
    'Configurações': '設定',
    'MENU PRINCIPAL': 'メインメニュー',
    'Portal Administrativo': '管理ポータル',
    'Ambiente de desenvolvimento': '開発環境',
    'Visão geral da operação': '業務全体の概要',
    'Boa tarde 👋': 'こんにちは 👋',
    'Acompanhe as principais informações da Jabras Neo.': 'ジャブラスネオの主要情報を確認できます。',
    '＋ Nova solicitação de 有休': '＋ 有休を申請',
    'Funcionários ativos': '在籍社員',
    '+4 neste mês': '今月 +4名',
    '有休 pendentes': '有休承認待ち',
    '3 revisões aguardando': '修正依頼 3件',
    'Aprovadas hoje': '本日の承認',
    '32 dias autorizados': '承認済み 32日',
    'Ausentes hoje': '本日の休暇者',
    'Em 4 locais de trabalho': '4事業所',
    'Solicitações recentes': '最近の申請',
    'Ver todas': 'すべて表示',
    'Funcionário': '社員',
    'Local': '配属先',
    'Período': '期間',
    'Status': 'ステータス',
    'Em análise': '確認中',
    'Aprovada': '承認済み',
    'Revisão': '修正依頼',
    'Próximas ausências': '今後の休暇予定',
    'Calendário': 'カレンダー',
    'Módulo em preparação': '準備中の機能',
    'A estrutura visual está pronta. Este módulo será desenvolvido nas próximas etapas.': '画面構成は準備済みです。この機能は次の段階で開発します。',
    'Voltar ao dashboard': 'ダッシュボードへ戻る',
    'Pesquisar no portal...': 'ポータル内を検索...'
  };
  const jaToPt = Object.fromEntries(Object.entries(ptToJa).map(([pt, ja]) => [ja, pt]));

  function translatePage() {
    document.documentElement.lang = currentLanguage === 'ja' ? 'ja' : 'pt-BR';
    const map = currentLanguage === 'ja' ? ptToJa : jaToPt;
    const walker = document.createTreeWalker(document.querySelector('#app'), NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.parentElement?.closest('.language-switcher')) return;
      const text = node.nodeValue.trim();
      if (map[text]) node.nodeValue = node.nodeValue.replace(text, map[text]);
    });
    document.querySelectorAll('input[placeholder]').forEach(input => {
      if (map[input.placeholder]) input.placeholder = map[input.placeholder];
    });
  }

  function injectSwitcher() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions || headerActions.querySelector('.language-switcher')) return;
    const switcher = document.createElement('div');
    switcher.className = 'language-switcher';
    switcher.innerHTML = `
      <button class="language-button" type="button" aria-expanded="false">
        <span aria-hidden="true">🌐</span>
        <span class="language-button__label">${currentLanguage === 'ja' ? '日本語' : 'Português'}</span>
        <span aria-hidden="true">▾</span>
      </button>
      <div class="language-menu" hidden>
        <button class="language-option" type="button" data-language="pt">Português <span>✓</span></button>
        <button class="language-option" type="button" data-language="ja">日本語 <span>✓</span></button>
      </div>`;
    const avatar = headerActions.querySelector('.avatar');
    headerActions.insertBefore(switcher, avatar || null);

    const button = switcher.querySelector('.language-button');
    const menu = switcher.querySelector('.language-menu');
    button.addEventListener('click', event => {
      event.stopPropagation();
      menu.hidden = !menu.hidden;
      button.setAttribute('aria-expanded', String(!menu.hidden));
    });
    switcher.querySelectorAll('.language-option').forEach(option => {
      option.classList.toggle('active', option.dataset.language === currentLanguage);
      option.addEventListener('click', () => {
        currentLanguage = option.dataset.language;
        localStorage.setItem(STORAGE_KEY, currentLanguage);
        menu.hidden = true;
        render();
      });
    });
  }

  const originalRender = window.render;
  if (typeof originalRender !== 'function') return;

  window.render = function patchedRender() {
    originalRender();
    injectSwitcher();
    translatePage();
  };

  document.addEventListener('click', () => {
    const menu = document.querySelector('.language-menu');
    if (menu) menu.hidden = true;
  });

  window.render();
})();
