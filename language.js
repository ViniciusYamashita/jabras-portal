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
    'PORTAL ADMINISTRATIVO': '管理ポータル',
    'Administrador': '管理者',
    'Visão geral da operação': '業務全体の概要',
    'Boa tarde': 'こんにちは',
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
    'SOLICITAÇÕES': '申請',
    'Solicitações recentes': '最近の申請',
    'Ver todas →': 'すべて表示 →',
    'Funcionário': '社員',
    'FUNCIONÁRIO': '社員',
    'Local': '配属先',
    'LOCAL': '配属先',
    'Período': '期間',
    'PERÍODO': '期間',
    'Status': 'ステータス',
    'STATUS': 'ステータス',
    'Em análise': '確認中',
    'Aprovada': '承認済み',
    'Revisão': '修正依頼',
    'CALENDÁRIO': 'カレンダー',
    'Próximas ausências': '今後の休暇予定',
    'Abrir →': '開く →',
    'Módulo em preparação': '準備中の機能',
    'A estrutura visual está pronta. Este módulo será desenvolvido nas próximas etapas.': '画面構成は準備済みです。この機能は次の段階で開発します。',
    'Voltar ao dashboard': 'ダッシュボードへ戻る',
    'Pesquisar no portal...': 'ポータル内を検索...',
    'Meio período': '半日',
    '1 dia de 有休': '有休 1日',
    '2 dias de 有休': '有休 2日',
    '3 dias de 有休': '有休 3日',
    'ago.': '8月',
    'AGO': '8月'
  };

  const jaToPt = Object.fromEntries(Object.entries(ptToJa).map(([pt, ja]) => [ja, pt]));

  function translateTextNode(node, map) {
    const original = node.nodeValue;
    const trimmed = original.trim();
    if (!trimmed) return;

    if (map[trimmed]) {
      node.nodeValue = original.replace(trimmed, map[trimmed]);
      return;
    }

    let translated = trimmed;
    Object.entries(map)
      .sort((a, b) => b[0].length - a[0].length)
      .forEach(([from, to]) => {
        if (translated.includes(from)) translated = translated.split(from).join(to);
      });

    if (translated !== trimmed) node.nodeValue = original.replace(trimmed, translated);
  }

  function translatePage() {
    const root = document.querySelector('#app');
    if (!root) return;

    document.documentElement.lang = currentLanguage === 'ja' ? 'ja' : 'pt-BR';
    const map = currentLanguage === 'ja' ? ptToJa : jaToPt;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => translateTextNode(node, map));

    root.querySelectorAll('input[placeholder]').forEach(input => {
      const placeholder = input.placeholder.trim();
      if (map[placeholder]) input.placeholder = map[placeholder];
    });
  }

  function refreshLanguage() {
    currentLanguage = localStorage.getItem(STORAGE_KEY) || 'pt';
    requestAnimationFrame(translatePage);
  }

  const originalRender = window.render;
  if (typeof originalRender === 'function') {
    window.render = function patchedRender() {
      originalRender();
      refreshLanguage();
    };
  }

  const observer = new MutationObserver(() => refreshLanguage());
  const app = document.querySelector('#app');
  if (app) observer.observe(app, { childList: true, subtree: true });

  window.addEventListener('storage', refreshLanguage);
  document.addEventListener('DOMContentLoaded', refreshLanguage);
  refreshLanguage();
})();
