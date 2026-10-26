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
    body: 'lu jd dateng?',
    delay: 2500
  },
  {
    app: 'Messages',
    icon: '💬',
    title: 'Louis',
    body: 'lu dmn weh',
    delay: 1500
  },
  {
    app: 'Messages',
    icon: '💬',
    title: 'Ohyul',
    body: 'lu udh mau otw?',
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
    if (startY - endY > 40) {
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
let currentContact = "Ohyul";
let charIndex = 0;

// Data store for individual chatrooms
const chatData = {
  Ohyul: {
    initialMessages: [
      { text: "Lu jd dateng?", type: "received" },
      { text: "Lu udh mau otw?", type: "received" }
    ],
    script: [
      { userText: ["iye. nanya mulu dah ky tokek", "bntr lg sampe"], replyText: "anying", delay: 2000 },
      { userText: "lu dmn", replyText: "backstage sm anak2", delay: 2500 },
      { userText: "otwww", replyText: "ok", delay: 800 }
    ],
    scriptIndex: 0,
    subTextIndex: 0
  },
  Louis: {
    initialMessages: [
      { text: "lu dmn weh", type: "received" }
    ],
    script: [
      { userText: "otw", replyText: "bareng bang acil?", delay: 2500 },
      { userText: "kaga", replyText: "oh ook", delay: 800 }
    ],
    scriptIndex: 0,
    subTextIndex: 0
  }
};



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

// Select Contact -> Opens Chatroom & Loads Contact Chat
document.querySelectorAll(".message-thread").forEach(thread => {
  thread.addEventListener("click", () => {
    const contactName = thread.getAttribute("data-contact") || "Ohyul";
    currentContact = contactName;
    charIndex = 0; // Reset typing index for the new contact
    if (chatInput) chatInput.value = ""; // Clear input bar

    // 1. Update Header Name
    if (activeChatName) activeChatName.textContent = contactName;

    // 2. Update Header Avatar
    const activeAvatarImg = document.getElementById("activeChatAvatar") || document.querySelector(".chat-header-avatar img");
    let avatarUrl = thread.getAttribute("data-avatar");
    if (activeAvatarImg && avatarUrl && avatarUrl.trim() !== "") {
      activeAvatarImg.src = avatarUrl;
    }

    // 3. Render this contact's unique chat history
    renderChatMessages(contactName);

    // 4. Open Chatroom
    if (chatroomView) {
      chatroomView.style.transform = "";
      chatroomView.classList.remove("is-dragging");
      chatroomView.classList.add("active");
    }
  });
});


// Helper function to render messages into container
function renderChatMessages(contact) {
  if (!chatMessagesContainer) return;
  chatMessagesContainer.innerHTML = "";

  const contactInfo = chatData[contact];
  if (!contactInfo) return;

  contactInfo.initialMessages.forEach(msg => {
    const bubble = document.createElement("div");
    bubble.className = `message-bubble ${msg.type}`;
    bubble.textContent = msg.text;
    chatMessagesContainer.appendChild(bubble);
  });

  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}


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
// 6. SCRIPTED FAKE TYPING & TIMER REPLY LOGIC
// ==========================================
const chatInput = document.getElementById("chatInput") || document.querySelector(".chat-input-bar input");
const iosKeyboard = document.getElementById("iosKeyboard");
const chatInputBar = document.querySelector(".chat-input-bar");
const sendBtn = document.getElementById("sendMsgBtn") || document.querySelector(".send-btn");
const chatMessagesContainer = document.getElementById("chatMessagesContainer") || document.querySelector(".chat-messages-container");

// Helper: Get active script target text for the current contact
function getCurrentTargetText() {
  const activeData = chatData[currentContact];
  if (!activeData || activeData.scriptIndex >= activeData.script.length) return "";

  const rawUserText = activeData.script[activeData.scriptIndex].userText;
  if (Array.isArray(rawUserText)) {
    return rawUserText[activeData.subTextIndex] || "";
  }
  return rawUserText;
}
// Send Message & Trigger Contact's Typing Indicator + Reply
function sendMessage() {
  const activeData = chatData[currentContact];
  if (!activeData) return;

  const currentTargetText = getCurrentTargetText();
  
  // Prevent sending if text isn't finished typing yet
  if (charIndex < currentTargetText.length) {
    return;
  }

  const text = chatInput.value.trim();
  if (!text) return;

  // A. Post user bubble
  const userBubble = document.createElement("div");
  userBubble.className = "message-bubble sent";
  userBubble.textContent = text;
  chatMessagesContainer.appendChild(userBubble);

  activeData.initialMessages.push({ text: text, type: "sent" });

  chatInput.value = "";
  charIndex = 0;
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

  const currentStep = activeData.script[activeData.scriptIndex];
  if (!currentStep) return;

  const rawUserText = currentStep.userText;

  // If it's a multi-part array and there are more lines left, advance to the next line immediately!
  if (Array.isArray(rawUserText) && activeData.subTextIndex < rawUserText.length - 1) {
    activeData.subTextIndex++;
    return; 
  }

  // Otherwise, reset subTextIndex, move to the next script turn, and trigger the reply
  activeData.subTextIndex = 0;
  activeData.scriptIndex++;

  if (currentStep.replyText) {
    setTimeout(() => {
      const typingBubble = document.createElement("div");
      typingBubble.className = "typing-indicator";
      typingBubble.id = "activeTypingIndicator";
      typingBubble.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      `;
      chatMessagesContainer.appendChild(typingBubble);
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }, 400);

    setTimeout(() => {
      const indicator = document.getElementById("activeTypingIndicator");
      if (indicator) indicator.remove();

      const replyBubble = document.createElement("div");
      replyBubble.className = "message-bubble received";
      replyBubble.textContent = currentStep.replyText;

      chatMessagesContainer.appendChild(replyBubble);
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

      activeData.initialMessages.push({ text: currentStep.replyText, type: "received" });
    }, currentStep.delay || 1500);
  }
}


if (chatInput && iosKeyboard) {
  // 1. Open Keyboard Virtual
  chatInput.addEventListener("click", (e) => {
    e.stopPropagation();
    iosKeyboard.classList.add("active");
    if (chatInputBar) chatInputBar.classList.add("keyboard-open");
  });

  // 2. Close Keyboard when tapping background chat
  if (chatMessagesContainer) {
    chatMessagesContainer.addEventListener("click", () => {
      iosKeyboard.classList.remove("active");
      if (chatInputBar) chatInputBar.classList.remove("keyboard-open");
    });
  }

   // 3. Fake Typing Effect: Any key punch outputs the pre-scripted sentence for the active contact
  document.querySelectorAll(".key").forEach((key) => {
    key.addEventListener("click", (e) => {
      e.stopPropagation();

      const activeData = chatData[currentContact];
      if (!activeData) return;

      const currentTargetText = getCurrentTargetText();
      if (!currentTargetText) return;

      if (key.id === "keyDelete") {
        if (charIndex > 0) {
          charIndex--;
          chatInput.value = currentTargetText.substring(0, charIndex);
        }
      } else if (key.id === "return" || key.id === "keyReturn") {
        // Only send if the full text has finished typing!
        if (charIndex >= currentTargetText.length) {
          sendMessage();
        }
      } else {
        if (charIndex < currentTargetText.length) {
          charIndex++;
          chatInput.value = currentTargetText.substring(0, charIndex);
        }
      }
    });
  });



  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }
}

// Instagram App Navigation
// Open Instagram from Home Screen Icon
const instagramAppIcon = document.getElementById('app-instagram');
const instagramScreen = document.getElementById('instagramScreen');

if (instagramAppIcon && instagramScreen) {
  instagramAppIcon.addEventListener('click', () => {
    instagramScreen.classList.add('active');
  });
}


// Instagram Bottom Navigation Switching
const igFeedView = document.getElementById('igFeedView');
const igProfileView = document.getElementById('igProfileView');
const igTabHome = document.getElementById('igTabHome');
const igTabProfile = document.getElementById('igTabProfile');
const instagramBackBtn = document.getElementById('instagramBackBtn');

if (igTabProfile && igFeedView && igProfileView) {
  igTabProfile.addEventListener('click', () => {
    igFeedView.classList.remove('active');
    igProfileView.classList.add('active');
    igTabProfile.classList.add('active');
    igTabHome.classList.remove('active');
  });
}

if (igTabHome && igFeedView && igProfileView) {
  igTabHome.addEventListener('click', () => {
    igProfileView.classList.remove('active');
    igFeedView.classList.add('active');
    igTabHome.classList.add('active');
    igTabProfile.classList.remove('active');
  });
}

if (instagramBackBtn && igFeedView && igProfileView) {
  instagramBackBtn.addEventListener('click', () => {
    // Back button on profile returns to feed
    igProfileView.classList.remove('active');
    igFeedView.classList.add('active');
    igTabHome.classList.add('active');
    igTabProfile.classList.remove('active');
  });
}

// Instagram Profile Grid Lightbox Logic
const igGridItems = document.querySelectorAll('.ig-grid-item img');
const igLightbox = document.getElementById('igLightbox');
const igLightboxImg = document.getElementById('igLightboxImg');
const igLightboxClose = document.getElementById('igLightboxClose');

igGridItems.forEach(img => {
  img.addEventListener('click', () => {
    const imgSrc = img.getAttribute('src');
    if (igLightbox && igLightboxImg) {
      igLightboxImg.setAttribute('src', imgSrc);
      igLightbox.classList.add('active');
    }
  });
});

if (igLightboxClose && igLightbox) {
  igLightboxClose.addEventListener('click', () => {
    igLightbox.classList.remove('active');
  });
}
