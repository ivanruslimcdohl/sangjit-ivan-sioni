/* =============================================================
   Sangjit Invitation — Ivan × Sioni — 11 July 2026
   ============================================================= */

(() => {
  'use strict';

  // ---------- Config ----------
  const EVENT_DATE = new Date('2026-07-11T10:00:00+07:00');
  const DEFAULT_LANG = 'id';
  const DEFAULT_GUEST = {
    id: 'Bapak / Ibu / Saudara / i',
    en: 'Our Honoured Guest',
  };

  // ---------- Language toggle ----------
  function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.body.classList.remove('lang-id', 'lang-en');
    document.body.classList.add(`lang-${lang}`);

    const attr = `data-${lang}`;
    document.querySelectorAll(`[data-id][data-en]`).forEach((el) => {
      const val = el.getAttribute(attr);
      if (val == null) return;
      if (el.tagName === 'META') {
        el.setAttribute('content', val.replace(/&amp;/g, '&'));
      } else {
        el.innerHTML = val;
      }
    });

    const langLabel = document.getElementById('langLabel');
    if (langLabel) langLabel.textContent = lang === 'id' ? 'EN' : 'ID';

    // Re-evaluate guest name default in case no ?to= was supplied
    refreshGuestNameIfDefault();

    try { localStorage.setItem('lang', lang); } catch (_) { /* ignore */ }
  }

  function initLanguage() {
    let saved = DEFAULT_LANG;
    try { saved = localStorage.getItem('lang') || DEFAULT_LANG; } catch (_) { /* ignore */ }
    applyLanguage(saved);

    const btn = document.getElementById('langToggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const current = document.body.classList.contains('lang-en') ? 'en' : 'id';
        applyLanguage(current === 'id' ? 'en' : 'id');
      });
    }
  }

  // ---------- Guest name from ?to= ----------
  let hasCustomGuest = false;

  function initGuestName() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('to');
    const el = document.getElementById('guestName');
    if (!el) return;
    if (raw && raw.trim()) {
      el.textContent = raw.trim(); // XSS-safe: textContent, not innerHTML
      hasCustomGuest = true;
    } else {
      hasCustomGuest = false;
      refreshGuestNameIfDefault();
    }
  }

  function refreshGuestNameIfDefault() {
    if (hasCustomGuest) return;
    const el = document.getElementById('guestName');
    if (!el) return;
    const lang = document.body.classList.contains('lang-en') ? 'en' : 'id';
    el.textContent = DEFAULT_GUEST[lang];
  }

  // ---------- Countdown ----------
  function pad2(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const now = new Date();
    const diff = EVENT_DATE - now;

    const $d = document.getElementById('cd-days');
    const $h = document.getElementById('cd-hours');
    const $m = document.getElementById('cd-minutes');
    const $s = document.getElementById('cd-seconds');
    if (!$d || !$h || !$m || !$s) return;

    if (diff <= 0) {
      $d.textContent = '00';
      $h.textContent = '00';
      $m.textContent = '00';
      $s.textContent = '00';
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    $d.textContent = pad2(days);
    $h.textContent = pad2(hours);
    $m.textContent = pad2(minutes);
    $s.textContent = pad2(seconds);
  }

  function initCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ---------- Music toggle ----------
  function initMusic() {
    const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('musicToggle');
    if (!audio || !btn) return;

    audio.volume = 0.45;
    let playing = false;

    function syncIcon() {
      btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      const use = btn.querySelector('use');
      if (use) use.setAttribute('href', playing ? '#icon-music-on' : '#icon-music-off');
    }

    function play() {
      const p = audio.play();
      if (p && typeof p.then === 'function') {
        p.then(() => { playing = true; syncIcon(); })
         .catch(() => { playing = false; syncIcon(); });
      } else {
        playing = true; syncIcon();
      }
    }

    function pause() {
      audio.pause();
      playing = false;
      syncIcon();
    }

    btn.addEventListener('click', () => {
      if (playing) pause(); else play();
    });

    // Expose a way for the cover-open gesture to start music (the first
    // user gesture on mobile). We don't autoplay; we only start if the
    // browser's autoplay policy allows it after a click.
    window.__tryStartMusic = () => { if (!playing) play(); };
  }

  // ---------- Opening cover ----------
  function initCover() {
    const btn = document.getElementById('openInviteBtn');
    const cover = document.getElementById('cover');
    const main = document.getElementById('main');
    if (!btn || !cover || !main) return;

    btn.addEventListener('click', () => {
      // This click is a user gesture; safe to attempt audio playback.
      if (typeof window.__tryStartMusic === 'function') {
        window.__tryStartMusic();
      }

      document.body.classList.remove('cover-locked');
      main.setAttribute('aria-hidden', 'false');
      // After transition, fully remove from a11y tree
      setTimeout(() => {
        cover.setAttribute('aria-hidden', 'true');
        cover.style.visibility = 'hidden';
      }, 1000);

      // Refresh AOS so it re-evaluates with scrollable document
      if (window.AOS && typeof window.AOS.refresh === 'function') {
        setTimeout(() => window.AOS.refresh(), 500);
      }
    }, { once: true });
  }

  // ---------- AOS ----------
  function initAOS() {
    if (!window.AOS) return;
    window.AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  }

  // ---------- Boot ----------
  document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initGuestName();
    initCountdown();
    initMusic();
    initCover();
    initAOS();
  });
})();
