/* =========================================================
   UniDirectory — shared behaviors
   Works across all pages; every block checks the element
   exists before wiring up, so one file can be reused site-wide.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      mainNav.style.display = open ? 'flex' : '';
    });
  }

  /* ---------- Sidebar category filter list ---------- */
  document.querySelectorAll('.filter-list').forEach(list => {
    list.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        list.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  /* ---------- Price range selector ---------- */
  document.querySelectorAll('.price-row').forEach(row => {
    row.querySelectorAll('.price-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        row.querySelectorAll('.price-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  });

  /* ---------- Clear filters ---------- */
  const clearBtn = document.querySelector('.clear-filters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      document.querySelectorAll('.filter-list button').forEach((b, i) => b.classList.toggle('active', i === 0));
      document.querySelectorAll('.checkbox-row input').forEach(c => c.checked = false);
      document.querySelectorAll('.price-btn').forEach(b => b.classList.remove('selected'));
    });
  }

  /* ---------- Pill filters (events page) ---------- */
  document.querySelectorAll('.event-filters .pill, .pill-group .pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const group = pill.parentElement;
      group.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  /* ---------- Save / bookmark heart toggle on cards ---------- */
  document.querySelectorAll('.save-heart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('saved');
    });
  });

  /* ---------- Load more (simulated) ---------- */
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      loadMoreBtn.textContent = 'กำลังโหลด...';
      loadMoreBtn.disabled = true;
      setTimeout(() => {
        loadMoreBtn.textContent = 'โหลดครบทั้งหมดแล้ว';
      }, 700);
    });
  }

  /* ---------- Star picker (review form) ---------- */
  const starPicker = document.querySelector('.star-picker');
  if (starPicker) {
    const stars = [...starPicker.querySelectorAll('button')];
    stars.forEach((star, idx) => {
      star.addEventListener('click', () => {
        stars.forEach((s, i) => s.classList.toggle('filled', i <= idx));
        starPicker.dataset.value = idx + 1;
      });
      star.addEventListener('mouseenter', () => {
        stars.forEach((s, i) => s.classList.toggle('filled', i <= idx));
      });
    });
    starPicker.addEventListener('mouseleave', () => {
      const val = parseInt(starPicker.dataset.value || '0', 10);
      stars.forEach((s, i) => s.classList.toggle('filled', i < val));
    });
  }

  /* ---------- Review textarea char counter ---------- */
  const reviewText = document.querySelector('#reviewText');
  const charCount = document.querySelector('.char-count');
  if (reviewText && charCount) {
    const max = 500;
    const update = () => { charCount.textContent = `${reviewText.value.length} / ${max}`; };
    reviewText.addEventListener('input', () => {
      if (reviewText.value.length > max) reviewText.value = reviewText.value.slice(0, max);
      update();
    });
    update();
  }

  /* ---------- Photo upload box (cosmetic file picker) ---------- */
  const uploadBox = document.querySelector('.upload-box');
  if (uploadBox) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.style.display = 'none';
    uploadBox.appendChild(input);
    uploadBox.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
      const label = uploadBox.querySelector('.upload-label');
      if (label && input.files.length) {
        label.textContent = `เลือกแล้ว ${input.files.length} รูปภาพ`;
      }
    });
  }

  /* ---------- Review submit ---------- */
  const reviewForm = document.querySelector('.review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = reviewForm.querySelector('button[type="submit"]');
      submitBtn.textContent = 'ส่งรีวิวแล้ว ✓';
      submitBtn.disabled = true;
    });
  }

  /* ---------- Login form (cosmetic validation) ---------- */
  const loginForm = document.querySelector('.login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('#email');
      const error = loginForm.querySelector('.form-error');
      if (email && !email.value.includes('@')) {
        error.textContent = 'กรุณากรอกอีเมลมหาวิทยาลัยให้ถูกต้อง';
        error.classList.add('show');
        return;
      }
      if (error) error.classList.remove('show');
      const btn = loginForm.querySelector('button[type="submit"]');
      btn.textContent = 'กำลังเข้าสู่ระบบ...';
    });
  }

  /* ---------- Campus map: pin -> popup ---------- */
  const popup = document.querySelector('.map-popup');
  document.querySelectorAll('.map-pin').forEach(pin => {
    pin.addEventListener('click', () => {
      if (!popup) return;
      const name = pin.dataset.name || '';
      const desc = pin.dataset.desc || '';
      popup.querySelector('h4').textContent = name;
      popup.querySelector('p').textContent = desc;
      popup.style.display = 'block';
      document.querySelectorAll('.map-pin').forEach(p => p.classList.remove('pin-selected'));
      pin.classList.add('pin-selected');
    });
  });
  const popupClose = document.querySelector('.map-popup .popup-head button');
  if (popupClose && popup) {
    popupClose.addEventListener('click', () => { popup.style.display = 'none'; });
  }

  /* ---------- View toggle (list / map) ---------- */
  document.querySelectorAll('.view-toggle').forEach(toggle => {
    toggle.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        toggle.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

});
