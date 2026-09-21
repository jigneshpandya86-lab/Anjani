/* ═══════════════════════════════════════════════════
   ANJANI WATER — CORE SITE CONTROLLER & CONFIG
   Packaged Drinking Water & Bailley Water Sales in Vadodara
   Official Bailley Distributor Code: 031609
═══════════════════════════════════════════════════ */

var SITE = {

  /* ── Google Sheet endpoint for orders & inquiries ── */
  SHEET_URL: 'https://script.google.com/macros/s/AKfycbz_w5sjcT2gXwl8ZqWizHtkpeJ9I9AXkB3fEfJVXAdjmaiLRTTeqAO-ekkXxU0I1PD9-g/exec',

  /* ── First-party optimized image directory ── */
  IMG: 'Images/',

  /* ── Modern WebP product and update assets ── */
  images: {
    hero:    'anjani-hero.webp',
    anjani:  'anjani-200ml.webp',
    bisleri: 'bisleri-bottle.webp',
    bailley: 'bailley-bottle.webp',
    clear:   'clear-bottle.webp',
    update1: 'update-summer-offer.webp',
    update2: 'update-new-stock.webp',
    update3: 'update-wedding-supply.webp',
    update4: 'update-office-delivery.webp'
  },

  /* ── Contact & Ordering Channels ── */
  phone:    '9925997750',
  wa:       'https://wa.me/919925997750?text=Hi%20Anjani%20Water!%20I%20would%20like%20to%20inquire%20about%20water%20sales.',
  email:    'annapurnafoods27@gmail.com',
  indiamart: 'https://www.indiamart.com/annapurnafoods-vadodara',
  instagram: 'https://www.instagram.com/anjaniwater/',

  /* ── Firebase Cloud Messaging (Lazy Loaded on Click) ── */
  firebaseConfig: {
    apiKey: "AIzaSyANmqfdu8rccsTrfTF_-m4D2aeRHRNaqsU",
    authDomain: "anjaniappnew.firebaseapp.com",
    projectId: "anjaniappnew",
    storageBucket: "anjaniappnew.firebasestorage.app",
    messagingSenderId: "892497799371",
    appId: "1:892497799371:web:5671e248e6c8f05d16934e"
  },
  vapidKey: 'BKVduKK_XrRzSOnFWbWPZfW95x_ptNZQkwJOV3rPGeVzGM4XpvwnWHHy5l0QKHf-p9YzVUxaH4CsddIrztTO-2c',

  /* ── Navigation Links ── */
  nav: [
    { label: 'Home',         href: 'index.html'    },
    { label: 'Products',     href: 'products.html' },
    { label: 'Updates',      href: 'updates.html'  },
    { label: 'Who We Serve', href: 'serve.html'    },
    { label: 'Why Us',       href: 'why.html'      },
    { label: 'Contact',      href: 'contact.html'  }
  ]
};

/* ── Helper: Full image URL ── */
SITE.img = function(key) {
  return SITE.IMG + (SITE.images[key] || key);
};

/* ── Build Navigation Header ── */
SITE.buildNav = function(activePage) {
  var el = document.getElementById('navbar');
  if (!el) return;
  var links = SITE.nav.map(function(n) {
    var active = (n.href === activePage) ? ' active' : '';
    return '<li><a href="' + n.href + '" class="nav-link' + active + '">' + n.label + '</a></li>';
  }).join('');
  el.innerHTML =
    '<a href="index.html" class="nav-logo" aria-label="Anjani Water Home">Anjani<span>Water</span></a>' +
    '<ul class="nav-links" id="navLinks">' + links +
    '<li><a href="contact.html#order" class="nav-cta">Order Now</a></li></ul>' +
    '<button class="hamburger" id="hamburger" aria-label="Toggle navigation menu" onclick="SITE.toggleMenu()"><span></span><span></span><span></span></button>';
};

/* ── Mobile Menu Controls ── */
SITE.toggleMenu = function() {
  var nav = document.getElementById('navLinks'), ham = document.getElementById('hamburger');
  if (!nav || !ham) return;
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

/* ── Shrink Navbar on Scroll ── */
window.addEventListener('scroll', function() {
  var nb = document.getElementById('navbar');
  if (nb) nb.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Close Nav Menu on Outside Tap ── */
document.addEventListener('click', function(e) {
  var nav = document.getElementById('navLinks'), ham = document.getElementById('hamburger');
  if (nav && nav.classList.contains('open') && !nav.contains(e.target) && ham && !ham.contains(e.target)) {
    SITE.closeMenu();
  }
});

/* ── Scroll Animation Observer ── */
SITE.initReveal = function() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('visible'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
};

/* ── Send Lead Data to Google Sheets ── */
SITE.sendToSheet = async function(data) {
  if (!SITE.SHEET_URL) return false;
  try {
    await fetch(SITE.SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return true;
  } catch(e) {
    console.error('Sheet logging error:', e);
    return false;
  }
};

/* ── Form Handler with Direct WhatsApp Handoff ── */
SITE.submitForm = async function(e, formId, successId, type) {
  e.preventDefault();
  var form = document.getElementById(formId);
  if (!form) return;
  var data = { type: type, timestamp: new Date().toISOString() };
  new FormData(form).forEach(function(v, k) { data[k] = v; });

  var details = Object.keys(data)
    .filter(function(key) { return key !== 'type' && key !== 'timestamp' && data[key]; })
    .map(function(key) {
      var label = key.replace(/([A-Z])/g, ' $1');
      return label.charAt(0).toUpperCase() + label.slice(1) + ': ' + data[key];
    }).join('\n');

  var brandSubject = (type === 'order') ? 'Water Order Request' : 'Customer Query';
  var message = 'Hi Anjani Water, I have a ' + brandSubject + ':\n\n' + details + '\n\nPlease confirm stock, wholesale price and delivery availability.';

  // Show feedback immediately
  var msg = document.getElementById(successId);
  if (msg) {
    msg.classList.add('show');
    setTimeout(function() { msg.classList.remove('show'); }, 6000);
  }

  // Open WhatsApp
  window.open('https://wa.me/919925997750?text=' + encodeURIComponent(message), '_blank', 'noopener');

  // Submit in background
  try {
    await SITE.sendToSheet(data);
  } catch(err) {}

  form.reset();
};

/* ── FAQ Accordion Toggle ── */
SITE.toggleFaq = function(btn) {
  var item = btn.closest('.faq-item');
  if (!item) return;
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(function(i) { i.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
};

/* ── Inject Floating WhatsApp Button ── */
SITE.injectWA = function() {
  if (document.querySelector('.wa-float')) return;
  var div = document.createElement('a');
  div.className = 'wa-float';
  div.href = SITE.wa;
  div.target = '_blank';
  div.rel = 'noopener';
  div.setAttribute('aria-label', 'Chat on WhatsApp for Water Orders');
  div.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.104 1.523 5.827L0 24l6.335-1.505A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.01-1.371l-.36-.214-3.732.886.914-3.641-.234-.373A9.818 9.818 0 0112 2.182c5.427 0 9.818 4.391 9.818 9.818 0 5.428-4.391 9.818-9.818 9.818z"/></svg><span class="wa-tooltip">Order on WhatsApp</span>';
  document.body.appendChild(div);
};

/* ── Inject Notification Bell Button ── */
SITE.injectBell = function() {
  if (document.querySelector('.bell-float')) return;
  var btn = document.createElement('button');
  btn.className = 'bell-float';
  btn.type = 'button';
  btn.onclick = SITE.requestNotificationPermission;
  btn.setAttribute('aria-label', 'Get Offer & Stock Alerts');
  btn.innerHTML = '<span style="font-size:20px;" aria-hidden="true">🔔</span><span class="bell-tooltip">Get Alerts</span>';
  document.body.appendChild(btn);
};

/* ── Lazy Loaded Firebase Notification Subscription ── */
SITE.loadFirebaseScripts = function(callback) {
  if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
    if (callback) callback();
    return;
  }
  var s1 = document.createElement('script'); s1.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js';
  var s2 = document.createElement('script'); s2.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js';
  var s3 = document.createElement('script'); s3.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore-compat.js';
  s1.async = true; s2.async = true; s3.async = true;
  document.head.appendChild(s1);
  s1.onload = function() {
    document.head.appendChild(s2);
    document.head.appendChild(s3);
    var checkDone = setInterval(function() {
      if (typeof firebase.messaging !== 'undefined' && typeof firebase.firestore !== 'undefined') {
        clearInterval(checkDone);
        if (!firebase.apps.length) {
          firebase.initializeApp(SITE.firebaseConfig);
        }
        if (callback) callback();
      }
    }, 50);
  };
};

SITE.requestNotificationPermission = async function() {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop or mobile push notifications.');
    return;
  }
  try {
    var permission = await Notification.requestPermission();
    if (permission === 'granted') {
      SITE.loadFirebaseScripts(async function() {
        try {
          var messaging = firebase.messaging();
          var token = await messaging.getToken({ vapidKey: SITE.vapidKey });
          if (token) {
            var db = firebase.firestore();
            await db.collection('Customer_Notification').doc(token).set({
              token: token,
              subscribedAt: firebase.firestore.FieldValue.serverTimestamp(),
              userAgent: navigator.userAgent,
              platform: navigator.platform
            });
            SITE.sendToSheet({ type: 'fcm_token', token: token });
            alert('Notifications enabled! You will receive new bulk offers & stock alerts.');
          }
        } catch(err) {
          console.error('Firebase token registration error:', err);
        }
      });
    }
  } catch (err) {
    console.error('Notification error:', err);
  }
};

/* ── Injected Accessible Footer ── */
SITE.injectFooter = function() {
  var el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML =
    '<div class="footer-grid">' +
      '<div class="footer-brand">' +
        '<a href="index.html" class="nav-logo" aria-label="Anjani Water Home">Anjani<span>Water</span></a>' +
        '<p>Vadodara’s trusted water bottle supplier. Specializing in factory-direct Anjani 200ml packaged water sales and official Parle Agro Bailley 200ml distribution (Code: 031609) for weddings, caterers, party plots, showrooms and corporate offices.</p>' +
        '<div class="footer-social">' +
          '<a href="' + SITE.wa + '" class="social-btn" title="WhatsApp" aria-label="WhatsApp Anjani Water">💬</a>' +
          '<a href="tel:91' + SITE.phone + '" class="social-btn" title="Call Us" aria-label="Call Anjani Water">📞</a>' +
          '<a href="mailto:' + SITE.email + '" class="social-btn" title="Email Us" aria-label="Email Anjani Water">✉</a>' +
          '<a href="' + SITE.indiamart + '" class="social-btn" target="_blank" rel="noopener" title="IndiaMART" aria-label="Anjani Water IndiaMART">🏭</a>' +
          '<a href="' + SITE.instagram + '" class="social-btn" target="_blank" rel="noopener" title="Instagram" aria-label="Anjani Water Instagram">📸</a>' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<h4>Water Sales</h4>' +
        '<ul>' +
          '<li><a href="products.html">Anjani 200ml Sale</a></li>' +
          '<li><a href="products.html#bailley">Bailley 200ml Supply</a></li>' +
          '<li><a href="products.html">Bisleri 200ml</a></li>' +
          '<li><a href="products.html">Clear Water 200ml</a></li>' +
        '</ul>' +
      '</div>' +
      '<div>' +
        '<h4>Quick Links</h4>' +
        '<ul>' +
          '<li><a href="updates.html">Latest Updates & Offers</a></li>' +
          '<li><a href="contact.html#order">Request a Quote</a></li>' +
          '<li><a href="contact.html#sample">Free 200ml Sample</a></li>' +
          '<li><a href="serve.html">Who We Serve</a></li>' +
          '<li><a href="why.html">Why Choose Us</a></li>' +
          '<li><a href="privacy.html">Privacy Policy</a></li>' +
        '</ul>' +
      '</div>' +
      '<div>' +
        '<h4>Contact & Orders</h4>' +
        '<ul>' +
          '<li><a href="tel:91' + SITE.phone + '">📞 +91 ' + SITE.phone + '</a></li>' +
          '<li><a href="' + SITE.wa + '">💬 WhatsApp for Instant Rate</a></li>' +
          '<li><a href="mailto:' + SITE.email + '">' + SITE.email + '</a></li>' +
          '<li>Vadodara, Gujarat, India</li>' +
        '</ul>' +
      '</div>' +
    '</div>' +
    '<div class="footer-bottom">' +
      '<span>© 2026 Anjani Premium Water by Annapurna Foods. All rights reserved.</span>' +
      '<span>Official Bailley Distributor (031609) · Vadodara 200ml Specialist</span>' +
    '</div>';
};

/* ── Global Updates Renderer (Used across updates.html & index.html) ── */
SITE.renderUpdates = function(list, targetElementId) {
  var grid = document.getElementById(targetElementId || 'updates-full-grid');
  if (!grid) return;
  if (!list || list.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted)">No updates in this category.</p>';
    return;
  }
  grid.innerHTML = list.map(function(u) {
    var dateStr = '';
    try {
      dateStr = new Date(u.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch(e) { dateStr = u.date; }

    var typeClass = (u.type || 'offer').toLowerCase();
    var imgHtml = u.image ? '<div class="update-card-img"><img src="' + u.image + '" alt="' + u.title + '" loading="lazy" width="400" height="180"></div>' : '';
    var link = u.slug ? ('article.html?slug=' + encodeURIComponent(u.slug)) : (u.ctaLink || 'contact.html#order');

    return '<div class="update-card ' + typeClass + ' reveal">' +
      '<div class="update-card-top">' +
        '<span class="update-emoji" aria-hidden="true">' + (u.emoji || '💧') + '</span>' +
        '<div class="update-type-badge">' + (u.tag || 'Update') + '</div>' +
        '<h3>' + u.title + '</h3>' +
      '</div>' +
      imgHtml +
      '<div class="update-card-body">' +
        '<div class="update-date">' + dateStr + '</div>' +
        '<p class="update-body-text">' + u.body + '</p>' +
        '<a href="' + link + '" class="update-cta-link">' + (u.cta || 'Learn more →') + '</a>' +
      '</div>' +
    '</div>';
  }).join('');

  SITE.initReveal();
};

/* ── Standard Page Init (Zero Initial Overhead) ── */
SITE.init = function(activePage) {
  SITE.buildNav(activePage);
  SITE.injectFooter();
  SITE.injectWA();
  SITE.injectBell();
  SITE.initReveal();
};
