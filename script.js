document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------------------------------
  // 1. แผนที่ Leaflet.js (จุดศูนย์กลาง: มธรรมศาสตร์ ศูนย์รังสิต)
  // ----------------------------------------------------
  const tuRangsitLat = 14.0722;
  const tuRangsitLng = 100.6017;
  const initialZoom = 15;

  const map = L.map('leaflet-map').setView([tuRangsitLat, tuRangsitLng], initialZoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // ปักหมุดสถานที่สำคัญภายใน มธ. รังสิต
  const places = [
    { name: "อาคารสโมสรนักศึกษา มธ.", lat: 14.0735, lng: 100.6030 },
    { name: "หอสมุดป๋วย อึ๊งภากรณ์", lat: 14.0722, lng: 100.6017 },
    { name: "ศูนย์อาหารทิวสน", lat: 14.0705, lng: 100.6025 },
    { name: "บร.1 (ตึกเรียนรวม)", lat: 14.0715, lng: 100.6040 }
  ];

  places.forEach(place => {
    L.marker([place.lat, place.lng])
      .addTo(map)
      .bindPopup(`<b>${place.name}</b>`);
  });

  // ปุ่ม ค้นหาตำแหน่ง GPS ของผู้ใช้
  let userMarker = null;
  const locateBtn = document.getElementById("locate-btn");

  if (locateBtn) {
    locateBtn.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            if (userMarker) {
              map.removeLayer(userMarker);
            }

            userMarker = L.circleMarker([userLat, userLng], {
              color: '#D9381E',
              fillColor: '#D9381E',
              fillOpacity: 0.9,
              radius: 9
            }).addTo(map).bindPopup("<b>คุณอยู่ที่นี่</b>").openPopup();

            map.setView([userLat, userLng], 17);
          },
          () => {
            alert("ไม่สามารถเข้าถึงตำแหน่งของคุณได้ กรุณาเปิดการอนุญาตตั้งค่าตำแหน่งในเบราว์เซอร์");
          }
        );
      } else {
        alert("เบราว์เซอร์ของคุณไม่รองรับระบบระบุตำแหน่ง GPS");
      }
    });
  }

  // ----------------------------------------------------
  // 2. ระบบสลับธีม Dark / Light Mode
  // ----------------------------------------------------
  const themeBtn = document.getElementById('theme-toggle');
  
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeBtn) themeBtn.textContent = '☀️';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      themeBtn.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // ----------------------------------------------------
  // 3. ระบบเข้าสู่ระบบ & ลงทะเบียน
  // ----------------------------------------------------
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const authContainer = document.getElementById('auth-container');
  const profileCard = document.getElementById('user-profile-card');
  const welcomeText = document.getElementById('welcome-text');
  const userInfoDetail = document.getElementById('user-info-detail');
  const logoutBtn = document.getElementById('logout-btn');

  if (tabLogin && tabRegister) {
    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
    });

    tabRegister.addEventListener('click', () => {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      registerForm.style.display = 'block';
      loginForm.style.display = 'none';
    });
  }

  const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
  if (loggedInUser) {
    showProfile(loggedInUser);
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newUser = {
        fullname: document.getElementById('reg-fullname').value,
        phone: document.getElementById('reg-phone').value,
        faculty: document.getElementById('reg-faculty').value || '-',
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value
      };

      let users = JSON.parse(localStorage.getItem('usersList')) || [];
      users.push(newUser);
      localStorage.setItem('usersList', JSON.stringify(users));

      localStorage.setItem('currentUser', JSON.stringify(newUser));
      alert('ลงทะเบียนสำเร็จแล้ว!');
      showProfile(newUser);
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      const users = JSON.parse(localStorage.getItem('usersList')) || [];
      const matchedUser = users.find(u => u.email === email && u.password === password);

      if (matchedUser) {
        localStorage.setItem('currentUser', JSON.stringify(matchedUser));
        showProfile(matchedUser);
      } else {
        const tempUser = { fullname: email.split('@')[0], email: email, phone: '-', faculty: '-' };
        localStorage.setItem('currentUser', JSON.stringify(tempUser));
        showProfile(tempUser);
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      authContainer.style.display = 'block';
      profileCard.style.display = 'none';
    });
  }

  function showProfile(user) {
    if (welcomeText && userInfoDetail) {
      welcomeText.textContent = `ยินดีต้อนรับ, ${user.fullname}!`;
      userInfoDetail.innerHTML = `
        📧 อีเมล: ${user.email}<br>
        📞 เบอร์โทรศัพท์: ${user.phone}<br>
        🎓 คณะ/ภาควิชา: ${user.faculty}
      `;
      authContainer.style.display = 'none';
      profileCard.style.display = 'grid';
    }
  }

  // ----------------------------------------------------
  // 4. ระบบค้นหา (Search Filter)
  // ----------------------------------------------------
  const searchInput = document.querySelector('.search input');
  const searchForm = document.querySelector('.search');
  const cards = document.querySelectorAll('.place-card');

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.toLowerCase().trim();

      cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const text = card.querySelector('p:not(.kicker)').textContent.toLowerCase();
        
        if (title.includes(query) || text.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // ----------------------------------------------------
  // 5. ปุ่มบันทึกกิจกรรม (Save Event Button)
  // ----------------------------------------------------
  const saveBtns = document.querySelectorAll('.outline-btn');
  const savedCountElem = document.getElementById('saved-count');
  let savedCount = parseInt(savedCountElem ? savedCountElem.textContent : 12);

  saveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('saved')) {
        btn.classList.remove('saved');
        btn.textContent = 'บันทึก';
        savedCount--;
      } else {
        btn.classList.add('saved');
        btn.textContent = 'บันทึกแล้ว ✓';
        savedCount++;
      }
      if (savedCountElem) savedCountElem.textContent = savedCount;
    });
  });

  // ----------------------------------------------------
  // 6. เมนูปุ่มกดสำหรับหน้าจอมือถือ (Mobile Navigation Menu)
  // ----------------------------------------------------
  const menuBtn = document.querySelector('.menu');
  const nav = document.querySelector('.nav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('nav--open');
    });
  }
});