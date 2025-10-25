// ===== SOUND SYSTEM (from original) =====
const hoverSound = new Audio('sounds/hover.mp3');
hoverSound.volume = 0.01;

window.soundEnabled = false;

function enableSound() {
  document.getElementById("sound-activate").style.display = "none";
  window.soundEnabled = true;
  
  // Optional: Play a welcome sound
  hoverSound.play().catch(e => console.log('Audio blocked:', e));
}

// ===== SECRET TRACKING SYSTEM =====
let secretsFound = new Set();
const totalSecrets = 10;

// Check localStorage for previously found secrets
if (localStorage.getItem('cobieSecrets')) {
  secretsFound = new Set(JSON.parse(localStorage.getItem('cobieSecrets')));
  updateSecretCounter();
}

function markSecretFound(secretNumber) {
  if (!secretsFound.has(secretNumber)) {
    secretsFound.add(secretNumber);
    localStorage.setItem('cobieSecrets', JSON.stringify([...secretsFound]));
    updateSecretCounter();
    showAchievement(secretNumber);
  }
}

function updateSecretCounter() {
  document.getElementById('secrets-found').textContent = secretsFound.size;
  
  const badge = document.getElementById('achievement-badge');
  if (secretsFound.size === totalSecrets) {
    badge.textContent = '🏆 Master Hunter!';
  } else if (secretsFound.size >= 7) {
    badge.textContent = '⭐ Expert';
  } else if (secretsFound.size >= 4) {
    badge.textContent = '🔍 Detective';
  } else if (secretsFound.size >= 1) {
    badge.textContent = '🎯 Seeker';
  }
}

function showAchievement(secretNumber) {
  // Create floating achievement notification
  const achievement = document.createElement('div');
  achievement.className = 'achievement-popup';
  achievement.textContent = `🎉 Secret #${secretNumber} Found!`;
  achievement.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: rgba(255,0,128,0.9);
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    font-weight: bold;
    z-index: 10000;
    animation: slideIn 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
    box-shadow: 0 0 20px rgba(255,0,128,0.6);
  `;
  
  document.body.appendChild(achievement);
  setTimeout(() => achievement.remove(), 3000);
}

// Add CSS for achievement animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes fadeOut {
    to { opacity: 0; transform: translateY(-20px); }
  }
`;
document.head.appendChild(style);

// ===== HOVER EFFECTS FOR ALL .fx IMAGES (from original + enhanced) =====
document.querySelectorAll('.fx').forEach(img => {
  img.addEventListener('mouseover', () => {
    const angle = Math.floor(Math.random() * 10 - 5);
    img.style.transform = `rotate(${angle}deg) scale(1.1)`;
    
    // Sound nur abspielen wenn aktiviert
    if (window.soundEnabled) {
      hoverSound.currentTime = 0;
      hoverSound.play().catch(e => console.log('Audio blocked:', e));
    }
  });
  
  img.addEventListener('mouseout', () => {
    img.style.transform = 'scale(1)';
  });
  
  img.addEventListener('click', () => {
    img.style.boxShadow = '0 0 30px 10px gold';
    setTimeout(() => {
      img.style.boxShadow = '';
    }, 250);
  });
});

// ===== TRACK SECRET CLICKS =====
document.querySelectorAll('.grid-item[data-secret]').forEach(item => {
  item.addEventListener('click', function() {
    const secretNum = parseInt(this.getAttribute('data-secret'));
    markSecretFound(secretNum);
  });
});

// ===== COBIE IMAGE HOVER (from original) =====
const cobieImg = document.getElementById("cobie");
if (cobieImg) {
  cobieImg.addEventListener("mouseenter", () => {
    cobieImg.src = "img/cobieGif.gif";
  });
  cobieImg.addEventListener("mouseleave", () => {
    cobieImg.src = "img/cobie.jpg";
  });
}

// ===== CATEGORY FILTERING SYSTEM =====
function showSection(category) {
  const allItems = document.querySelectorAll('.grid-item');
  const allBtns = document.querySelectorAll('.tab-btn');
  
  // Remove active class from all buttons
  allBtns.forEach(btn => btn.classList.remove('active'));
  
  // Add active class to clicked button
  event.target.classList.add('active');
  
  // Filter items based on category
  allItems.forEach(item => {
    if (category === 'all') {
      item.classList.remove('hidden');
    } else {
      if (item.classList.contains(category)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    }
  });
  
  // Scroll to grid
  document.getElementById('mystery-grid').scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
}

// ===== COPY CONTRACT ADDRESS =====
function copyAddress() {
  const address = '2NoFmB6ZvqRmqX4BYgQQ297oaYhuurKY9FtYj1mmbRMY';
  
  // Try modern clipboard API first
  if (navigator.clipboard) {
    navigator.clipboard.writeText(address).then(() => {
      showCopyNotification('✅ Address copied!');
    }).catch(() => {
      fallbackCopy(address);
    });
  } else {
    fallbackCopy(address);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    document.execCommand('copy');
    showCopyNotification('✅ Address copied!');
  } catch (err) {
    showCopyNotification('❌ Copy failed');
  }
  
  document.body.removeChild(textArea);
}

function showCopyNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    background: rgba(0,255,136,0.9);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 10000;
    animation: fadeInOut 2s ease forwards;
  `;
  
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2000);
}

// Add fadeInOut animation
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(20px); }
    20% { opacity: 1; transform: translateY(0); }
    80% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-20px); }
  }
`;
document.head.appendChild(fadeStyle);

// ===== EASTER EGG: KONAMI CODE =====
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.keyCode);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    activateKonamiEasterEgg();
    konamiCode = [];
  }
});

function activateKonamiEasterEgg() {
  // Create special effect
  document.body.style.animation = 'rainbow 2s linear infinite';
  
  const eggNotification = document.createElement('div');
  eggNotification.textContent = '🎮 KONAMI CODE ACTIVATED! You found the ultimate easter egg!';
  eggNotification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px 50px;
    border-radius: 20px;
    font-size: 24px;
    font-weight: bold;
    z-index: 10001;
    box-shadow: 0 0 50px rgba(102,126,234,0.8);
    animation: pulse 1s ease infinite;
    text-align: center;
  `;
  
  document.body.appendChild(eggNotification);
  
  setTimeout(() => {
    eggNotification.remove();
    document.body.style.animation = '';
  }, 5000);
}

// Rainbow animation CSS
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
`;
document.head.appendChild(rainbowStyle);

// ===== RANDOM GLITCH EFFECT (Fun Easter Egg) =====
setInterval(() => {
  if (Math.random() < 0.02) { // 2% chance every interval
    const h1 = document.querySelector('h1');
    const originalText = h1.textContent;
    h1.textContent = '👾 G̴l̴i̴t̴c̴h̴ ̴i̴n̴ ̴t̴h̴e̴ ̴M̴a̴t̴r̴i̴x̴ 👾';
    setTimeout(() => {
      h1.textContent = originalText;
    }, 200);
  }
}, 5000);

// ===== LOG VISITORS (for your tracking) =====
console.log('%c🎭 Welcome to Cobie Meme 🎭', 'font-size: 20px; color: gold; font-weight: bold;');
console.log('%cYou found the console! Here\'s a secret: Try the Konami Code (↑↑↓↓←→←→BA)', 'color: cyan;');

// Track page load
if (localStorage.getItem('cobieVisits')) {
  let visits = parseInt(localStorage.getItem('cobieVisits')) + 1;
  localStorage.setItem('cobieVisits', visits);
  console.log(`This is your visit #${visits} to Cobie Meme`);
} else {
  localStorage.setItem('cobieVisits', 1);
  console.log('Welcome, first-time visitor! 🎉');
}

// ===== PREVENT RIGHT-CLICK ON IMAGES (optional protection) =====
// Uncomment if you want to protect your images
/*
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showCopyNotification('🔒 Image protected');
  });
});
*/

// === 🌀 Cobie Easter-Egg Effekt ===
const cobie = document.getElementById("cobie");
let holdTimer, chaosTriggered = false;

if (cobie) {
  cobie.addEventListener("mouseenter", () => {
    holdTimer = setTimeout(triggerCobieChaos, 2000); // 2 Sekunden halten
  });
  cobie.addEventListener("mouseleave", () => clearTimeout(holdTimer));
}

function triggerCobieChaos() {
  if (chaosTriggered) return;
  chaosTriggered = true;

  const audio = document.getElementById("upOnly");
  if (window.soundEnabled && audio) {
    audio.volume = 0.8;
    audio.play().catch(() => {});
  }

  document.body.classList.add("shake-body");

  const images = [
    "img/1YaoMing.png","img/1bitcoin.png","img/1boss.png","img/1dogecoin.png","img/1donkey.gif",
    "img/1mario.gif","img/1milady.png","img/1pepe.png","img/1pokerface.png","img/1ryu.png",
    "img/1saitama.png","img/1satoshiN.png","img/1uuuuu.png"
  ];

  // Bilder zufällig mischen
  const shuffledImages = [...images].sort(() => Math.random() - 0.5);

  const container = document.createElement("div");
  container.classList.add("fall-container");
  document.body.appendChild(container);

  // 8-12 zufällige Bilder auswählen
  const imageCount = 8 + Math.floor(Math.random() * 5); // 8-12 Bilder
  const selectedImages = shuffledImages.slice(0, imageCount);

  selectedImages.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("falling");
    container.appendChild(img);

    // Zufällige Werte
    const randomLeft = Math.random() * (window.innerWidth - 150);
    const randomDelay = Math.random() * 4; // 0-4 Sekunden Verzögerung
    const randomDuration = 2 + Math.random() * 3; // 2-5 Sekunden Fallzeit
    const randomSize = 100 + Math.random() * 80; // 100-180px Größe
    const randomRotation = (Math.random() - 0.5) * 30; // -15 bis +15 Grad Rotation

    img.style.left = `${randomLeft}px`;
    img.style.width = `${randomSize}px`;
    img.style.animationDelay = `${randomDelay}s`;
    img.style.animationDuration = `${randomDuration}s`;
    img.style.setProperty('--start-rotate', `${-randomRotation}deg`);
    img.style.setProperty('--end-rotate', `${randomRotation}deg`);
  });

  // Nach 8 Sekunden aufräumen
  setTimeout(() => {
    document.body.classList.remove("shake-body");
    container.remove();
    chaosTriggered = false;
  }, 8000);
}

console.log('✅ All systems loaded. The hunt begins...');