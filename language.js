(() => {
  const STORAGE_KEY = 'jabras-portal-language';

  const translations = {
    ja: {
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
      'Pesquisar no portal...': 'ポータル内を検索...',
      'Português': 'ポルトガル語',
      'Japonês': '日本語'
    }
  };

  const reverseJapanese = Object.fromEntries(
    Object.entries(translations.ja).map(([pt, ja]) => [ja, pt])
  );

  let currentLanguage = localStorage.getItem(STORAGE_KEY) || 'pt';
  let observerRunning = false;

  function translateText(value, language) {
    const trimmed = value.trim();
    if (!trimmed) return value;
    const translated = language === 'ja'
      ? translations.ja[trimmed]
      : reverseJapanese[trimmed];
    if (!translated) return value;
    return value.replace(trimmed, translated);
  }

  function applyTranslations(root = document.body) {
    observerRunning = true;
    document.documentElement.lang = currentLanguage === 'ja' ? 'ja' : 'pt-BR';

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest('.language-switcher') || ['SCRIPT', 'STYLE'].includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => { node.nodeValue = translateText(node.nodeValue, currentLanguage); });

    document.querySelectorAll('input[placeholder]').forEach(input => {
      input.placeholder = translateText(input.placeholder, currentLanguage);
    });

    updateSwitcherState();
    observerRunning = false;
  }

  function switcherMarkup() {
    const label = currentLanguage === 'ja' ? '日本語' : 'Português';
    return `
      <div class="language-switcher">
        <button class="language-button" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="Selecionar idioma">
          <span class="language-button__globe" aria-hidden="true">◎</span>
          <span class="language-button__label">${label}</span>
          <span class="language-button__chevron" aria-hidden="true">▼</span>
        </button>
        <div class="language-menu" role="listbox" hidden>
          <button class="language-option" type="button" role="option" data-language="pt">
            <span>Português</span><span class="check">✓</span>
          </button>
          <button class="language-option" type="button" role="option" data-language="ja">
            <span>日本語</span><span class="check">✓</span>
          </button>
        </div>
      </div>`;
  }

  function injectSwitcher() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions || headerActions.querySelector('.language-switcher')) return;

    const avatar = headerActions.querySelector('.avatar');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = switcherMarkup().trim();
    const switcher = wrapper.firstElementChild;
    headerActions.insertBefore(switcher, avatar || null);
    bindSwitcher(switcher);
    updateSwitcherState();
  }

  function bindSwitcher(switcher) {
    const button = switcher.querySelector('.language-button');
    const menu = switcher.querySelector('.language-menu');

    button.addEventListener('click', event => {
      event.stopPropagation();
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
    });

    switcher.querySelectorAll('.language-option').forEach(option => {
      option.addEventListener('click', () => {
        currentLanguage = option.dataset.language;
        localStorage.setItem(STORAGE_KEY, currentLanguage);
        button.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
        applyTranslations();
      });
    });
  }

  function updateSwitcherState() {
    const switcher = document.querySelector('.language-switcher');
    if (!switcher) return;
    const label = switcher.querySelector('.language-button__label');
    if (label) label.textContent = currentLanguage === 'ja' ? '日本語' : 'Português';
    switcher.querySelectorAll('.language-option').forEach(option => {
      const active = option.dataset.language === currentLanguage;
      option.classList.toggle('active', active);
      option.setAttribute('aria-selected', String(active));
    });
  }

  document.addEventListener('click', event => {
    const switcher = document.querySelector('.language-switcher');
    if (!switcher || switcher.contains(event.target)) return;
    const button = switcher.querySelector('.language-button');
    const menu = switcher.querySelector('.language-menu');
    button.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
  });

  const observer = new MutationObserver(() => {
    if (observerRunning) return;
    injectSwitcher();
    applyTranslations();
  });

  function init() {
    injectSwitcher();
    applyTranslations();
    observer.observe(document.querySelector('#app'), { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
