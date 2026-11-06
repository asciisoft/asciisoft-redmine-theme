/*
 * ASCII SOFT Redmine Theme 1.4.0 — theme.js
 * 플러그인(asciisoft_portal)이 있으면 알림 · 프로젝트 헤더 · 통계 · 화면 모드 저장을 사용하고,
 * 없으면 화면 꾸미기만 동작합니다. 외부 라이브러리 없이 동작합니다(레드마인 기본 jQuery만 선택적으로 사용).
 */
(function () {
  'use strict';

  var D = document, H = D.documentElement, W = window;
  var MODES = ['light', 'white', 'gray', 'dark', 'blue', 'sunset', 'green', 'purple', 'orange', 'pink'];

  /* 화면 모드: 깜빡임을 막기 위해 head 단계에서 먼저 적용 */
  try {
    var saved = localStorage.getItem('as-mode');
    if (saved && MODES.indexOf(saved) > -1) H.setAttribute('data-as-mode', saved);
  } catch (e) { /* noop */ }
  H.classList.add('as-js');

  var CTX = {};
  var LANG = 'ko';
  var I18N = {
    ko: {
      center: '프로젝트 센터', search: '검색', menu: '전체 메뉴', notifications: '알림', allRead: '모두 읽음',
      empty: '새 알림이 없습니다', all: '전체', filters: '검색조건', mode: '화면 모드', editHeader: '헤더 설정',
      sNew: '신규', sProgress: '진행', sOverdue: '지연', sPercent: '전체 진척도', byStatus: '상태별',
      private: '비공개', first: '처음', last: '끝', close: '닫기', today: '오늘', tomorrow: '내일',
      phLogin: '계정', phPassword: '비밀번호', showPw: '비밀번호 보기', ovDesc: '프로젝트 설명', reply: '댓글달기', loginTitle: '로그인', loginSub: '계정 정보를 입력해 주세요',
      artTitle: '요청부터 완료까지,<br>한 곳에서 함께 봅니다', artText: '요청 등록, 진행 상황, 문서와 일정을 고객사와 함께 확인하는 프로젝트센터입니다.',
      artTags: ['요청 관리', '진행 현황', '문서 · 위키', '일정'],
      hello: function (n) { return (n ? n + '님, ' : '') + '반갑습니다'; }, helloSub: '자주 쓰는 메뉴에서 바로 시작해 보세요.',
      qMy: ['내 페이지', '내 요청과 일정을 한눈에'], qProjects: ['프로젝트', '참여 중인 프로젝트 목록'], qIssues: ['요청', '전체 요청 목록'], qSearch: ['검색', '요청 · 문서 · 위키 검색'],
      kAssigned: function (a) { return a ? a + '님이 요청을 배정했습니다' : '요청이 배정되었습니다'; },
      kMention: function (a) { return (a || '누군가') + '님이 회원님을 언급했습니다'; },
      kStatus: function (a, info) { return '상태가 \u2018' + (info || '') + '\u2019(으)로 변경되었습니다'; },
      kComment: function (a) { return (a || '누군가') + '님이 댓글을 남겼습니다'; },
      kDue: function (a, info, when) { return '기한이 ' + when + '입니다'; },
      ago: function (s) {
        if (s < 60) return '방금 전'; if (s < 3600) return Math.floor(s / 60) + '분 전';
        if (s < 86400) return Math.floor(s / 3600) + '시간 전'; return Math.floor(s / 86400) + '일 전';
      },
      modes: { light: '라이트', white: '화이트', gray: '그레이', dark: '다크', blue: '블루', sunset: '노을 레드', green: '그린', purple: '퍼플', orange: '오렌지', pink: '핑크' }
    },
    en: {
      center: 'Project Center', search: 'Search', menu: 'Menu', notifications: 'Notifications', allRead: 'All read',
      empty: 'No new notifications', all: 'All', filters: 'Filters', mode: 'Color mode', editHeader: 'Header settings',
      sNew: 'New', sProgress: 'In progress', sOverdue: 'Overdue', sPercent: 'Progress', byStatus: 'By status',
      private: 'Private', first: 'First', last: 'Last', close: 'Close', today: 'today', tomorrow: 'tomorrow',
      phLogin: 'Login', phPassword: 'Password', showPw: 'Show password', ovDesc: 'Description', reply: 'Reply', loginTitle: 'Sign in', loginSub: 'Enter your account details',
      artTitle: 'From request to done,<br>all in one place', artText: 'A project center to share requests, progress, documents and schedules with your clients.',
      artTags: ['Requests', 'Progress', 'Docs · Wiki', 'Schedule'],
      hello: function (n) { return 'Welcome' + (n ? ', ' + n : ''); }, helloSub: 'Start from your most-used menus.',
      qMy: ['My page', 'Your requests and schedule'], qProjects: ['Projects', 'Projects you belong to'], qIssues: ['Requests', 'All requests'], qSearch: ['Search', 'Requests, documents, wiki'],
      kAssigned: function (a) { return a ? a + ' assigned a request to you' : 'A request was assigned to you'; },
      kMention: function (a) { return (a || 'Someone') + ' mentioned you'; },
      kStatus: function (a, info) { return 'Status changed to \u2018' + (info || '') + '\u2019'; },
      kComment: function (a) { return (a || 'Someone') + ' commented on your request'; },
      kDue: function (a, info, when) { return 'Due ' + when; },
      ago: function (s) {
        if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + 'm ago';
        if (s < 86400) return Math.floor(s / 3600) + 'h ago'; return Math.floor(s / 86400) + 'd ago';
      },
      modes: { light: 'Light', white: 'White', gray: 'Gray', dark: 'Dark', blue: 'Blue', sunset: 'Sunset', green: 'Green', purple: 'Purple', orange: 'Orange', pink: 'Pink' }
    }
  };
  function t(k) { return (I18N[LANG] || I18N.ko)[k]; }

  /* 이름 → 의미 키 (레드마인 설정값 기준, 영문 기본값 포함) */
  var STATUS_KEYS = {
    '신규등록': 'new', '신규': 'new', '검토중': 'review', '진행중': 'progress', '테스트중': 'test', '완료': 'done', '반려': 'reject',
    'new': 'new', 'in progress': 'progress', 'resolved': 'test', 'feedback': 'review', 'closed': 'done', 'rejected': 'reject'
  };
  var PRIORITY_KEYS = {
    '긴급조치': 'urgent', '긴급': 'urgent', '높음': 'high', '중간': 'normal', '보통': 'normal', '낮음': 'low', '매우낮음': 'lowest',
    'immediate': 'urgent', 'urgent': 'urgent', 'high': 'high', 'normal': 'normal', 'low': 'low'
  };
  var TRACKER_KEYS = {
    '기능 추가/변경': 'feature', '디자인 추가/변경': 'design', '데이터 추가/변경': 'data', '오류/결함': 'bug',
    '기타 요청': 'etc', '기타': 'etc', '문의': 'question', 'bug': 'bug', 'feature': 'feature', 'support': 'question'
  };
  var MODE_SWATCH = {
    light: 'linear-gradient(135deg,#f4f7fd 50%,#4f7cc8 50%)', white: 'linear-gradient(135deg,#ffffff 50%,#9dc1ff 50%)', gray: 'linear-gradient(135deg,#f3f4f6 50%,#4b5563 50%)',
    dark: 'linear-gradient(135deg,#0b1222 50%,#6a9cf5 50%)', blue: 'linear-gradient(135deg,#e5efff 50%,#6b9cf0 50%)',
    sunset: 'linear-gradient(135deg,#ffece6 50%,#f0766a 50%)', green: 'linear-gradient(135deg,#e4f5ec 50%,#4fb487 50%)',
    purple: 'linear-gradient(135deg,#eee8ff 50%,#9478e3 50%)', orange: 'linear-gradient(135deg,#ffefdf 50%,#f59e4c 50%)',
    pink: 'linear-gradient(135deg,#ffe9f3 50%,#f27bb0 50%)'
  };

  var ICON = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>',
    apps: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    alert: '<path d="M12 8v5M12 16.5h.01"/><circle cx="12" cy="12" r="9"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    at: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
    swap: '<path d="M4 7h13l-3-3M20 17H7l3 3"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    heart: '<path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 6.9 4.5c2 0 3.4 1.1 4.1 2.3.7-1.2 2.1-2.3 4.1-2.3 3.5 0 5.5 3.5 4.2 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/>',
    reply: '<polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
  };
  function svg(name, w) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 2) +
      '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + '</svg>';
  }
  var LOGO = '<svg class="as-logo" viewBox="96 203 576 368" aria-hidden="true">' +
    '<clipPath id="as-lg-top"><rect x="0" y="203" width="768" height="184"/></clipPath>' +
    '<polygon class="lb" points="202,203 348,203 242,387 348,571 202,571 96,387"/>' +
    '<polygon class="lt" points="202,203 348,203 242,387 348,571 202,571 96,387" clip-path="url(#as-lg-top)"/>' +
    '<polygon class="lb" points="420,203 566,203 672,387 566,571 420,571 526,387"/>' +
    '<polygon class="lt" points="420,203 566,203 672,387 566,571 420,571 526,387" clip-path="url(#as-lg-top)"/>' +
    '<polygon class="ls" points="420,203 490,324 348,571 278,449"/></svg>';

  /* ---------- 유틸 ---------- */
  function $(s, r) { return (r || D).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); }
  function el(tag, cls, html) { var e = D.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function keyOf(map, name) { var n = norm(name); return map[n] || map[n.toLowerCase()] || ''; }
  function csrf() { var m = $('meta[name="csrf-token"]'); return m ? m.getAttribute('content') : ''; }
  function onReady(fn) { if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', fn); else fn(); }
  // 레드마인의 $(document).ready 처리(검색조건 행 생성 등)가 끝난 뒤 실행
  function later(fn) {
    if (W.jQuery) W.jQuery(function () { setTimeout(function () { safe(fn); }, 0); });
    else setTimeout(function () { safe(fn); }, 0);
  }
  function safe(fn) { try { fn(); } catch (e) { if (W.console) console.warn('[asciisoft-theme]', e); } }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function closePops(except) { $$('.as-pop.open').forEach(function (p) { if (p !== except) { p.classList.remove('open'); var b = p._btn; if (b) b.classList.remove('on'); } }); }

  /* ---------- 시작 ---------- */
  onReady(function () {
    var c = D.getElementById('asciisoft-context');
    if (c) { try { CTX = JSON.parse(c.textContent || '{}'); } catch (e) { CTX = {}; } }
    LANG = (H.getAttribute('lang') || 'ko').toLowerCase().indexOf('ko') === 0 ? 'ko' : 'en';

    safe(initMode);
    safe(buildTopBar);
    safe(buildHero);
    safe(buildSidebar);
    safe(buildIssueToolbar);
    safe(buildIssueTitle);
    safe(initIssueEdit);
    safe(buildLogin);
    safe(buildWelcome);
    safe(fixMyPage);
    safe(buildFooter);
    safe(buildProjectCards);
    safe(issueReadonlyStatus);
    safe(watchQueryForm);
    safe(buildOverview);
    safe(markTopMenu);
    safe(cleanWelcome);
    safe(movePrivate);
    safe(issueEditLinks);
    safe(watchContent);
    safe(watchNewsEdit);
    safe(function () { decorate(D); });
    safe(buildToasts);
    safe(initNotifications);
    H.classList.add('as-ready');

    D.addEventListener('click', function (e) {
      if (!e.target.closest('.as-pop') && !e.target.closest('.as-pop-btn')) closePops();
    });
    D.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePops();
      if (e.key === '/' && !/input|textarea|select/i.test((e.target.tagName || '')) && !e.target.isContentEditable) {
        var b = $('.as-search-btn'); if (b) { e.preventDefault(); b.click(); }
      }
    });
    if (W.jQuery) {
      var timer;
      W.jQuery(D).on('ajaxComplete', function () { clearTimeout(timer); timer = setTimeout(function () { safe(function () { decorate(D); }); }, 30); });
    }
  });

  /* ---------- 화면 모드 ---------- */
  function applyMode(m, persist) {
    if (MODES.indexOf(m) < 0) m = 'light';
    H.setAttribute('data-as-mode', m);
    store('as-mode', m);
    $$('.as-modes button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-m') === m); });
    if (persist && CTX.endpoints && CTX.endpoints.mode && CTX.user && CTX.user.logged) {
      fetch(CTX.endpoints.mode, {
        method: 'POST', credentials: 'same-origin',
        headers: { 'X-CSRF-Token': csrf(), 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest' },
        body: 'mode=' + encodeURIComponent(m)
      }).catch(function () { });
    }
  }
  function initMode() {
    if (CTX.mode && MODES.indexOf(CTX.mode) > -1) applyMode(CTX.mode, false);
    else if (!H.getAttribute('data-as-mode')) H.setAttribute('data-as-mode', 'light');
  }
  function modePicker() {
    var cur = H.getAttribute('data-as-mode') || 'light';
    var box = el('div', 'as-modes', '<b>' + t('mode') + '</b><div class="sw"></div>');
    var sw = $('.sw', box);
    MODES.forEach(function (m) {
      var b = el('button', m === cur ? 'on' : '');
      b.type = 'button'; b.setAttribute('data-m', m); b.title = t('modes')[m];
      b.setAttribute('aria-label', t('modes')[m]); b.style.background = MODE_SWATCH[m];
      b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); applyMode(m, true); });
      sw.appendChild(b);
    });
    return box;
  }

  /* ---------- 상단 바 ---------- */
  function popButton(iconName, title, cls, pop) {
    var wrap = el('div', 'as-wrap-rel ' + (cls || ''));
    var btn = el('button', 'as-ib as-pop-btn', svg(iconName));
    btn.type = 'button'; btn.title = title; btn.setAttribute('aria-label', title);
    wrap.appendChild(btn);
    if (pop) {
      pop._btn = btn; wrap.appendChild(pop);
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = !pop.classList.contains('open');
        closePops(pop);
        pop.classList.toggle('open', open); btn.classList.toggle('on', open);
        if (open && pop._onOpen) pop._onOpen();
      });
    }
    return { wrap: wrap, btn: btn };
  }

  function buildTopBar() {
    var nav = D.getElementById('top-menu');
    if (!nav) return;
    var base = CTX.base || '';

    var brand = el('a', 'as-brand', LOGO + '<b>ASCII SOFT</b><small>' + esc(t('center')) + '</small>');
    brand.href = base + '/';
    nav.insertBefore(brand, nav.firstChild);

    var menu = D.getElementById('main-menu');
    var general = $('.general-menu', nav);
    if (menu) {
      nav.insertBefore(menu, general || brand.nextSibling);
      D.body.classList.add('as-has-pmenu');
    }

    var actions = el('div', 'as-actions');
    var profile = $('.profile-menu', nav);
    nav.insertBefore(actions, profile);

    // 모바일: 레드마인 기본 메뉴(플라이아웃)를 상단 바에서 엽니다
    var mt = $('#header .js-flyout-menu-toggle-button');
    if (mt) {
      var mb = el('button', 'as-ib as-mtoggle', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>');
      mb.type = 'button'; mb.setAttribute('aria-label', 'menu');
      mb.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); if (W.jQuery) W.jQuery(mt).trigger('click'); else mt.click(); });
      nav.insertBefore(mb, nav.firstChild);
    }

    // 프로젝트 화면에서는 전체 메뉴(홈 · 내 페이지 · 프로젝트 · 관리 · 도움말)를 버튼 하나로 모읍니다.
    var links = general && $('.top-menu__links ul', general);
    if (menu && links) {
      var apps = el('div', 'as-pop as-apps-pop');
      var cl = links.cloneNode(true);
      $$('a.help', cl).forEach(function (a) { var li = a.closest('li'); (li || a).remove(); });
      apps.appendChild(cl);
      actions.appendChild(popButton('apps', t('menu'), '', apps).wrap);
    }

    var qs = D.getElementById('quick-search');
    if (qs) {
      var sp = el('div', 'as-pop as-search-pop');
      sp.appendChild(qs);
      sp._onOpen = function () { var q = D.getElementById('q'); if (q) setTimeout(function () { q.focus(); q.select(); }, 30); };
      var sb = popButton('search', t('search'), 'as-search-wrap', sp);
      sb.btn.classList.add('as-search-btn');
      actions.appendChild(sb.wrap);
    }

    var account = D.getElementById('account');
    var trigger = account && $('.dropdown-trigger', account);
    var uname = (CTX.user && CTX.user.name) || norm(($('.user-info .user-name', account || D) || {}).textContent);
    var anon = (CTX.user && CTX.user.logged === false) || /^(익명|anonymous)$/i.test(uname || '');
    if (trigger && uname && !anon) {
      var parts = splitName(uname);
      var me = el('span', 'as-me', esc(parts[0]));
      var avatar = $('img, .avatar', trigger);
      if (avatar && avatar.nextSibling) trigger.insertBefore(me, avatar.nextSibling); else trigger.appendChild(me);
    }
    var dd = account && $('.dropdown-content', account);
    if (dd) {
      var info = $('.user-info', dd);
      var picker = modePicker();
      if (info && info.nextSibling) dd.insertBefore(picker, info.nextSibling); else dd.appendChild(picker);
    }
  }

  /* ---------- 헤더 (Hero) ---------- */
  function buildHero() {
    var header = D.getElementById('header');
    if (!header) return;
    var p = CTX.project;
    var h1 = $('h1', header);
    if (!p || !h1) { header.classList.add('as-header-compact'); return; }

    header.classList.add('as-hero');
    var cur = $('.current-project', h1);
    if (cur && !cur.closest('a') && p.identifier) {
      var pl = el('a', 'as-project-link'); pl.href = (CTX.base || '') + '/projects/' + encodeURIComponent(p.identifier);
      cur.parentNode.insertBefore(pl, cur); pl.appendChild(cur);
    }
    var top = el('div', 'as-hero-top');
    if (p.status_label) {
      var pill = el('span', 'as-pill', '<i></i>' + esc(p.status_label) + (p.subtitle ? ' \u00b7 ' + esc(p.subtitle) : ''));
      pill.setAttribute('data-k', p.status || 'active');
      top.appendChild(pill);
    } else if (p.subtitle) {
      top.appendChild(el('span', 'as-pill', esc(p.subtitle)));
    }
    if (p.can_edit && p.settings_url) {
      var edit = el('a', 'as-hero-edit', svg('edit'));
      edit.href = p.settings_url; edit.title = t('editHeader');
      top.appendChild(edit);
    }
    var bc = $('.breadcrumbs', h1);
    if (bc && norm(bc.textContent)) top.appendChild(bc);
    var main = el('div', 'as-hero-main');
    header.insertBefore(main, h1);
    if (top.childNodes.length) main.appendChild(top);
    main.appendChild(h1);
    if (p.sub_title) h1.appendChild(el('span', 'as-sub-title', esc(p.sub_title)));
    if (p.logo) {
      var lg = el('a', 'as-hero-logo', '<img alt="" src="' + esc(p.logo) + '">');
      lg.href = (CTX.base || '') + '/projects/' + encodeURIComponent(p.identifier);
      header.insertBefore(lg, main);
    }

    if (p.bg === 'image' && p.image) {
      header.classList.add('as-hero-image');
      header.style.setProperty('--as-hero-img', 'url("' + p.image.replace(/"/g, '%22') + '")');
    } else if (p.bg === 'none') {
      header.classList.add('as-hero-plain');
    } else {
      hexField(header);
    }

    if (p.stats) {
      var s = p.stats;
      var box = el('div', 'as-stats');
      [['sNew', s.new, ''], ['sProgress', s.progress, ''], ['sOverdue', s.overdue, s.overdue > 0 ? 'warn' : ''], ['sPercent', s.percent, '', '%']]
        .forEach(function (it) {
          var card = el('div', 'as-stat ' + it[2], '<b data-n="' + (it[1] || 0) + '" data-u="' + (it[3] || '') + '">0' + (it[3] || '') + '</b><span>' + esc(t(it[0])) + '</span>');
          box.appendChild(card);
        });
      header.appendChild(box);
      header.classList.add('as-has-stats');
      countUp(box);
    }
  }

  function countUp(root) {
    var nums = $$('b[data-n]', root);
    var reduce = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;
    nums.forEach(function (b) {
      var end = +b.getAttribute('data-n') || 0, u = b.getAttribute('data-u') || '';
      if (reduce || end === 0) { b.textContent = end + u; return; }
      var t0 = performance.now();
      (function f(n) {
        var pr = Math.min(1, (n - t0) / 900), v = Math.round(end * (1 - Math.pow(1 - pr, 3)));
        b.textContent = v + u; if (pr < 1) requestAnimationFrame(f);
      })(t0);
    });
  }

  // 헥사 패턴: 마우스가 움직일 때만 다시 그립니다 (상시 애니메이션 없음)
  function hexField(header) {
    var cv = el('canvas', 'as-hex');
    header.insertBefore(cv, header.firstChild);
    var ctx = cv.getContext('2d');
    if (!ctx) return;
    var w = 0, h = 0, cells = [], mx = -1e4, my = -1e4, raf = 0;
    function color() { return (getComputedStyle(header).getPropertyValue('--as-hex') || '46,83,146').trim(); }
    function size() {
      var r = header.getBoundingClientRect(), d = Math.min(W.devicePixelRatio || 1, 2);
      w = r.width; h = r.height; cv.width = w * d; cv.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      cells = []; var s = 44, hh = s * 0.866, seed = 7;
      for (var row = -1; row < h / hh + 1; row++) for (var q = -1; q < w / (s * 1.5) + 1; q++) {
        seed = (seed * 9301 + 49297) % 233280;
        cells.push({ x: q * s * 1.5, y: row * hh * 2 + (q % 2 ? hh : 0), r: seed / 233280 });
      }
      draw();
    }
    function hex(x, y, r) {
      ctx.beginPath();
      for (var i = 0; i < 6; i++) { var a = Math.PI / 3 * i + Math.PI / 6; ctx[i ? 'lineTo' : 'moveTo'](x + r * Math.cos(a), y + r * Math.sin(a)); }
      ctx.closePath();
    }
    function draw() {
      raf = 0; ctx.clearRect(0, 0, w, h);
      var rgb = color(), dark = H.getAttribute('data-as-mode') === 'dark';
      for (var i = 0; i < cells.length; i++) {
        var c = cells[i], near = Math.max(0, 1 - Math.hypot(c.x - mx, c.y - my) / 230), rr = 17 + near * 5;
        var a = (dark ? .05 : .055) + c.r * .06 + near * .35;
        ctx.strokeStyle = 'rgba(' + rgb + ',' + a.toFixed(3) + ')'; ctx.lineWidth = 1; hex(c.x, c.y, rr); ctx.stroke();
        if (c.r > .86 || near > .35) { ctx.fillStyle = 'rgba(' + rgb + ',' + ((c.r - .84) * .5 + near * .25).toFixed(3) + ')'; hex(c.x, c.y, rr); ctx.fill(); }
      }
    }
    function queue() { if (!raf) raf = requestAnimationFrame(draw); }
    header.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; queue(); });
    header.addEventListener('pointerleave', function () { mx = my = -1e4; queue(); });
    if (W.ResizeObserver) new ResizeObserver(size).observe(header); else W.addEventListener('resize', size);
    new MutationObserver(queue).observe(H, { attributes: true, attributeFilter: ['data-as-mode'] });
    size();
  }

  /* ---------- 사이드바 카드 ---------- */
  function buildSidebar() {
    var sw = D.getElementById('sidebar-wrapper');
    if (!sw || sw.classList.contains('as-done')) return;
    sw.classList.add('as-done');
    var nodes = Array.prototype.slice.call(sw.childNodes), card = null;
    var keep = false;
    nodes.forEach(function (n) {
      if (n.nodeType === 3 && !n.textContent.trim()) return;
      if (n.nodeType === 1 && /^(SCRIPT|STYLE)$/.test(n.tagName)) return;
      if (n.nodeType === 1) {
        var nextEl = n.nextElementSibling;
        if (n.classList.contains('contextual') && nextEl && nextEl.tagName === 'H3') { card = null; keep = true; }
        else if (n.tagName === 'H3') { if (!keep) card = null; keep = false; }
        else if (n.tagName === 'DIV' && n.id) { card = null; keep = false; }
      }
      if (!card) { card = el('div', 'as-card'); sw.insertBefore(card, n); }
      card.appendChild(n);
    });

    var p = CTX.project;
    if (p && p.stats && p.stats.by_status && isIssueIndex()) {
      var rows = p.stats.by_status.filter(function (s) { return s.count > 0; });
      if (!rows.length) return;
      var max = Math.max.apply(null, rows.map(function (s) { return s.count; }));
      var c = el('div', 'as-card as-status-card', '<h3>' + esc(t('byStatus')) + '</h3>');
      rows.forEach(function (s) {
        var r = el('div', 'as-sbar' + (s.closed ? ' closed' : ''),
          '<span>' + esc(s.name) + '</span><i style="width:' + Math.max(3, Math.round(s.count / max * 100)) + '%"></i><b>' + s.count + '</b>');
        r.addEventListener('click', function () { applyStatusFilter('=', s.id); });
        c.appendChild(r);
      });
      sw.insertBefore(c, sw.firstChild);
    }
  }

  /* ---------- 요청 목록: 상태 탭 · 검색조건 · 등록 버튼 ---------- */
  function isIssueIndex() { return D.body.classList.contains('controller-issues') && D.body.classList.contains('action-index'); }

  function statusList() {
    var af = W.availableFilters;
    if (af && af.status_id && af.status_id.values) {
      return af.status_id.values.map(function (v) { return { id: String(v[1]), name: v[0] }; });
    }
    return (CTX.statuses || []).map(function (s) { return { id: String(s.id), name: s.name }; });
  }

  function currentStatus() {
    var cb = D.getElementById('cb_status_id'), op = D.getElementById('operators_status_id');
    if (!cb || !cb.checked || !op || op.value === '*') return 'all';
    if (op.value === '=') {
      var v = D.getElementById('values_status_id_1');
      var vals = v ? Array.prototype.filter.call(v.options, function (o) { return o.selected; }).map(function (o) { return o.value; }) : [];
      if (vals.length === 1) return vals[0];
    }
    return null;
  }

  function applyStatusFilter(op, id) {
    var jq = W.jQuery, form = D.getElementById('query_form');
    var list = $('#content .autoscroll') || $('#content .nodata');
    if (list) list.classList.add('as-list-loading');
    if (jq && form && W.availableFilters && W.availableFilters.status_id && W.addFilter) {
      if (!D.getElementById('tr_status_id')) W.addFilter('status_id', op, id ? [String(id)] : []);
      jq('#cb_status_id').prop('checked', true);
      if (W.toggleFilter) W.toggleFilter('status_id');
      jq('#operators_status_id').val(op);
      if (W.toggleOperator) W.toggleOperator('status_id');
      if (id) jq('#values_status_id_1').val([String(id)]);
      jq(form).find('input[name="page"]').remove();
      jq(form).submit();
      return;
    }
    // 검색조건 폼이 없을 때: 주소로 이동
    var u = new URL(W.location.href);
    ['f[]', 'op[status_id]', 'v[status_id][]', 'page', 'query_id'].forEach(function (k) { if (k !== 'f[]') u.searchParams.delete(k); });
    var fs = u.searchParams.getAll('f[]').filter(function (f) { return f !== 'status_id'; });
    u.searchParams.delete('f[]'); fs.forEach(function (f) { u.searchParams.append('f[]', f); });
    u.searchParams.set('set_filter', '1'); u.searchParams.append('f[]', 'status_id');
    u.searchParams.set('op[status_id]', op); u.searchParams.append('v[status_id][]', id ? String(id) : '');
    W.location.href = u.toString();
  }

  function activeFilterCount() {
    return $$('#filters-table input[name="f[]"]:checked').filter(function (i) { return i.value && i.value !== 'status_id'; }).length;
  }

  function buildIssueToolbar() {
    if (!isIssueIndex()) return;
    var form = D.getElementById('query_form'), content = D.getElementById('content');
    if (!form || !content || $('.as-toolbar', content)) return;

    var bar = el('div', 'as-toolbar');
    var h2 = $('#content > h2');
    var selectedQuery = $('#sidebar ul.queries a.selected');
    if (h2 && selectedQuery) bar.appendChild(el('span', 'as-qname', esc(norm(h2.textContent))));

    var seg = el('div', 'as-seg');
    var items = [{ id: 'all', name: t('all') }].concat(statusList());
    items.forEach(function (s) {
      var b = el('button', '', esc(s.name));
      b.type = 'button'; b.setAttribute('data-id', String(s.id));
      b.addEventListener('click', function () {
        if (b.classList.contains('on')) return;
        $$('button', seg).forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on');
        if (s.id === 'all') applyStatusFilter('*', null); else applyStatusFilter('=', s.id);
      });
      seg.appendChild(b);
    });
    bar.appendChild(seg);

    var right = el('div', 'as-toolbar-r');
    var fbtn = el('button', 'as-btn', svg('filter') + esc(t('filters')));
    fbtn.type = 'button';
    later(function () {
      var cur = String(currentStatus());
      $$('button', seg).forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-id') === cur); });
      var n = activeFilterCount();
      if (n) fbtn.appendChild(el('span', 'cnt', String(n)));
    });
    var open = store('as-filter-open') === '1';
    form.classList.toggle('as-collapsed', !open);
    fbtn.addEventListener('click', function () {
      var o = form.classList.toggle('as-collapsed');
      store('as-filter-open', o ? '0' : '1');
    });
    right.appendChild(fbtn);
    var ctx = $('#content > .contextual');
    if (ctx) right.appendChild(ctx);
    bar.appendChild(right);

    content.insertBefore(bar, form);
    D.body.classList.add('as-has-toolbar');
  }

  /* ---------- 꾸미기: 배지 · 사용자 · 비공개 · 페이지 이동 ---------- */
  // "이름/회사", "이름 / 회사", "이름(회사)", "이름 (회사)" 형식에서 이름만 꺼냅니다 (표시는 바꾸지 않음)
  function splitName(name) {
    var s = norm(name), m = s.match(/^(.+?)\s*\((.+)\)$/);
    if (m) return [m[1].trim(), m[2].trim()];
    var i = s.lastIndexOf('/');
    if (i > 0 && i < s.length - 1) return [s.slice(0, i).trim(), s.slice(i + 1).trim()];
    return [s, ''];
  }
  function customerIds() {
    var ids = (CTX.project && CTX.project.customers) || [];
    var m = {}; ids.forEach(function (i) { m[String(i)] = 1; }); return m;
  }
  function userIdOf(a) { var m = (a.getAttribute('href') || '').match(/\/users\/(\d+)/); return m ? m[1] : null; }

  function decorate(root) {
    var cust = customerIds();

    $$('td.status:not([data-as])', root).forEach(function (td) {
      td.setAttribute('data-as', '1');
      var name = norm(td.textContent); if (!name) return;
      td.innerHTML = '<span class="as-st" data-k="' + keyOf(STATUS_KEYS, name) + '">' + esc(name) + '</span>';
    });
    $$('div.issue .attributes .status .value:not([data-as])', root).forEach(function (v) {
      v.setAttribute('data-as', '1');
      var name = norm(v.textContent); if (!name) return;
      v.innerHTML = '<span class="as-st" data-k="' + keyOf(STATUS_KEYS, name) + '">' + esc(name) + '</span>';
    });
    $$('td.priority:not([data-as]), div.issue .attributes .priority .value:not([data-as])', root).forEach(function (td) {
      td.setAttribute('data-as', '1');
      var name = norm(td.textContent); if (!name) return;
      td.innerHTML = '<span class="as-pr" data-k="' + keyOf(PRIORITY_KEYS, name) + '">' + esc(name) + '</span>';
    });
    $$('td.tracker:not([data-k])', root).forEach(function (td) { td.setAttribute('data-k', keyOf(TRACKER_KEYS, td.textContent) || 'etc'); });

    $$('a.user:not([data-as])', root).forEach(function (a) {
      a.setAttribute('data-as', '1');
      if (a.closest('#top-menu, .flyout-menu, .dropdown-content')) return;
      var parts = splitName(a.textContent);
      var cell = a.closest('td.assigned_to, td.author, td.last_updated_by');
      if (cell && !$('.as-av', cell) && !$('img, .avatar', cell)) {
        var av = el('span', 'as-av', esc(parts[0].charAt(0)));
        cell.insertBefore(av, cell.firstChild);
      }
    });

    $$('tr.issue.private td.subject:not([data-as])', root).forEach(function (td) {
      td.setAttribute('data-as', '1');
      if ($('.badge-private, .as-lock', td)) return;
      td.appendChild(el('span', 'as-lock', svg('lock', 2.6) + esc(t('private'))));
    });
    $$('tr.issue.idnt').forEach(function (tr) {
      var m = tr.className.match(/idnt-(\d+)/); if (m) tr.style.setProperty('--as-idnt', (Math.min(+m[1], 6) * 16) + 'px');
    });

    $$('.pagination ul.pages:not([data-as])', root).forEach(paginationExtras);
    $$('select:not([data-as-gap])', root).forEach(selectGap);
    $$('div.journal .journal-actions a.icon-comment:not([data-as]), div.journal .journal-actions a.icon-quote:not([data-as]), #content a.icon-quote:not([data-as])', root).forEach(function (a) {
      a.setAttribute('data-as', '1');
      var sv = $('svg', a);
      if (sv) sv.outerHTML = svg('reply');
      if (!a.title) a.title = t('reply');
    });
    $$('.reaction-button:not([data-as])', root).forEach(function (b) {
      b.setAttribute('data-as', '1');
      var sv = $('svg', b);
      if (sv) sv.outerHTML = svg('heart');
    });
    $$('.members.box a.user:not([data-as-initial])', root).forEach(function (a) {
      a.setAttribute('data-as-initial', splitName(a.textContent)[0].charAt(0));
    });
  }

  // 선택박스 좌우에 글자나 다른 요소가 바로 붙어 있으면 6px 간격을 둡니다 (이미 공백이 있으면 그대로)
  function selectGap(sel) {
    sel.setAttribute('data-as-gap', '1');
    if (sel.closest('.as-search-pop, .flyout-menu, .drdn-content')) return;
    var cs = getComputedStyle(sel);
    if (cs.display === 'block' || cs.position === 'absolute') return;
    function needs(node, side) {
      while (node && node.nodeType === 3 && node.textContent === '') node = side === 'l' ? node.previousSibling : node.nextSibling;
      if (!node) return false;
      if (node.nodeType === 3) {
        var tx = node.textContent;
        if (!tx.trim()) return false;
        return side === 'l' ? !/\s$/.test(tx) : !/^\s/.test(tx);
      }
      if (node.nodeType !== 1 || node.tagName === 'BR') return false;
      var d = getComputedStyle(node).display;
      return d.indexOf('inline') === 0;
    }
    if (needs(sel.previousSibling, 'l') && parseFloat(cs.marginLeft) < 6) sel.classList.add('as-gap-l');
    if (needs(sel.nextSibling, 'r') && parseFloat(cs.marginRight) < 6) sel.classList.add('as-gap-r');
  }

  /* ---------- 요청 상세: 제목 줄 ---------- */
  function buildIssueTitle() {
    var b = D.body.classList;
    if (!b.contains('controller-issues') || !(b.contains('action-show') || b.contains('action-edit') || b.contains('action-update'))) return;
    var content = D.getElementById('content'), h2 = $('#content > h2');
    if (!content || !h2 || $('.as-titlebar', content)) return;
    var bar = el('div', 'as-titlebar'), title = el('div', 'as-title');
    var ctx = $('#content > .contextual');
    content.insertBefore(bar, h2);
    title.appendChild(h2);
    var n = bar.nextSibling;
    while (n && (n.nodeType === 3 || (n.nodeType === 1 && n.classList.contains('badge')))) {
      var next = n.nextSibling;
      if (n.nodeType === 1) title.appendChild(n); else if (!n.textContent.trim()) n.remove(); else break;
      n = next;
    }
    bar.appendChild(title);
    if (ctx) bar.appendChild(ctx);
  }

  /* ---------- 요청 편집: '편집'으로 열면 댓글 숨기고 설명 편집기 바로 표시 ---------- */
  function initIssueEdit() {
    if (!D.body.classList.contains('controller-issues')) return;
    function editMode(on) {
      var upd = D.getElementById('update') || D.getElementById('issue-form'); if (!upd) return;
      upd.classList.toggle('as-edit-mode', on);
      if (!on) return;
      var desc = D.getElementById('issue_description_and_toolbar');
      if (desc && desc.style.display === 'none') {
        desc.style.display = '';
        var p = desc.closest('p'), link = p && $('a.icon-edit', p);
        if (link) link.style.display = 'none';
      }
      setTimeout(function () { var ta = D.getElementById('issue_description'); if (ta && upd.classList.contains('as-edit-mode')) ta.focus(); }, 60);
    }
    D.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (!a) return;
      if (a.closest('#content > .contextual, .as-titlebar .contextual, #content > div.contextual') && a.classList.contains('icon-edit')) {
        setTimeout(function () { editMode(true); }, 0);
      } else if (a.closest('#history, .journal') && (a.classList.contains('icon-comment') || a.classList.contains('icon-quote') || /quote/i.test(a.getAttribute('onclick') || '') || a.getAttribute('data-method') === 'post')) {
        editMode(false);
      }
    }, true);
    if (D.body.classList.contains('action-edit')) editMode(true);
  }

  /* ---------- 로그인 (LOGIN-1) ---------- */
  function buildLogin() {
    var form = D.getElementById('login-form');
    if (!form || form.closest('.as-login1')) return;
    var u = D.getElementById('username'), pw = D.getElementById('password');
    if (u) u.setAttribute('placeholder', t('phLogin'));
    if (pw) pw.setAttribute('placeholder', t('phPassword'));
    var wrap = el('div', 'as-login1');
    form.parentNode.insertBefore(wrap, form);
    wrap.appendChild(form);
    var bg = el('div', 'as-login-bg'); D.body.appendChild(bg); hexField(bg);
    var f = $('form', form);
    if (!f) return;
    f.insertBefore(el('div', 'as-login-brand', LOGO + '<div class="co">ASCII SOFT</div><div class="pc">Project Center</div>'), f.firstChild);
    function field(input, icon) {
      if (!input) return null;
      var w = el('div', 'as-field', svg(icon));
      input.parentNode.insertBefore(w, input); w.appendChild(input); return w;
    }
    field(u, 'user');
    var pf = field(pw, 'lock');
    if (pf) {
      var eye = el('button', 'as-eye', svg('eye')); eye.type = 'button'; eye.title = t('showPw'); eye.setAttribute('aria-label', t('showPw'));
      eye.addEventListener('click', function () { pw.type = pw.type === 'password' ? 'text' : 'password'; pw.focus(); });
      pf.appendChild(eye);
    }
    var lost = $('a.lost_password', form), auto = $('label[for="autologin"]', form), submit = D.getElementById('login-submit');
    if (lost || auto) {
      var row = el('div', 'as-login-row');
      row.appendChild(auto || el('span'));
      if (lost) row.appendChild(lost);
      f.insertBefore(row, submit && submit.parentNode === f ? submit : null);
    }
    if (u && !u.value) setTimeout(function () { u.focus(); }, 50);
  }

  /* ---------- 프로젝트 개요: 설명과 위젯을 같은 카드 격자로 ---------- */
  function buildOverview() {
    var b = D.body.classList;
    if (!b.contains('controller-projects') || !b.contains('action-show')) return;
    var split = $('#content > .splitcontent');
    if (!split || $('.as-ov-grid')) return;
    var left = $('.splitcontentleft', split), right = $('.splitcontentright', split);
    var grid = el('div', 'as-ov-grid');
    var L = [], R = [];
    if (left) {
      var desc = null;
      Array.prototype.slice.call(left.children).forEach(function (c) {
        if (c.classList.contains('wiki') && !desc) {
          desc = el('div', 'box as-ov-desc', '<h3>' + svg('list') + esc(t('ovDesc')) + '</h3>');
          desc.appendChild(c); L.push(desc);
        } else if (c.tagName === 'UL' && !c.classList.contains('as-keep')) {
          c.remove();               // 홈페이지 주소 · 사용자 정의 필드 목록은 표시하지 않음
        } else if (c.nodeType === 1) {
          L.push(c);
        }
      });
    }
    if (right) Array.prototype.slice.call(right.children).forEach(function (c) { R.push(c); });
    for (var i = 0; i < Math.max(L.length, R.length); i++) {
      if (L[i]) grid.appendChild(L[i]);
      if (R[i]) grid.appendChild(R[i]);
    }
    split.parentNode.insertBefore(grid, split);
    split.remove();
  }

  /* ---------- 뉴스: 편집 중이면 본문 · 댓글 숨김 ---------- */
  function watchNewsEdit() {
    var ed = D.getElementById('edit-news');
    if (!ed || !W.MutationObserver) return;
    function sync() { D.body.classList.toggle('as-news-editing', ed.style.display !== 'none' && getComputedStyle(ed).display !== 'none'); }
    new MutationObserver(sync).observe(ed, { attributes: true, attributeFilter: ['style', 'class'] });
    sync();
  }

  /* ---------- 상단 전체 메뉴: 현재 위치 강조 ---------- */
  function markTopMenu() {
    var base = CTX.base || '', path = W.location.pathname.replace(/\/+$/, '') || '/';
    if (base && path.indexOf(base) === 0) path = path.slice(base.length) || '/';
    var b = D.body.classList;
    $$('nav.top-menu .general-menu .top-menu__links a').forEach(function (a) {
      var on = (a.classList.contains('home') && (path === '/' || b.contains('controller-welcome'))) ||
               (a.classList.contains('my-page') && /^\/my(\/page)?$/.test(path)) ||
               (a.classList.contains('projects') && path === '/projects') ||
               (a.classList.contains('administration') && path.indexOf('/admin') === 0);
      a.classList.toggle('as-current', !!on);
    });
  }

  /* ---------- 메인화면: 사이트 제목만 적힌 환영 문구 제거 ---------- */
  function cleanWelcome() {
    if (!D.body.classList.contains('controller-welcome')) return;
    var title = norm(($('#header h1') || {}).textContent).toLowerCase();
    $$('#content .wiki').forEach(function (w) {
      var tx = norm(w.textContent).toLowerCase();
      if (tx && (tx === title || tx === norm(D.title).toLowerCase())) w.remove();
    });
  }

  /* ---------- 요청 폼: 비공개 버튼을 유형 옆으로 ---------- */
  function movePrivate() {
    var wrap = D.getElementById('issue_is_private_wrap'), tr = D.getElementById('issue_tracker_id');
    if (!wrap || !tr || wrap.previousElementSibling === tr) return;
    tr.parentNode.insertBefore(wrap, tr.nextSibling);
  }

  /* ---------- 요청 상세의 '편집'은 편집 페이지(/issues/N/edit)로 이동 ---------- */
  function issueEditLinks() {
    var b = D.body.classList;
    if (!b.contains('controller-issues') || !b.contains('action-show')) return;
    $$('#content .contextual a.icon-edit').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (!/\/issues\/\d+\/edit/.test(href)) return;
      a.removeAttribute('onclick');
      a.addEventListener('click', function (e) { e.preventDefault(); e.stopImmediatePropagation(); W.location.href = href; }, true);
    });
  }

  /* ---------- 화면 일부가 다시 그려질 때(좋아요 등) 꾸미기 다시 적용 ---------- */
  function watchContent() {
    var c = D.getElementById('content');
    if (!c || !W.MutationObserver) return;
    var tm;
    new MutationObserver(function () {
      clearTimeout(tm);
      tm = setTimeout(function () { safe(function () { decorate(c); movePrivate(); }); }, 60);
    }).observe(c, { childList: true, subtree: true });
  }

  /* ---------- 하단: 회사 정보 (홈페이지와 동일) ---------- */
  function buildFooter() {
    var ft = D.getElementById('footer');
    if (!ft || ft.classList.contains('as-footer')) return;
    ft.classList.add('as-footer');
    var year = new Date().getFullYear();
    var html = '<div class="as-foot"><div class="as-foot-info"><span>아스키소프트</span>' +
      '<span><a href="mailto:contact@asciisoft.com">EMAIL : contact@asciisoft.com</a><i class="sep"></i>' +
      '<a href="tel:05052881001">TEL : 0505-288-1001</a><i class="sep"></i>FAX : 0505-288-1009</span>' +
      '<span>\u00a9 2014-' + year + ' ASCII SOFT. All rights reserved.</span></div>' +
      '<a class="as-foot-brand" href="https://asciisoft.com" target="_blank" rel="noopener">' + LOGO.replace('class="as-logo"', 'class="as-foot-logo"') + '<span>ASCII SOFT</span></a></div>';
    var inner = $('.bgl .bgr', ft) || $('.bgr', ft) || ft;
    inner.innerHTML = html;
  }

  /* ---------- 프로젝트 목록: 카드 ---------- */
  function buildProjectCards() {
    $$('#projects-index ul.projects.root > li.root').forEach(function (li) {
      var box = $('div.root', li), a = box && $('a.project', box);
      if (!box || !a || $('.as-pav', box)) return;
      var name = norm(a.textContent);
      box.insertBefore(el('span', 'as-pav', esc(name.charAt(0).toUpperCase())), box.firstChild);
      if (a.classList.contains('closed') || a.classList.contains('archived')) li.classList.add('as-closed');
    });
  }

  /* ---------- 요청 편집: 바꿀 수 없는 상태 값도 배지로 ---------- */
  function issueReadonlyStatus() {
    var names = {};
    (CTX.statuses || []).forEach(function (st) { names[norm(st.name)] = 1; });
    $$('#all_attributes p').forEach(function (p) {
      if ($('select, input, textarea', p) || p.getAttribute('data-as')) return;
      var label = $('label', p); if (!label) return;
      var txt = norm(p.textContent.replace(label.textContent, ''));
      if (!names[txt]) return;
      p.setAttribute('data-as', '1'); p.classList.add('as-ro');
      Array.prototype.slice.call(p.childNodes).forEach(function (n) { if (n !== label) n.remove(); });
      p.appendChild(el('span', 'as-st', esc(txt))).setAttribute('data-k', keyOf(STATUS_KEYS, txt));
    });
  }

  /* ---------- 검색조건: 필터 행이 추가될 때도 간격 적용 ---------- */
  function watchQueryForm() {
    var qf = D.getElementById('query_form') || D.getElementById('all_attributes');
    if (!qf || !W.MutationObserver) return;
    var tm;
    new MutationObserver(function () {
      clearTimeout(tm);
      tm = setTimeout(function () { $$('select:not([data-as-gap])', qf).forEach(selectGap); issueReadonlyStatus(); }, 40);
    }).observe(qf, { childList: true, subtree: true });
  }

  /* ---------- 홈: 시작 패널 ---------- */
  function buildWelcome() {
    if (!D.body.classList.contains('controller-welcome')) return;
    var content = D.getElementById('content');
    if (!content || $('.as-welcome', content) || !(CTX.user && CTX.user.logged) && !$('#account .user-name')) return;
    var base = CTX.base || '';
    var name = splitName((CTX.user && CTX.user.name) || norm(($('#account .user-name') || {}).textContent))[0];
    var box = el('div', 'as-welcome', '<h3>' + esc(t('hello')(name)) + '</h3><p>' + esc(t('helloSub')) + '</p><div class="as-quick"></div>');
    var q = $('.as-quick', box);
    [['home', 'qMy', '/my/page'], ['folder', 'qProjects', '/projects'], ['list', 'qIssues', '/issues'], ['search', 'qSearch', '/search']].forEach(function (it) {
      var a = el('a', '', '<i>' + svg(it[0]) + '</i><div><b>' + esc(t(it[1])[0]) + '</b><br><span>' + esc(t(it[1])[1]) + '</span></div>');
      a.href = base + it[2]; q.appendChild(a);
    });
    var h2 = $('#content > h2');
    content.insertBefore(box, h2 ? h2.nextSibling : content.firstChild);
    hexField(box);
  }

  /* ---------- 내 페이지: '추가:' 콜론 제거 ---------- */
  function fixMyPage() {
    var label = $('label[for="block-select"]');
    if (!label) return;
    var n = label.nextSibling;
    if (n && n.nodeType === 3) n.textContent = n.textContent.replace(/^\s*:\s*/, '');
    var sel = D.getElementById('block-select');
    if (sel) sel.classList.add('as-gap-l');
  }

  function paginationExtras(ul) {
    ul.setAttribute('data-as', '1');
    var cur = 0, max = 0, firstA = null, lastA = null;
    $$('li', ul).forEach(function (li) {
      var n = parseInt(norm(li.textContent), 10);
      if (isNaN(n)) return;
      if (li.classList.contains('current')) cur = n;
      var a = $('a', li);
      if (n === 1 && a) firstA = a;
      if (n >= max) { max = n; lastA = a || null; }
    });
    if (max < 2) return;
    function item(cls, label, title, link) {
      var li = el('li', cls);
      if (link) { var a = link.cloneNode(false); a.textContent = label; a.title = title; li.classList.add('page'); li.appendChild(a); }
      else li.appendChild(el('span', '', label));
      return li;
    }
    var prev = $('li.previous', ul), next = $('li.next', ul);
    if (prev) { var pa = $('a, span', prev); if (pa) { pa.title = norm(pa.textContent); pa.textContent = '\u2039'; } }
    if (next) { var na = $('a, span', next); if (na) { na.title = norm(na.textContent); na.textContent = '\u203a'; } }
    ul.insertBefore(item('as-first', '\u00ab', t('first'), cur === 1 ? null : firstA), ul.firstChild);
    ul.appendChild(item('as-last', '\u00bb', t('last'), cur === max ? null : lastA));
  }

  /* ---------- 토스트 ---------- */
  function toastBox(pos) {
    var box = $('.as-toasts.' + pos);
    if (!box) { box = el('div', 'as-toasts ' + pos); box.setAttribute('aria-live', 'polite'); D.body.appendChild(box); }
    return box;
  }
  function dismiss(n) { if (!n || n._gone) return; n._gone = true; n.classList.add('out'); setTimeout(function () { n.remove(); }, 260); }
  function toast(pos, html, cls, ms, onClick) {
    var n = el('div', 'as-toast ' + (cls || ''), html + '<button type="button" class="x" aria-label="' + esc(t('close')) + '">\u00d7</button>');
    $('.x', n).addEventListener('click', function (e) { e.stopPropagation(); dismiss(n); });
    if (onClick) n.addEventListener('click', onClick);
    var box = toastBox(pos);
    box.appendChild(n);
    while (box.children.length > 4) dismiss(box.firstChild);
    if (ms) setTimeout(function () { dismiss(n); }, ms);
    return n;
  }
  // 우측 하단: 내가 한 작업의 결과 (레드마인 flash 메시지)
  function buildToasts() {
    $$('#content > div.flash').forEach(function (f) {
      var kind = f.classList.contains('error') ? 'error' : (f.classList.contains('warning') ? 'warning' : 'notice');
      var text = norm(f.textContent); if (!text) return;
      f.classList.add('as-moved');
      toast('br', '<span class="ic">' + svg(kind === 'notice' ? 'check' : 'alert', 3) + '</span><div class="tx">' + esc(text) + '</div>',
        kind, kind === 'error' ? 0 : 4500);
    });
  }

  /* ---------- 알림 (우측 상단) ---------- */
  function initNotifications() {
    var cfg = CTX.notifications;
    if (!cfg || !cfg.enabled || !CTX.user || !CTX.user.logged) return;
    var actions = $('.as-actions');
    if (!actions) return;

    var pop = el('div', 'as-pop as-noti-pop',
      '<header><b>' + esc(t('notifications')) + '</b><span></span></header><div class="as-noti-list"><div class="as-noti-empty">\u2026</div></div>');
    var pb = popButton('bell', t('notifications'), 'as-noti-wrap', pop);
    actions.appendChild(pb.wrap);
    var badge = el('span', 'as-badge-count'); badge.style.display = 'none'; pb.btn.appendChild(badge);

    var lastKey = 'as-noti-last-' + CTX.user.id;
    var last = parseInt(sessionStorage.getItem(lastKey) || '0', 10) || 0;
    var busy = false;

    function setCount(n) {
      badge.style.display = n > 0 ? '' : 'none';
      if (n > 0 && badge.textContent !== String(n > 99 ? '99+' : n)) { badge.classList.remove('pulse'); void badge.offsetWidth; badge.classList.add('pulse'); }
      badge.textContent = n > 99 ? '99+' : String(n);
    }
    function get(q) {
      return fetch(cfg.url + q, { credentials: 'same-origin', headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
    }
    function poll() {
      if (busy || D.hidden) return;
      busy = true;
      get(last ? '?since_id=' + last : '').then(function (d) {
        setCount(d.unread || 0);
        if (last && d.items && d.items.length) {
          d.items.slice(0, 3).reverse().forEach(function (it) {
            toast('tr', '<span class="ic">' + svg(kindIcon(it.kind)) + '</span><div class="tx"><b>' + esc(kindText(it)) + '</b><span>#' +
              it.issue.id + ' ' + esc(it.issue.subject) + '</span></div>', 'noti', 7000, function () { W.location.href = it.url; });
          });
        }
        last = Math.max(last, d.latest_id || 0);
        sessionStorage.setItem(lastKey, String(last));
      }).catch(function () { }).then(function () { busy = false; });
    }
    pop._onOpen = function () {
      $$('.as-toasts.tr .as-toast').forEach(dismiss);
      var list = $('.as-noti-list', pop);
      get('?list=1').then(function (d) {
        $('header span', pop).textContent = (d.unread ? d.unread + ' \u00b7 ' : '') + t('allRead');
        if (!d.items || !d.items.length) { list.innerHTML = '<div class="as-noti-empty">' + esc(t('empty')) + '</div>'; }
        else {
          list.innerHTML = '';
          d.items.forEach(function (it) {
            var a = el('a', 'as-noti-item' + (it.unread ? ' unread' : ''),
              '<span class="as-noti-ic">' + svg(kindIcon(it.kind)) + '</span><div><div class="as-noti-t">' + esc(kindText(it)) +
              '</div><div class="as-noti-s">#' + it.issue.id + ' ' + esc(it.issue.subject) + '</div><div class="as-noti-m">' +
              esc(it.issue.project || '') + ' \u00b7 ' + esc(ago(it.created_at)) + '</div></div>');
            a.href = it.url; a.setAttribute('data-k', it.kind);
            list.appendChild(a);
          });
        }
        last = Math.max(last, d.latest_id || 0);
        sessionStorage.setItem(lastKey, String(last));
        // 레이어를 열면 알림 숫자를 초기화합니다
        return fetch(cfg.read_all, { method: 'POST', credentials: 'same-origin', headers: { 'X-CSRF-Token': csrf(), 'X-Requested-With': 'XMLHttpRequest' } });
      }).then(function () { setCount(0); }).catch(function () { });
    };

    poll();
    setInterval(poll, Math.max(10, cfg.poll || 30) * 1000);
    D.addEventListener('visibilitychange', function () { if (!D.hidden) poll(); });
  }
  function kindIcon(k) { return { assigned: 'user', mention: 'at', status: 'swap', comment: 'chat', due: 'clock' }[k] || 'bell'; }
  function kindText(it) {
    var a = it.actor ? splitName(it.actor)[0] : '';
    switch (it.kind) {
      case 'assigned': return t('kAssigned')(a);
      case 'mention': return t('kMention')(a);
      case 'status': return t('kStatus')(a, it.info);
      case 'comment': return t('kComment')(a);
      case 'due': return t('kDue')(a, it.info, dueWhen(it.info));
      default: return t('notifications');
    }
  }
  function dueWhen(d) {
    if (!d) return t('today');
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var due = new Date(d + 'T00:00:00');
    return Math.round((due - today) / 86400000) <= 0 ? t('today') : t('tomorrow');
  }
  function ago(iso) {
    var s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    return t('ago')(Math.floor(s));
  }
})();
