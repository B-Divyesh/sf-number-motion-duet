import './style.css';

type Motion = 'claps' | 'steps';
type Round = { count: number; motion: Motion };
type Session = { motion: Motion; count: number; rounds: Round[]; confirmed: boolean };

const app = document.querySelector<HTMLDivElement>('#app')!;
const titles: Record<string, string> = {
  '/': 'Number Motion Duet — Move together to learn numbers',
  '/demo': 'Demo — Number Motion Duet',
  '/game': 'Play — Number Motion Duet',
  '/privacy': 'Privacy — Number Motion Duet',
  '/terms': 'Terms — Number Motion Duet'
};
let online = navigator.onLine;
let status = '';

function isDemo() { return location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1'; }
function key() { return isDemo() ? 'demo:number-motion-duet:session' : 'number-motion-duet:session'; }
function sampleSession(): Session { return { motion: 'claps', count: 4, rounds: [{ count: 2, motion: 'claps' }, { count: 3, motion: 'steps' }], confirmed: false }; }
function readSession(): Session {
  try { const saved = localStorage.getItem(key()); return saved ? JSON.parse(saved) as Session : sampleSession(); }
  catch { status = 'Your browser could not save the game. You can still play this round.'; return sampleSession(); }
}
function saveSession(value: Session) { try { localStorage.setItem(key(), JSON.stringify(value)); } catch { status = 'Your browser could not save the game. You can still play this round.'; } }
function escapeHtml(value: string) { return value.replace(/[&<>"]/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[character]!)); }
function nav(path: string) { history.pushState({}, '', path); render(true); }
function active(path: string) { return location.pathname === path ? ' aria-current="page"' : ''; }
function layout(content: string) {
  return `<a class="skip" href="#main">Skip to the game</a>
  <header class="shell site-header"><a class="wordmark" href="/" data-link><span class="mark" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>Number Motion Duet</a>
  <nav class="nav" aria-label="Main navigation"><a href="/demo" data-link${active('/demo')}>Demo</a><a href="/game" data-link${active('/game')}>Play</a><a href="/privacy" data-link${active('/privacy')}>Privacy</a></nav></header>
  <main id="main" class="shell" tabindex="-1">${content}</main>
  <footer class="shell site-footer"><span>A shared clap or step game for preschool number play.</span><span class="footer-links"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a><span>v1.0.0</span></span></footer>
  <div class="sr-only" aria-live="polite" aria-atomic="true" id="route-announcement"></div>`;
}
function landing() {
  return `<section class="hero" aria-labelledby="home-title"><div><p class="eyebrow">A shared table game</p><h1 id="home-title">Make number play a shared movement game</h1><p class="lead">For caregivers and preschoolers who want numbers to involve both bodies.</p><div class="actions"><a class="button primary" href="/demo" data-link>Try it with sample data</a><span class="action-note">Starts a ready-made clap round.</span></div><ul class="facts"><li>Play without an account.</li><li>Use touch or keyboard.</li><li>Free to play.</li></ul></div><img class="hero-art" src="/assets/notebook-hero.webp" width="1200" height="800" fetchpriority="high" decoding="async" alt="An open notebook with wooden circle, triangle, square, star, and heart counting pieces." /></section>
  <section class="section" aria-labelledby="how-title"><p class="eyebrow">Take turns</p><h2 id="how-title">Make one number a whole-body idea</h2><div class="steps"><article class="step"><span class="step-number">1</span><h3>Choose the motion</h3><p>The adult picks claps or steps before the round.</p></article><article class="step"><span class="step-number">2</span><h3>Call the number</h3><p>The adult taps a number and says it aloud.</p></article><article class="step"><span class="step-number">3</span><h3>Make the marks</h3><p>The child moves. Both see one shape for each motion.</p></article></div></section>
  <section class="section plain-note" aria-labelledby="privacy-note"><span aria-hidden="true">✦</span><div><h2 id="privacy-note">A game, not a drill app</h2><p>There are no videos, ads, accounts, cameras, or online scores. The adult stays part of the loop.</p><p><a href="/game" data-link>Start a new game without sample rounds.</a></p></div></section>`;
}
function demoBanner() { return `<aside class="demo-banner" aria-label="Demo controls"><span><strong>Demo</strong> — sample data, nothing is saved to your game.</span><span><button class="text-button" type="button" data-action="reset-demo">Reset demo</button><button class="text-button" type="button" data-action="start-real">Start for real</button></span></aside>`; }
function shapes(count: number) { return Array.from({ length: count }, (_, index) => `<span class="shape" aria-hidden="true">${index + 1}</span>`).join(''); }
function game() {
  const session = readSession();
  const completed = session.rounds.length;
  const noun = session.motion === 'claps' ? 'claps' : 'steps';
  return `${isDemo() ? demoBanner() : ''}${!online ? '<p class="offline" role="status">Offline. This game still works here.</p>' : ''}
  <div class="game-layout"><section class="game-sheet" aria-labelledby="game-title"><div class="game-header"><div><p class="eyebrow">Adult calls · child moves</p><h1 id="game-title">Call a number. Move together.</h1></div><span class="round-count">${completed} round${completed === 1 ? '' : 's'} marked</span></div>
  <div class="motion-picker"><span class="field-label">Adult: choose the motion</span><div class="motion-options" role="group" aria-label="Choose the motion"><button class="choice" type="button" data-motion="claps" aria-pressed="${session.motion === 'claps'}">👏 Claps</button><button class="choice" type="button" data-motion="steps" aria-pressed="${session.motion === 'steps'}">👣 Steps</button></div></div>
  <div class="call-area"><p class="note-label">Adult: tap a number, then call it aloud</p><p class="call-title">Call ${session.count} ${noun}</p><div class="quantity-grid" role="group" aria-label="Choose a number to call">${Array.from({length:10}, (_, index) => { const number=index+1; return `<button class="quantity" type="button" data-count="${number}" aria-pressed="${session.count === number}">${number}</button>`; }).join('')}</div></div>
  <div class="response"><p class="note-label">Child: move, then tap together</p><button class="button ink" type="button" data-action="confirm">We did ${session.count} ${noun}</button>${session.confirmed ? `<div class="shape-strip" role="img" aria-label="${session.count} shape marks">${shapes(session.count)}</div><p class="confirmation">✓ ${session.count} ${noun} marked with shapes.</p><p><button class="button" type="button" data-action="next">Call another number</button></p>` : '<p class="help">Use claps or steps. The shapes give a second way to see the amount.</p>'}</div>
  <p class="status${status ? ' error' : ''}" role="status">${escapeHtml(status)}</p></section>
  <aside class="round-log" aria-labelledby="rounds-title"><h2 id="rounds-title">Today’s marks</h2>${session.rounds.length ? `<ol>${session.rounds.slice(-8).reverse().map((round) => `<li><span class="log-shape">${round.count} ${round.motion}</span></li>`).join('')}</ol>` : '<p class="empty">Completed rounds will appear here.</p>'}<p class="help">The shape marks show quantity without asking the child to read.</p></aside></div>`;
}
function legal(kind: 'privacy' | 'terms') {
  const privacy = kind === 'privacy';
  return `<article class="legal"><p class="eyebrow">Number Motion Duet</p><h1>${privacy ? 'Your game stays on this device' : 'Simple terms for a free game'}</h1>${privacy ? `<h2>What this site stores</h2><p>Your completed rounds stay in this browser. The demo uses a separate browser storage area.</p><h2>What this site does not collect</h2><p>We do not ask for names, email addresses, photos, locations, or child details.</p><h2>Network use</h2><p>The game does not send your round history anywhere. Your browser may request this site’s files to load the page.</p><h2>Delete your rounds</h2><p>Clear this site’s browser data to remove saved rounds. Reset demo only removes sample rounds.</p>` : `<h2>Use with an adult</h2><p>This free activity is for caregivers and children to use together. Please make movement choices that fit your space.</p><h2>No promises about learning</h2><p>The game is a practice activity. It does not assess a child or replace professional advice.</p><h2>Service changes</h2><p>We may improve or stop this free site. These terms do not give either side extra rights.</p><h2>Contact</h2><p>Questions about the product can be sent to the Param Factory.</p>`}</article>`;
}
function notFound() { return `<section class="not-found"><p class="eyebrow">Page not found</p><h1>That page has wandered off.</h1><p>Try the shared number game from the beginning.</p><a class="button primary" href="/" data-link>Go to the home page</a></section>`; }
function page() { const path = location.pathname; if (isDemo()) return game(); if (path === '/') return landing(); if (path === '/game') return game(); if (path === '/privacy') return legal('privacy'); if (path === '/terms') return legal('terms'); return notFound(); }
function routeName() { if (isDemo()) return 'Demo game'; if (location.pathname === '/game') return 'Game'; if (location.pathname === '/privacy') return 'Privacy'; if (location.pathname === '/terms') return 'Terms'; if (location.pathname === '/') return 'Home'; return 'Page not found'; }
function render(announce = false) {
  status = '';
  document.title = isDemo() ? titles['/demo'] : titles[location.pathname] || 'Page not found — Number Motion Duet';
  app.innerHTML = layout(page());
  app.querySelectorAll<HTMLAnchorElement>('[data-link]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); nav(link.pathname); }));
  app.querySelectorAll<HTMLButtonElement>('[data-motion]').forEach((button) => button.addEventListener('click', () => { const session = readSession(); session.motion = button.dataset.motion as Motion; session.confirmed = false; saveSession(session); render(); }));
  app.querySelectorAll<HTMLButtonElement>('[data-count]').forEach((button) => button.addEventListener('click', () => { const session = readSession(); session.count = Number(button.dataset.count); session.confirmed = false; saveSession(session); render(); }));
  app.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((button) => button.addEventListener('click', () => action(button.dataset.action!)));
  if (announce) requestAnimationFrame(() => { const heading = app.querySelector<HTMLElement>('h1'); heading?.setAttribute('tabindex', '-1'); heading?.focus({ preventScroll: true }); const live = app.querySelector('#route-announcement'); if (live) live.textContent = `${routeName()} loaded`; });
}
function action(name: string) {
  if (name === 'reset-demo') { localStorage.removeItem('demo:number-motion-duet:session'); render(); return; }
  if (name === 'start-real') { localStorage.removeItem('demo:number-motion-duet:session'); nav('/game'); return; }
  const session = readSession();
  if (name === 'confirm' && !session.confirmed) { session.rounds.push({ count: session.count, motion: session.motion }); session.confirmed = true; saveSession(session); render(); return; }
  if (name === 'next') { session.count = (session.count % 10) + 1; session.confirmed = false; saveSession(session); render(); }
}
window.addEventListener('popstate', () => render(true));
window.addEventListener('online', () => { online = true; render(); });
window.addEventListener('offline', () => { online = false; render(); });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => { /* Offline support is optional if registration fails. */ });
render();
