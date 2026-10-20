(() => {
  'use strict';
  const BOOKS = Object.freeze({
    'moonlit-garden-rooms': { title: 'Moonlit Garden Rooms', sample: 'fiberlune2-moonlit-garden-rooms-sample.pdf' },
    'cozy-crochet-knitting': { title: 'A Cozy Crochet & Knitting Coloring Book', sample: 'fiberlune-crochet-knitting-sample.pdf' },
    'cozy-ocean-life': { title: 'Cozy Ocean Life', sample: 'cozy-ocean-life-sample.pdf' }
  });
  function classifyInteraction(bookId, href, download) {
    const book = BOOKS[bookId];
    if (!book) return null;
    let url;
    try { url = new URL(href, 'https://bledboli856-lab.github.io/fiberlune/'); } catch (_) { return null; }
    const params = { book_id: bookId, book_title: book.title };
    if (download && url.origin === 'https://bledboli856-lab.github.io' &&
        url.pathname === '/fiberlune/' + book.sample) {
      return { name: 'sample_download', params: { ...params, destination_platform: 'website', file_name: book.sample, file_extension: 'pdf' } };
    }
    const platforms = {
      'www.amazon.com': 'amazon', 'amazon.com': 'amazon',
      'www.etsy.com': 'etsy', 'etsy.com': 'etsy',
      'apple.co': 'apple_books', 'books.apple.com': 'apple_books',
      'play.google.com': 'google_play_books'
    };
    const platform = platforms[url.hostname];
    if (download || url.protocol !== 'https:' || !platform) return null;
    return { name: 'purchase_link_click', params: { ...params, destination_platform: platform, link_domain: url.hostname } };
  }
  function safeLocation(href) {
    const url = new URL(href);
    const clean = new URL(url.origin + url.pathname);
    // Only non-personal campaign codes. Never put personal data in campaign names.
    ['utm_source','utm_medium','utm_campaign','utm_id','utm_content','utm_term'].forEach(key => {
      const value = url.searchParams.get(key);
      if (value && /^[a-z0-9][a-z0-9_-]{0,79}$/i.test(value)) clean.searchParams.set(key, value);
    });
    return clean.href;
  }
  function validPreference(raw, now) {
    try {
      const value = JSON.parse(raw);
      if (value.version === 1 && ['granted','denied'].includes(value.choice) &&
          Number.isFinite(value.expires) && value.expires > now &&
          value.expires <= now + 180 * 86400000 + 1000) return value;
    } catch (_) { /* Missing, expired or corrupt preference means no consent. */ }
    return null;
  }
  /* TESTABLE HELPERS END */
  const config = window.FIBERLUNE_ANALYTICS_CONFIG || {};
  if (config.enabled !== true || !/^G-[A-Z0-9]{6,20}$/.test(config.measurementId || '') ||
      config.enhancedMeasurementDisabled !== true || config.privacyNoticeApproved !== true ||
      !config.privacyNoticeUrl) return;
  let privacyUrl;
  try { privacyUrl = new URL(config.privacyNoticeUrl, location.href); } catch (_) { return; }
  if (privacyUrl.origin !== location.origin || privacyUrl.protocol !== 'https:') return;
  if (window.__fiberluneAnalyticsInstalled) return;
  window.__fiberluneAnalyticsInstalled = true;

  const id = config.measurementId;
  const key = 'fiberlune-analytics-consent-v1';
  const disabledKey = 'ga-disable-' + id;
  const denied = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  let preference = null;
  try { preference = validPreference(localStorage.getItem(key), Date.now()); } catch (_) {}
  let started = false;
  let observer;
  const timers = new Map();
  const viewed = new Set();
  const hasConsent = () => preference?.choice === 'granted' && preference.expires > Date.now();
  window[disabledKey] = !hasConsent();

  function remember(choice) {
    preference = { version: 1, choice, expires: Date.now() + 180 * 86400000 };
    try { localStorage.setItem(key, JSON.stringify(preference)); } catch (_) { /* Session-only choice. */ }
  }
  function clearCookies() {
    // Only our host-only cookie namespace; do not touch another site's cookies.
    document.cookie.split(';').map(part => part.trim().split('=')[0]).filter(name => /^fiberlune_ga(?:_|$)/.test(name)).forEach(name => {
      ['/', '/fiberlune/'].forEach(path => { document.cookie = name + '=; Max-Age=0; Path=' + path + '; SameSite=Lax; Secure'; });
    });
  }
  function stop() {
    window[disabledKey] = true;
    observer?.disconnect();
    timers.forEach(clearTimeout);
    timers.clear();
    clearCookies();
    // Unload an already running tag. The persisted denial prevents it on reload.
    if (started) location.reload();
  }
  function emit(name, parameters = {}) {
    if (!started || !hasConsent() || window[disabledKey]) return;
    window.gtag('event', name, {
      send_to: id, page_location: safeLocation(location.href),
      page_title: 'FIBERLUNE | Cozy Coloring Books & Free PDF Samples',
      language: document.documentElement.lang === 'sq' ? 'sq' : 'en',
      ...parameters
    });
  }
  function watchBooks() {
    if (!('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const bookId = entry.target.id;
        if (!BOOKS[bookId] || viewed.has(bookId)) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          if (!timers.has(bookId)) timers.set(bookId, setTimeout(() => {
            timers.delete(bookId);
            if (!hasConsent() || document.visibilityState !== 'visible') return;
            viewed.add(bookId);
            emit('book_view', { book_id: bookId, book_title: BOOKS[bookId].title });
            observer.unobserve(entry.target);
          }, 1000));
        } else {
          clearTimeout(timers.get(bookId));
          timers.delete(bookId);
        }
      });
    }, { threshold: [0, 0.25] });
    document.querySelectorAll('article.book').forEach(book => observer.observe(book));
  }
  function start() {
    if (started || !hasConsent()) return;
    started = true;
    window[disabledKey] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', denied);
    window.gtag('consent', 'update', { ...denied, analytics_storage: 'granted' });
    window.gtag('js', new Date());
    let referrer = '';
    try { referrer = document.referrer ? new URL(document.referrer).origin + '/' : ''; } catch (_) {}
    const settings = {
      send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_domain: 'none', cookie_prefix: 'fiberlune', cookie_expires: 180 * 86400,
      cookie_flags: 'SameSite=Lax;Secure',
      page_location: safeLocation(location.href), page_referrer: referrer,
      page_title: 'FIBERLUNE | Cozy Coloring Books & Free PDF Samples'
    };
    try { if (sessionStorage.getItem('fiberlune-ga-debug') === '1') settings.debug_mode = true; } catch (_) {}
    window.gtag('config', id, settings);
    emit('page_view'); // Exactly once per consented document load.
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.append(tag); // First Google request, only after affirmative consent.
    watchBooks();
  }

  function onActivation(event) {
    if (!event.isTrusted || event.defaultPrevented || !hasConsent()) return;
    if ((event.type === 'click' && event.button !== 0) || (event.type === 'auxclick' && event.button !== 1)) return;
    const anchor = event.target.closest?.('a');
    const book = anchor?.closest('article.book');
    if (!book || (!anchor.matches('.purchase-options a') && !anchor.hasAttribute('download'))) return;
    const interaction = classifyInteraction(book.id, anchor.href, anchor.hasAttribute('download'));
    if (interaction) emit(interaction.name, interaction.params);
  }
  // One delegated listener per activation type; never listen to pointerdown as well.
  document.addEventListener('click', onActivation);
  document.addEventListener('auxclick', onActivation);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') {
      timers.forEach(clearTimeout); timers.clear();
    } else if (preference && !hasConsent() && preference.choice === 'granted') {
      remember('denied'); stop();
    } else if (started && hasConsent()) {
      observer?.disconnect(); watchBooks();
    }
  });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    try { preference = validPreference(localStorage.getItem(key), Date.now()); } catch (_) { preference = null; }
    if (!hasConsent()) { panel.hidden = !!preference; stop(); }
    // A grant in another tab is used on the next load, avoiding surprise startup.
  });

  const words = {
    en: {
      title:'Optional analytics',
      body:'With your permission, FIBERLUNE uses Google Analytics cookies to measure visits, traffic sources, book views, sample-download clicks and retailer-link clicks. Google processes this usage data. Advertising features are off. You can reject analytics and still use every book link and sample, or withdraw later through Analytics settings.',
      accept:'Accept analytics', reject:'Reject analytics', privacy:'Privacy notice', settings:'Analytics settings'
    },
    sq: {
      title:'Analitika opsionale',
      body:'Me lejen tënde, FIBERLUNE përdor cookies të Google Analytics për të matur vizitat, burimet e trafikut, shikimet e librave dhe klikimet te mostrat e te shitësit. Google përpunon këto të dhëna përdorimi. Funksionet e reklamave janë të çaktivizuara. Mund ta refuzosh analitikën dhe t’i përdorësh të gjitha lidhjet e mostrat, ose ta tërheqësh lejen te Cilësimet e analitikës.',
      accept:'Prano analitikën', reject:'Refuzo analitikën', privacy:'Njoftimi i privatësisë', settings:'Cilësimet e analitikës'
    }
  };
  const style = document.createElement('style');
  style.textContent = '.fl-consent{position:fixed;z-index:100;bottom:16px;left:16px;right:16px;max-width:680px;margin:auto;padding:20px;background:var(--paper,#fcfaf5);color:var(--ink,#322b37);border:1px solid var(--line,#dcd3df);box-shadow:0 4px 24px #322b3722;font:13px/1.6 Arial,sans-serif;max-height:80vh;overflow:auto}.fl-consent h2{font:24px Georgia,serif;margin:0 0 10px}.fl-consent p{margin:0 0 12px}.fl-consent-actions{display:flex;flex-wrap:wrap;gap:10px;align-items:center}.fl-consent-actions button{flex:1 1 150px;background:var(--plum,#503b61);color:var(--paper,#fcfaf5);border:1px solid var(--plum,#503b61);min-height:44px;padding:10px;cursor:pointer;font:inherit}.fl-consent a,.fl-consent-settings{text-decoration:underline;text-underline-offset:3px}.fl-consent-settings{background:transparent;border:0;color:inherit;cursor:pointer;font:inherit;min-height:44px;padding:8px}.fl-consent[hidden]{display:none}';
  document.head.append(style);
  const panel = document.createElement('aside');
  panel.className = 'fl-consent';
  panel.setAttribute('aria-labelledby','fl-consent-title');
  const title = document.createElement('h2'); title.id = 'fl-consent-title';
  const body = document.createElement('p');
  const actions = document.createElement('div'); actions.className = 'fl-consent-actions';
  const accept = document.createElement('button'); accept.type = 'button';
  const reject = document.createElement('button'); reject.type = 'button';
  const privacy = document.createElement('a'); privacy.href = privacyUrl.href;
  const settingsButton = document.createElement('button'); settingsButton.type = 'button'; settingsButton.className = 'fl-consent-settings';
  actions.append(reject, accept);
  panel.append(title, body, privacy, actions);
  document.body.append(panel);
  (document.querySelector('.footer-bottom') || document.body).append(settingsButton);
  function renderText() {
    const text = words[document.documentElement.lang] || words.en;
    title.textContent = text.title; body.textContent = text.body;
    accept.textContent = text.accept; reject.textContent = text.reject;
    privacy.textContent = text.privacy; settingsButton.textContent = text.settings;
  }
  renderText();
  new MutationObserver(renderText).observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });
  panel.hidden = !!preference;
  settingsButton.addEventListener('click', () => { panel.hidden = false; reject.focus(); });
  accept.addEventListener('click', () => { remember('granted'); panel.hidden = true; settingsButton.focus(); start(); });
  reject.addEventListener('click', () => { remember('denied'); panel.hidden = true; settingsButton.focus(); stop(); });
  if (hasConsent()) start();
})();
