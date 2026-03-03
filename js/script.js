/* ============================================================
   Anjani Premium Water — script.js
   Place this file in the /js/ folder on GitHub
   GitHub path: /js/script.js
============================================================ */

/* ============================================================
   ✏️  EASY CONFIG — UPDATE ALL IMAGES & CONTENT HERE
   You never need to dig into the code below this section!
============================================================ */

const ANJANI_CONFIG = {

  // ╔══════════════════════════════════════════════════════════╗
  // ║  🔗 GOOGLE SHEETS — DO NOT CHANGE THIS                  ║
  // ╚══════════════════════════════════════════════════════════╝
  SHEET_URL: 'https://script.google.com/macros/s/AKfycbz_w5sjcT2gXwl8ZqWizHtkpeJ9I9AXkB3fEfJVXAdjmaiLRTTeqAO-ekkXxU0I1PD9-g/exec',

  // ╔══════════════════════════════════════════════════════════╗
  // ║  📸 IMAGE URLs — UPDATE HERE ANYTIME                    ║
  // ║  Just replace the URL string, nothing else!             ║
  // ╚══════════════════════════════════════════════════════════╝

  // Hero section — large bottle on homepage
  heroBottleImage: 'https://drive.google.com/uc?export=view&id=16oFqy0md7QnlFI4ywMMiZpO5PoVe1jW-',

  // Product cards — one URL per brand
  products: {
    anjani:  'https://drive.google.com/uc?export=view&id=16oFqy0md7QnlFI4ywMMiZpO5PoVe1jW-',  // ← your Anjani bottle photo
    bisleri: 'https://www.bisleri.com/cdn/shop/files/200mlx48.png?v=1695987845',               // ← Bisleri official
    bailley: 'https://www.parleagro.com/assets/images/products/bailley/bailley-200.png',       // ← Bailley official
    clear:   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPcSy7H-5k5E6RAMhnKYIH1jGYCEMwcl95lg&s', // ← Clear Water
  },

  // ╔══════════════════════════════════════════════════════════╗
  // ║  🎯 PROMO SLIDES — UPDATE HERE ANYTIME                  ║
  // ║  Change image, title, desc, tag for each slide          ║
  // ║  Add a new slide by copy-pasting a { } block           ║
  // ║  Remove a slide by deleting its { } block              ║
  // ╚══════════════════════════════════════════════════════════╝
  promos: [
    {
      image:   '',   // ← paste promo photo URL here (or leave empty for gradient)
      tag:     '🔥 Limited Offer',
      title:   'Bulk Order Special<br>Save Big Today',
      desc:    'Order 500+ Anjani 200ml bottles and get exclusive wholesale pricing. Perfect for events, hotels & offices in Vadodara.',
      btnText: '📦 Order Now →',
      btnLink: '#forms',
      bgColor: 'linear-gradient(135deg, #b8d8f0 0%, #7ec8e3 100%)',
    },
    {
      image:   '',   // ← paste promo photo URL here (or leave empty for gradient)
      tag:     '🎁 Free Sample',
      title:   'Try Anjani Water<br>Absolutely Free',
      desc:    'First-time customers in Vadodara can request a complimentary 200ml sample — delivered to your door, no strings attached.',
      btnText: '🎁 Book Sample →',
      btnLink: 'sample-modal',
      bgColor: 'linear-gradient(135deg, #a8d8f0 0%, #5bb8d4 100%)',
    },
    {
      image:   '',   // ← paste promo photo URL here (or leave empty for gradient)
      tag:     '🏢 Corporate',
      title:   'Office & Event<br>Water Partner',
      desc:    'Trusted by offices, hotels and event planners across Vadodara. Branded Anjani water — the premium touch your guests deserve.',
      btnText: '💬 WhatsApp Us →',
      btnLink: 'https://wa.me/919925997750?text=Hi!%20I%20need%20water%20for%20my%20event.',
      bgColor: 'linear-gradient(135deg, #d0eafa 0%, #6ab8d8 100%)',
    },
  ],

};
/* ============================================================
   ⛔  DO NOT EDIT BELOW THIS LINE UNLESS YOU KNOW WHAT YOU'RE DOING
============================================================ */

// NAV SCROLL
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  });

  function toggleMenu() {
    const nav = document.getElementById('navLinks');
    const isOpen = nav.classList.toggle('open');
    // Prevent body scroll when menu is open on mobile
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  // Close mobile menu when any nav link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('navLinks').classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close mobile menu on outside tap
  document.addEventListener('click', (e) => {
    const nav = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (nav.classList.contains('open') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // MODALS
  function openSampleModal() {
    document.getElementById('sampleModal').classList.add('open');
  }
  function closeSampleModal() {
    document.getElementById('sampleModal').classList.remove('open');
  }
  function openOrder(product) {
    document.getElementById('quickProduct').value = product;
    document.getElementById('orderModalProduct').textContent = 'Ordering: ' + product;
    document.getElementById('orderModal').classList.add('open');
  }

  // Close modal on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

  // ── GOOGLE SHEETS INTEGRATION ──
  // 👉 Paste your deployed Apps Script Web App URL below
  // (After deploying: Copy > Execution URL and paste here)
  const SHEET_URL = ANJANI_CONFIG.SHEET_URL;

  async function sendToSheet(data) {
    if (!SHEET_URL) {
      console.warn('Anjani: Sheet URL not set yet. Add your Apps Script Web App URL to script.js');
      return;
    }
    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch(err) {
      console.error('Sheet error:', err);
    }
  }

  // ── VISITOR TRACKING ──
  // Detects device, browser, OS, screen, language, referrer
  // Sends one visit record to the Visitors sheet on page load

  function generateSessionId() {
    // Reuse session ID within same tab session
    let sid = sessionStorage.getItem('anjani_sid');
    if (!sid) {
      sid = 'sid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
      sessionStorage.setItem('anjani_sid', sid);
    }
    return sid;
  }

  function detectDevice(ua) {
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
    if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return 'Mobile';
    return 'Desktop';
  }

  function detectBrowser(ua) {
    if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
    return 'Other';
  }

  function detectOS(ua) {
    if (ua.includes('Windows NT')) return 'Windows';
    if (ua.includes('Mac OS X') && !ua.includes('iPhone') && !ua.includes('iPad')) return 'macOS';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    if (ua.includes('Linux')) return 'Linux';
    return 'Other';
  }

  async function getLocationInfo() {
    // Uses free IP geolocation API — no key needed
    try {
      const res  = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      return {
        city:    data.city    || '',
        region:  data.region  || '',
        country: data.country_name || '',
        ip:      data.ip      || ''
      };
    } catch {
      return { city:'', region:'', country:'', ip:'' };
    }
  }

  async function trackVisitor() {
    if (!SHEET_URL) return; // Skip if not configured yet
    const ua       = navigator.userAgent;
    const location = await getLocationInfo();
    const visitData = {
      type:        'visitor',
      page:        document.title + ' | ' + window.location.href,
      referrer:    document.referrer || 'Direct',
      device:      detectDevice(ua),
      browser:     detectBrowser(ua),
      os:          detectOS(ua),
      screenSize:  window.screen.width + 'x' + window.screen.height,
      language:    navigator.language || '',
      city:        location.city,
      region:      location.region,
      country:     location.country,
      ip:          location.ip,
      timeOnSite:  0,
      pagesViewed: 1,
      sessionId:   generateSessionId()
    };
    sendToSheet(visitData);

    // Track time spent on site — send update when user leaves
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const seconds = Math.round((Date.now() - startTime) / 1000);
      visitData.timeOnSite = seconds;
      // Use sendBeacon for reliable send on page unload
      if (SHEET_URL && navigator.sendBeacon) {
        navigator.sendBeacon(SHEET_URL, JSON.stringify(visitData));
      }
    });
  }

  // Fire visitor tracking on load
  window.addEventListener('load', () => {
    trackVisitor();
  });

  async function submitForm(e, formId, successId, type) {
    e.preventDefault();
    const form = document.getElementById(formId);
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    // Collect all form data
    const formData = new FormData(form);
    const data = { type };
    formData.forEach((v, k) => data[k] = v);

    // Send to Google Sheets
    await sendToSheet(data);

    // Show success
    btn.style.display = 'none';
    document.getElementById(successId).style.display = 'block';

    // Also send WhatsApp notification (optional deep link)
    const msg = encodeURIComponent(`New ${type} from ${data.name} (${data.phone}). Product: ${data.product||data.queryType||'Free Sample'}`);
    // Uncomment next line to auto-open WhatsApp notification:
    // window.open(`https://wa.me/919925997750?text=${msg}`, '_blank');
  }


  // ── APPLY CONFIG IMAGES TO PAGE ──
  // Runs on load — pulls all URLs from ANJANI_CONFIG and injects into HTML

  function applyConfigImages() {

    // Hero bottle image
    const heroBottle = document.getElementById('hero-bottle');
    if (heroBottle && ANJANI_CONFIG.heroBottleImage) {
      heroBottle.src = ANJANI_CONFIG.heroBottleImage;
    }

    // Product card images
    const productMap = {
      'anjani-img':  ANJANI_CONFIG.products.anjani,
      'bisleri-img': ANJANI_CONFIG.products.bisleri,
      'bailley-img': ANJANI_CONFIG.products.bailley,
      'clear-img':   ANJANI_CONFIG.products.clear,
    };
    Object.entries(productMap).forEach(([id, url]) => {
      const el = document.getElementById(id);
      if (el && url) { el.src = url; el.style.display = 'block'; }
    });

    // Promo carousel slides — built entirely from config
    const track = document.getElementById('carouselTrack');
    if (track && ANJANI_CONFIG.promos.length) {
      track.innerHTML = ''; // clear existing slides
      ANJANI_CONFIG.promos.forEach((promo, i) => {
        const slide = document.createElement('div');
        slide.className = 'promo-slide';

        // Background: image or gradient
        if (promo.image) {
          slide.innerHTML += `<img src="${promo.image}" alt="Promo ${i+1}">`;
        } else {
          slide.style.background = promo.bgColor || 'linear-gradient(135deg,#b8d8f0,#7ec8e3)';
        }

        // Button HTML
        let btnHTML = '';
        if (promo.btnLink === 'sample-modal') {
          btnHTML = `<button class="promo-cta" onclick="openSampleModal()">${promo.btnText}</button>`;
        } else if (promo.btnLink.startsWith('http')) {
          btnHTML = `<a href="${promo.btnLink}" class="promo-cta" target="_blank">${promo.btnText}</a>`;
        } else {
          btnHTML = `<a href="${promo.btnLink}" class="promo-cta">${promo.btnText}</a>`;
        }

        slide.innerHTML += `
          <div class="promo-overlay"></div>
          <div class="promo-content">
            <span class="promo-tag">${promo.tag}</span>
            <h2 class="promo-title">${promo.title}</h2>
            <p class="promo-desc">${promo.desc}</p>
            ${btnHTML}
          </div>`;
        track.appendChild(slide);
      });
      // Re-init carousel after rebuilding slides
      currentSlide = 0;
      buildCarousel();
    }
  }

  // Run apply on DOM ready
  document.addEventListener('DOMContentLoaded', applyConfigImages);

  // ── PROMO CAROUSEL ──
  let currentSlide = 0;
  const track = document.getElementById('carouselTrack');
  const slides = track ? track.querySelectorAll('.promo-slide') : [];
  const dotsContainer = document.getElementById('carouselDots');
  const thumbStrip = document.getElementById('thumbStrip');
  let autoTimer;

  function buildCarousel() {
    if (!slides.length) return;
    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i===0?' active':'');
      dot.onclick = () => goToSlide(i);
      dotsContainer.appendChild(dot);
      // Build thumbnails
      const thumb = document.createElement('div');
      thumb.className = 'thumb' + (i===0?' active':' empty');
      // If slide has an img, show it in thumb too
      const img = slides[i].querySelector('img');
      if (img) {
        const tImg = document.createElement('img');
        tImg.src = img.src; tImg.alt = 'Thumb';
        thumb.appendChild(tImg);
        thumb.classList.remove('empty');
      } else {
        thumb.textContent = 'Slide ' + (i+1);
      }
      thumb.onclick = () => goToSlide(i);
      thumbStrip.appendChild(thumb);
    });
    startAuto();
  }

  function goToSlide(n) {
    currentSlide = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelectorAll('.dot').forEach((d,i) => d.classList.toggle('active', i===currentSlide));
    document.querySelectorAll('.thumb').forEach((t,i) => t.classList.toggle('active', i===currentSlide));
    resetAuto();
  }

  function moveCarousel(dir) { goToSlide(currentSlide + dir); }

  function startAuto() { autoTimer = setInterval(() => moveCarousel(1), 5000); }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }

  // Swipe support
  let touchStartX = 0;
  if (track) {
    track.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, {passive:true});
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) moveCarousel(diff > 0 ? 1 : -1);
    });
  }

  buildCarousel();

  // ── FADE-IN ON SCROLL ──
  // Bottle entrance — pop in on load
  const bottleWrap = document.querySelector('.bottle-wrap');
  if (bottleWrap) {
    bottleWrap.style.opacity = '0';
    bottleWrap.style.transform = 'translateY(40px) scale(0.92)';
    bottleWrap.style.transition = 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.34,1.56,0.64,1)';
    setTimeout(() => {
      bottleWrap.style.opacity = '1';
      bottleWrap.style.transform = 'translateY(0) scale(1)';
    }, 300);
  }

  // Parallax tilt on mouse move (hero section)
  const hero = document.querySelector('.hero');
  if (hero && bottleWrap) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      bottleWrap.style.transform = `perspective(800px) rotateY(${dx * 8}deg) rotateX(${-dy * 5}deg)`;
    });
    hero.addEventListener('mouseleave', () => {
      bottleWrap.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    });
  }

  // Fade-in on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animation = 'fadeUp 0.7s ease both';
        e.target.style.opacity = '1';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.product-card, .why-feature, .testi-card, .form-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
