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
    title: 'Ohyul',
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
const CORRECT_PIN = "1301"; 
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
    if (passcodeScreen) passcodeScreen.classList.remove('active');
    if (lockScreen) lockScreen.classList.remove('unlocked');
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
    if (passcodeScreen) {
      passcodeScreen.style.transform = 'translateY(-100%)';
      passcodeScreen.style.pointerEvents = 'none';
    }
    if (lockScreen) {
      lockScreen.style.pointerEvents = 'none';
    }
    
    setTimeout(() => {
      if (passcodeScreen) passcodeScreen.style.display = 'none';
      if (lockScreen) lockScreen.style.display = 'none';
    }, 400);
  } else {
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

// ==========================================
// 5. MESSAGES NAVIGATION & SWIPE
// ==========================================
const messagesScreen = document.getElementById("messagesScreen");
const chatroomView = document.getElementById("chatroomView");
const backToContactsBtn = document.getElementById("backToContacts");
const activeChatName = document.getElementById("activeChatName");
const messagesHomeBar = document.getElementById("messagesHomeBar");

// Open Messages App
document.addEventListener("click", (e) => {
  const isMessagesClick = e.target.closest(".messages-icon") || e.target.closest(".messages-dock");
  
  if (isMessagesClick && messagesScreen) {
    messagesScreen.style.transform = "";
    messagesScreen.classList.remove("is-dragging");
    
    if (chatroomView) {
      chatroomView.style.transform = "";
      chatroomView.classList.remove("is-dragging");
      chatroomView.classList.remove("active");
    }

    messagesScreen.classList.add("active");
  }
});

// Select Contact -> Opens Chatroom
document.querySelectorAll(".message-thread").forEach(thread => {
  thread.addEventListener("click", () => {
    const contactName = thread.getAttribute("data-contact") || "Contact";
    if (activeChatName) activeChatName.textContent = contactName;
    if (chatroomView) {
      chatroomView.style.transform = "";
      chatroomView.classList.remove("is-dragging");
      chatroomView.classList.add("active");
    }
  });
});

// Back to Contacts List Button
if (backToContactsBtn) {
  backToContactsBtn.addEventListener("click", () => {
    if (chatroomView) chatroomView.classList.remove("active");
  });
}

// Close Messages App via Home Indicator Bar
if (messagesHomeBar) {
  messagesHomeBar.addEventListener("click", () => {
    if (messagesScreen) messagesScreen.classList.remove("active");
    if (chatroomView) chatroomView.classList.remove("active");
  });
}

// ==========================================
// REAL-TIME INTERACTIVE SWIPE NAVIGATION
// ==========================================
let startX = 0;
let currentX = 0;
let isDragging = false;

if (messagesScreen) {
  // 1. TOUCH START (Detect finger placement)
  messagesScreen.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  // 2. TOUCH MOVE (Real-time horizontal tracking across the screen)
  messagesScreen.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;

    // Only track swiping to the right (left-to-right gesture)
    if (deltaX > 0) {
      if (chatroomView && chatroomView.classList.contains("active")) {
        chatroomView.classList.add("is-dragging");
        chatroomView.style.transform = `translateX(${deltaX}px)`;
      } else if (messagesScreen && messagesScreen.classList.contains("active")) {
        messagesScreen.classList.add("is-dragging");
        messagesScreen.style.transform = `translateX(${deltaX}px)`;
      }
    }
  }, { passive: true });

  // 3. TOUCH END (Snap back or complete exit)
  messagesScreen.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;
    const SWIPE_THRESHOLD = 100; // Pixels needed to confirm the back action

    if (chatroomView && chatroomView.classList.contains("active")) {
      chatroomView.classList.remove("is-dragging");
      chatroomView.style.transform = ""; // Reset inline style so CSS takes over
      
      if (deltaX > SWIPE_THRESHOLD) {
        chatroomView.classList.remove("active");
      }
    } else if (messagesScreen && messagesScreen.classList.contains("active")) {
      messagesScreen.classList.remove("is-dragging");
      messagesScreen.style.transform = ""; // Reset inline style
      
      if (deltaX > SWIPE_THRESHOLD) {
        messagesScreen.classList.remove("active");
      }
    }
  });
}


// Start Clock and Notifications
updateClock();
setInterval(updateClock, 1000);
startNotifications();


// ==========================================
// DEV MODE: STAYS OPEN IN FIRST CHATROOM
// ==========================================
function enableDevMode() {
  const messagesScreen = document.getElementById("messagesScreen");
  const chatroomView = document.getElementById("chatroomView");
  const activeChatName = document.getElementById("activeChatName");
  const lockScreen = document.getElementById("lockScreen");
  const passcodeScreen = document.getElementById("passcodeScreen");

  // Force Hide Overlays
  if (lockScreen) {
    lockScreen.style.display = "none";
    lockScreen.style.pointerEvents = "none";
  }
  if (passcodeScreen) {
    passcodeScreen.style.display = "none";
    passcodeScreen.style.pointerEvents = "none";
  }

  // Force Open Messages App
  if (messagesScreen) {
    messagesScreen.style.transform = "translateX(0)";
    messagesScreen.style.opacity = "1";
    messagesScreen.style.pointerEvents = "auto";
    messagesScreen.style.visibility = "visible";
    messagesScreen.classList.add("active");
  }

  // Force Open Chatroom
  if (chatroomView) {
    chatroomView.style.transform = "translateX(0)";
    chatroomView.classList.add("active");
  }

  if (activeChatName) activeChatName.textContent = "Ohyul";
}

// Run Dev Mode
enableDevMode();
