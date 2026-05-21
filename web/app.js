    // ============== RESPONSIVE PHONE SCALE ==============
    function scalePhone() {
      const selector = document.querySelector('.screen-nav');
      const stage    = document.querySelector('.phone-stage');
      const wrap     = document.getElementById('phoneScaleWrap');

      // How far down the selector bar ends
      const topBound = selector.getBoundingClientRect().bottom + 10;
      stage.style.top = topBound + 'px';

      const availH = window.innerHeight - topBound - 10; // 10px bottom air
      const availW = window.innerWidth  - 32;            // 16px each side

      const phoneH = 796; // 780 outer height + 8px top + 8px bottom padding
      const phoneW = 391; // 375 outer width  + 8px left + 8px right padding

      const scale = Math.min(1, availH / phoneH, availW / phoneW);
      wrap.style.transform = `scale(${scale})`;
    }
    window.addEventListener('resize', scalePhone);
    // Fire on load (fonts/layout settled) AND immediately as fallback
    window.addEventListener('load', scalePhone);
    setTimeout(scalePhone, 50);

    // ============== RATING & REVIEW ==============
    function rateTrip(val) {
      const stars = document.querySelectorAll('#starRow span');
      stars.forEach((s, i) => { s.style.color = i < val ? '#F59E0B' : '#D1D5DB'; });
    }
    function submitReview() {
      alert('Review submitted! +5 UniPoints earned 🎉');
      goScreen(3);
    }

    // ============== CHIP TOGGLE ==============
    function toggleChipStyle(el) {
      const isActive = el.classList.contains('chip-sel');
      el.style.background = isActive ? '#E0F2FE' : 'white';
      el.style.borderColor = isActive ? '#0EA5E9' : '#E2EAF4';
      el.style.borderWidth = isActive ? '2px' : '1.5px';
      el.style.color = isActive ? '#0EA5E9' : '#64748B';
    }
    function selectChip(el, group) {
      // Toggle single selection within a group of siblings
      const siblings = el.parentElement.querySelectorAll('.pref-chip');
      siblings.forEach(sib => {
        sib.classList.remove('selected');
        sib.style.background = '#F8FBFF';
        sib.style.border = '1.5px solid #E2EAF4';
        sib.querySelector('div:last-child').style.color = '#64748B';
      });
      el.classList.add('selected');
      el.style.background = '#E0F2FE';
      el.style.border = '2px solid #0EA5E9';
      el.querySelector('div:last-child').style.color = '#0EA5E9';
    }

    // ============== SCREEN NAVIGATION ==============
    const allScreens = Array.from(document.querySelectorAll('.screen'));
    // Put Welcome(12), Sign Up(13), Profile Setup(14) first, then app screens 0-11, then Passenger Survey(15+)
    const screens = [...allScreens.slice(12, 15), ...allScreens.slice(0, 12), ...allScreens.slice(15)];
    let currentScreen = 0;

    const screenNames = ['👋 Welcome','📝 Sign Up','✅ Profile Setup','🏠 Home','🔍 Search','🚗 Trip','⭐ Rewards','🏆 Driver','🎁 Redeem','📋 Driver Survey','➕ Offer','💬 Chat','🗺️ Live','⭐ Review','👤 Profile','📋 Passenger Survey'];
    const TOTAL = screens.length;

    // Build dots
    const dotsEl = document.getElementById('screenDots');
    screenNames.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'screen-dot' + (i === 0 ? ' active' : '');
      d.onclick = () => goScreen(i);
      dotsEl.appendChild(d);
    });

    function updateNav() {
      document.getElementById('screenLabelName').textContent = screenNames[currentScreen];
      document.getElementById('screenLabelNum').textContent = (currentScreen + 1) + ' / ' + TOTAL;
      document.querySelectorAll('.screen-dot').forEach((d, i) => d.classList.toggle('active', i === currentScreen));
      document.getElementById('prevBtn').disabled = currentScreen === 0;
      document.getElementById('nextBtn').disabled = currentScreen === TOTAL - 1;
    }

    function goScreen(idx) {
      if (idx === currentScreen) return;
      screens[currentScreen].classList.add('exit');
      setTimeout(() => screens[currentScreen].classList.remove('exit'), 350);
      screens[currentScreen].classList.remove('active');
      screens[idx].classList.add('active');
      currentScreen = idx;
      updateNav();
      // Trigger animations on enter
      if (idx === 6) animatePassengerRing();
      if (idx === 7) animateDriverDashboard();
    }

    function prevScreen() { if (currentScreen > 0) goScreen(currentScreen - 1); }
    function nextScreen() { if (currentScreen < TOTAL - 1) goScreen(currentScreen + 1); }

    updateNav();

    // ============== PASSENGER RING ==============
    function animatePassengerRing() {
      const ring = document.getElementById('ring-passenger');
      const label = document.getElementById('pts-passenger');
      const circumference = 408;
      const target = 240;
      const total = 500;
      const offset = circumference - (target / total) * circumference;
      // Animate circle
      ring.style.strokeDashoffset = circumference;
      setTimeout(() => { ring.style.strokeDashoffset = offset; }, 100);
      // Count up number
      let cur = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        cur = Math.min(cur + step, target);
        label.textContent = Math.round(cur);
        if (cur >= target) clearInterval(timer);
      }, 20);
    }

    // ============== DRIVER DASHBOARD ==============
    function animateDriverDashboard() {
      // Ring
      const ring = document.getElementById('ring-driver');
      const label = document.getElementById('pts-driver');
      const circ = 352;
      const target = 480;
      const offset = circ - (target / 500) * circ;
      ring.style.strokeDashoffset = circ;
      setTimeout(() => { ring.style.strokeDashoffset = offset; }, 100);
      let cur = 0;
      const t1 = setInterval(() => {
        cur = Math.min(cur + 8, target);
        label.textContent = Math.round(cur);
        if (cur >= target) clearInterval(t1);
      }, 20);
      // Rides/month counter
      const rm = document.getElementById('rides-month');
      let r = 0;
      const t2 = setInterval(() => {
        r = Math.min(r + 1, 48);
        rm.textContent = r;
        if (r >= 48) clearInterval(t2);
      }, 40);
      // Completion %
      const cp = document.getElementById('completion-pct');
      let c = 0;
      const t3 = setInterval(() => {
        c = Math.min(c + 2, 98);
        cp.textContent = c + '%';
        if (c >= 98) clearInterval(t3);
      }, 30);
    }

    // ============== DRIVER SLIDER QUESTIONS ==============
    const driverQuestions = [
      "How important is filling your seats quickly and efficiently?",
      "How important are in-app communication and live updates?",
      "How important are tools for scheduling and organizing pickups?",
      "How important is transparent pricing with no hidden fees?",
      "How important is passenger punctuality and reliability?",
      "How important is seeing verified student profiles before accepting?",
      "How important is an intuitive, easy-to-navigate driver app?"
    ];
    const defaultVals = [3, 3, 3, 3, 3, 3, 3];

    const sqEl = document.getElementById('slider-questions');
    driverQuestions.forEach((q, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'slider-row';
      wrap.innerHTML = `
        <div class="slider-q">${i+1}) ${q}</div>
        <div class="slider-track">
          <input type="range" min="1" max="5" step="0.5" value="${defaultVals[i]}"
            style="--val: ${((defaultVals[i]-1)/4)*100}%"
            oninput="updateSlider(this)">
        </div>
        <div class="slider-labels">
          <span>1 NOT IMPORTANT</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5 IMPORTANT</span>
        </div>
      `;
      sqEl.appendChild(wrap);
    });

    // ============== PASSENGER SLIDER QUESTIONS ==============
    const passengerQuestions = [
      { label: "QUESTION 01", text: "Importance of precise, convenient pickup and drop-off points?" },
      { label: "QUESTION 02", text: "Importance of booking at preferred times (advance or last-minute)?" },
      { label: "QUESTION 03", text: "Importance of fare options (cheapest, fastest, or most comfortable)?" },
      { label: "QUESTION 04", text: "Importance of in-ride preferences (quiet, social, luggage space)?" },
      { label: "QUESTION 05", text: "Importance of the app adapting to your trip type (commute, weekend)?" },
      { label: "QUESTION 06", text: "Importance of driver safety features (verified ratings, tracking)?" },
      { label: "QUESTION 07", text: "Importance of accommodating special needs (wheelchair, children seats)?" }
    ];
    const passengerDefaults = [4, 3, 5, 2, 3, 5, 1];

    const pqEl = document.getElementById('passenger-questions');
    if (pqEl) {
      passengerQuestions.forEach((q, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'slider-row';
        wrap.innerHTML = `
          <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">${q.label}</div>
          <div class="slider-q">${q.text}</div>
          <div class="slider-track">
            <input type="range" min="1" max="5" step="1" value="${passengerDefaults[i]}"
              style="--val: ${((passengerDefaults[i]-1)/4)*100}%"
              oninput="updateSlider(this)">
          </div>
          <div class="slider-labels">
            <span>1 NOT IMPORTANT</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5 IMPORTANT</span>
          </div>
        `;
        pqEl.appendChild(wrap);
      });
    }

    function updateSlider(el) {
      const pct = ((el.value - 1) / 4) * 100;
      el.style.setProperty('--val', pct + '%');
    }

    // ============== PREF ITEMS TOGGLE ==============
    document.querySelectorAll('.pref-item').forEach(item => {
      item.addEventListener('click', () => item.classList.toggle('selected'));
    });

    // ============== KEYBOARD NAVIGATION ==============
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' && currentScreen < screens.length - 1) {
        goScreen(currentScreen + 1);
      }
      if (e.key === 'ArrowLeft' && currentScreen > 0) {
        goScreen(currentScreen - 1);
      }
    });
