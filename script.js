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
document.head.appendChild