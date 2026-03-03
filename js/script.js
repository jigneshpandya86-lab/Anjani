/* ============================================================
   Anjani Premium Water — script.js
   Place this file in the /js/ folder on GitHub
   GitHub path: /js/script.js
============================================================ */

// NAV SCROLL
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  });

  function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('open');
  }

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
  const SHEET_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AY5xjrRGW0BdwzJ0qssc_0ZdS9VXx9TSEg_ekPyOB7HdZcYww3VWumTue9738nZbSyCC7k_WWopzuBF0S_7tqxf22IpSLpRjW2jttH3sZzcUfvTWXb18P7hHD7zSWSMBTIg4zRaDDo1QNuJP9loFP0DvvBYP2TTR1Dj-N81d4vd1d6pYRRpNt9uH8eC57hDQf0jZZZWvmlVkELGe_AfnWwLcpJuQMVCZu0SbDSThVWOjhQjYugZ6kxbjKMmyr7jEUCGVN2AUKnLpos_SG6igQcyBdcNZXIAx9PvSKffy2lvy&lib=MPzHTeP_TjGhgujRPgnZ3-ForcxrccJWn'; // <-- PASTE YOUR WEB APP URL HERE after deploying

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
