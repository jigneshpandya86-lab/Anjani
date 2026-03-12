/* ═══════════════════════════════════════════════════
   ANJANI WATER — SHARED SITE CONFIG
   GitHub repo: jigneshpandya86-lab/Anjani
   All images live in /images/ folder of that repo
   Raw URL base: https://raw.githubusercontent.com/jigneshpandya86-lab/Anjani/main/images/
═══════════════════════════════════════════════════ */

var SITE = {

  /* ── Google Sheet endpoint ── */
  SHEET_URL: 'https://script.google.com/macros/s/AKfycbz_w5sjcT2gXwl8ZqWizHtkpeJ9I9AXkB3fEfJVXAdjmaiLRTTeqAO-ekkXxU0I1PD9-g/exec',

  /* ── GitHub raw image base ── */
  IMG: 'https://raw.githubusercontent.com/jigneshpandya86-lab/Anjani/main/Images/',

  /* ── Image filenames (upload these to /images/ in your repo) ── */
  images: {
    /* Product shots */
    hero:    'anjani-hero.png',          // Hero / OG image (Anjani bottle glamour shot)
    anjani:  'anjani-200ml.png',         // Anjani 200ml product
    bisleri: 'bisleri-bottle.jpg',       // Bisleri bottle
    bailley: 'bailley-bottle.png',       // Bailley bottle
    clear:   'clear-bottle.jpg',         // Clear bottle

    /* Recent-update reference images (used in updates.json & Updates page) */
    update1: 'update-summer-offer.jpg',  // e.g. Summer bulk deal banner
    update2: 'update-new-stock.jpg',     // e.g. Fresh stock arrival photo
    update3: 'update-wedding-supply.jpg',// e.g. Wedding event supply photo
    update4: 'update-office-delivery.jpg'// e.g. Office delivery photo
  },

  /* ── Contact ── */
  phone:    '9925997750',
  wa:       'https://wa.me/919925997750?text=Hi%20Anjani%20Water!%20I%20would%20like%20to%20place%20an%20order.',
  email:    'annapurnafoods27@gmail.com',

  /* ── Navigation (used to build <nav> on every page) ── */
  nav: [
    { label: 'Home',        href: 'index.html'    },
    { label: 'Products',    href: 'products.html' },
    { label: 'Updates',     href: 'updates.html'  },
    { label: 'Who We Serve',href: 'serve.html'    },
    { label: 'Why Us',      href: 'why.html'      },
    { label: 'Contact',     href: 'contact.html'  }
  ]
};

/* ── Helper: full image URL ── */
SITE.img = function(key) {
  return SITE.IMG + (SITE.images[key] || key);
};

/* ── Inject <nav> into #navbar ── */
SITE.buildNav = function(activePage) {
  var el = document.getElementById('navbar');
  if (!el) return;
  var links = SITE.nav.map(function(n) {
    var active = (n.href === activePage) ? ' active' : '';
    return '<li><a href="' + n.href + '" class="nav-link' + active + '">' + n.label + '</a></li>';
  }).join('');
  el.innerHTML =
    '<a href="index.html" class="nav-logo">Anjani<span>Water</span></a>' +
    '<ul class="nav-links" id="navLinks">' + links +
    '<li><a href="contact.html" class="nav-cta">Order Now</a></li></ul>' +
    '<div class="hamburger" id="hamburger" onclick="SITE.toggleMenu()"><span></span><span></span><span></span></div>';
};

/* ── Nav interactions ── */
SITE.toggleMenu = function() {
  var nav = document.getElementById('navLinks'), ham = document.getElementById('hamburger');
  var open = nav.classList.toggle('open');
  ham.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
};
SITE.closeMenu = function() {
  var nav = document.getElementById('navLinks'), ham = document.getElementById('hamburger');
  if (nav) nav.classList.remove('open');
  if (ham) ham.classList.remove('open');
  document.body.style.overflow = '';
};

/* ── Scroll shrink nav ── */
window.addEventListener('scroll', function() {
  var nb = document.getElementById('navbar');
  if (nb) nb.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── Close menu on outside click ── */
document.addEventListener('click', function(e) {
  var nav = document.getElementById('navLinks'), ham = document.getElementById('hamburger');
  if (nav && nav.classList.contains('open') && !nav.contains(e.target) && ham && !ham.contains(e.target))
    SITE.closeMenu();
});

/* ── Reveal on scroll ── */
SITE.initReveal = function() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
};

/* ── Google Sheet submit ── */
SITE.sendToSheet = async function(data) {
  if (!SITE.SHEET_URL) return;
  try {
    await fetch(SITE.SHEET_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch(e) { console.log('Sheet error:', e); }
};

SITE.submitForm = function(e, formId, successId, type) {
  e.preventDefault();
  var form = document.getElementById(formId), data = { type: type };
  new FormData(form).forEach(function(v, k) { data[k] = v; });
  SITE.sendToSheet(data);
  form.reset();
  var msg = document.getElementById(successId);
  msg.classList.add('show');
  setTimeout(function() { msg.classList.remove('show'); }, 5000);
};

/* ── Visitor tracking ── */
SITE.trackVisitor = async function() {
  if (!SITE.SHEET_URL) return;
  var ua = navigator.userAgent;
  var device = /mobile|android|iphone/i.test(ua) ? 'Mobile' : /tablet|ipad/i.test(ua) ? 'Tablet' : 'Desktop';
  var browser = ua.includes('Firefox') ? 'Firefox' : ua.includes('Edg') ? 'Edge' :
    (ua.includes('Chrome') && !ua.includes('Edg')) ? 'Chrome' :
    (ua.includes('Safari') && !ua.includes('Chrome')) ? 'Safari' : 'Other';
  var loc = {};
  try { loc = await (await fetch('https://ipapi.co/json/')).json(); } catch(e) {}
  SITE.sendToSheet({
    type: 'visitor', page: document.title, referrer: document.referrer || 'Direct',
    device, browser, screenSize: window.screen.width + 'x' + window.screen.height,
    language: navigator.language, city: loc.city || '', region: loc.region || '',
    country: loc.country_name || '', ip: loc.ip || '', sessionId: 'sid_' + Date.now()
  });
};

/* ── Welcome popup ── */
SITE.openWelcome  = function() { document.getElementById('welcomeModal').classList.add('open'); };
SITE.closeWelcome = function() {
  document.getElementById('welcomeModal').classList.remove('open');
  sessionStorage.setItem('wSeen', '1');
};
SITE.submitWelcome = function(e) {
  e.preventDefault();
  var name = document.getElementById('wName').value;
  var phone = document.getElementById('wPhone').value;
  if (!phone) return;
  SITE.sendToSheet({ type: 'welcome', name: name, phone: phone });
  document.getElementById('welcomeSuccess').classList.add('show');
  setTimeout(function() { SITE.closeWelcome(); }, 2500);
};

/* ── FAQ toggle ── */
SITE.toggleFaq = function(btn) {
  var item = btn.closest('.faq-item');
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(i) { i.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
};

/* ── WhatsApp float injection ── */
SITE.injectWA = function() {
  var div = document.createElement('a');
  div.className = 'wa-float';
  div.href = SITE.wa;
  div.target = '_blank';
  div.setAttribute('aria-label', 'WhatsApp');
  div.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.104 1.523 5.827L0 24l6.335-1.505A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.01-1.371l-.36-.214-3.732.886.914-3.641-.234-.373A9.818 9.818 0 0112 2.182c5.427 0 9.818 4.391 9.818 9.818 0 5.428-4.391 9.818-9.818 9.818z"/></svg><span class="wa-tooltip">Order on WhatsApp</span>';
  document.body.appendChild(div);
};

/* ── Shared footer injection ── */
SITE.injectFooter = function() {
  var el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = '<div class="footer-grid"><div class="footer-brand"><a href="index.html" class="nav-logo">Anjani<span>Water</span></a><p>Vadodara\'s trusted bulk water bottle supplier — packaged drinking water for weddings, party plots, catering and offices. BIS certified.</p><div class="footer-social"><a href="' + SITE.wa + '" class="social-btn">💬</a><a href="tel:91' + SITE.phone + '" class="social-btn">📞</a><a href="mailto:' + SITE.email + '" class="social-btn">✉</a></div></div><div><h4>Products</h4><ul><li><a href="products.html">Anjani 200ml</a></li><li><a href="products.html">Bisleri</a></li><li><a href="products.html">Bailley</a></li><li><a href="products.html">Clear Water</a></li></ul></div><div><h4>Quick Links</h4><ul><li><a href="updates.html">Latest Updates</a></li><li><a href="contact.html">Place an Order</a></li><li><a href="contact.html#sample">Free Sample</a></li><li><a href="serve.html">Who We Serve</a></li><li><a href="contact.html#faq">FAQ</a></li></ul></div><div><h4>Contact</h4><ul><li><a href="tel:91' + SITE.phone + '">' + SITE.phone + '</a></li><li><a href="' + SITE.wa + '">WhatsApp Us</a></li><li><a href="mailto:' + SITE.email + '">' + SITE.email + '</a></li><li>Vadodara, Gujarat</li></ul></div></div><div class="footer-bottom"><span>© 2025 Anjani Premium Water by Annapurna Foods. All rights reserved.</span><span>Made with 💧 for Vadodara</span></div>';
};

/* ── Welcome popup HTML injection ── */
SITE.injectWelcomePopup = function() {
  var div = document.createElement('div');
  div.className = 'welcome-overlay';
  div.id = 'welcomeModal';
  div.onclick = function(e) { if (e.target === this) SITE.closeWelcome(); };
  div.innerHTML = '<div class="welcome-popup"><button class="welcome-close" onclick="SITE.closeWelcome()">✕</button><div class="welcome-popup-top"><span class="wp-emoji">💧</span><h3>Get a Free Water Sample!</h3><p>Leave your number and we\'ll deliver a complimentary Anjani 200ml bottle — no cost, no commitment.</p></div><div class="welcome-popup-body"><form onsubmit="SITE.submitWelcome(event)"><div class="form-group"><label>Your Name</label><input type="text" id="wName" placeholder="Ramesh Patel"></div><div class="form-group"><label>Phone / WhatsApp *</label><input type="tel" id="wPhone" placeholder="98765 43210" required></div><button type="submit" class="welcome-popup-submit">🎁 Claim Free Sample</button><div class="welcome-success" id="welcomeSuccess">✅ Done! We\'ll be in touch soon.</div></form><span class="welcome-skip" onclick="SITE.closeWelcome()">No thanks, maybe later</span></div></div>';
  document.body.appendChild(div);
};

/* ── Page init (call at bottom of every page) ── */
SITE.init = function(activePage) {
  SITE.buildNav(activePage);
  SITE.injectFooter();
  SITE.injectWA();
  SITE.injectWelcomePopup();
  SITE.initReveal();
  window.addEventListener('load', function() {
    SITE.trackVisitor();
    if (!sessionStorage.getItem('wSeen')) setTimeout(SITE.openWelcome, 4000);
  });
};
