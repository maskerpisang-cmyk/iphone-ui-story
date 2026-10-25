// ==========================================
// 1. LIVE CLOCK & DATE SYSTEM
// ==========================================
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeString = `${hours}:${minutes}`;
  
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  const dateString = now.toLocaleDateString('en-US', options);
  
  document.querySelectorAll('.time-small').forEach(el => el.innerText = timeString);
  const timeDisplay = document.getElementById('time-display');
  const dateDisplay = document.getElementById('date-display');
  
  if (timeDisplay) timeDisplay.innerText = timeString;
  if (dateDisplay) dateDisplay.innerText = dateString;
}

// ==========================================
// 2. TIMED NOTIFICATIONS
// ==========================================
const notificationsData = [
  {
    app: 'Messages',
    icon: '💬',
    title: 'Unknown Number',
    body: 'Are you coming tonight? We need to talk.',
    delay: 1500
  },
  {
    app: 'Instagram',
    icon: '📸',
    title: 'New Tag',
    body: 'tagged you in a photo.',
    delay: 4500
  }
];

function addNotification(notif) {
  const container = document.getElementById('notifications-list');
  if (!container) return;
  
  const card = document.createElement('div');
  card.className = 'notification-card';
  card.innerHTML = `
    <div class="notif-header">
      <div class="notif-app">
        <span class="notif-icon">${notif.icon}</span>
        <span>${notif.app}</span>
      </div>
      <span class="notif-time">now</span>
    </div>
    <div class="notif-title">${notif.title}</div>
    <div class="notif-body">${notif.body}</div>
  `;
  
  container.appendChild(card);
}

function startNotifications() {
  notificationsData.forEach((notif) => {
    setTimeout(() => {
      addNotification(notif);
    }, notif.delay);
  });
}

// ==========================================
// 3. PASSCODE & UNLOCK LOGIC
// ==========================================
// SET YOUR PASSCODE HERE:
const CORRECT_PIN = "1234"; 
let enteredPin = "";

const lockScreen = document.getElementById('lockScreen');
const passcodeScreen = document.getElementById('passcodeScreen');
const dotsContainer = document.getElementById('dotsContainer');
const dots = document.querySelectorAll('.dot');

// Reveal Passcode View
function showPasscodeScreen() {
  if (lockScreen && passcodeScreen) {
    lockScreen.classList.add('unlocked');
    passcodeScreen.classList.add('active');
  }
}

// Cancel & Return to Lock Screen
const cancelBtn = document.getElementById('cancelBtn');
if (cancelBtn) {
  cancelBtn.addEventListener('click', () => {
    passcodeScreen.classList.remove('active');
    lockScreen.classList.remove('unlocked');
    resetPin();
  });
}

// Update White Dots
function updateDots() {
  dots.forEach((dot, index) => {
    if (index < enteredPin.length) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
    }
  });
}

// Reset Pin Input
function resetPin() {
  enteredPin = "";
  updateDots();
}

// Keypad Button Click Handlers
document.querySelectorAll('.key-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (enteredPin.length < 4) {
      enteredPin += btn.getAttribute('data-val');
      updateDots();
      
      if (enteredPin.length === 4) {
        setTimeout(validatePin, 200);
      }
    }
  });
});

// Validate Passcode Input
function validatePin() {
  if (enteredPin === CORRECT_PIN) {
    // Correct PIN -> Open Home Screen
    passcodeScreen.style.transform = 'translateY(-100%)';
    setTimeout(() => {
      passcodeScreen.style.display = 'none';
    }, 400);
  } else {
    // Incorrect PIN -> Shake Dots & Clear
    if (dotsContainer) {
      dotsContainer.classList.add('shake');
      setTimeout(() => {
        dotsContainer.classList.remove('shake');
        resetPin();
      }, 400);
    }
  }
}

// ==========================================
// 4. TOUCH SWIPE & CLICK GESTURES
// ==========================================
let startY = 0;

if (lockScreen) {
  lockScreen.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
  }, { passive: true });

  lockScreen.addEventListener('touchend', (e) => {
    let endY = e.changedTouches[0].clientY;
    if (startY - endY > 50) {
      showPasscodeScreen();
    }
  });
}

// Click Fallbacks for Desktop Testing
const homeBar = document.getElementById('homeBar');
const swipeHint = document.querySelector('.swipe-hint');

if (homeBar) homeBar.addEventListener('click', showPasscodeScreen);
if (swipeHint) swipeHint.addEventListener('click', showPasscodeScreen);

// Start Clock and Notifications on Page Load
updateClock();
setInterval(updateClock, 1000);
startNotifications();
