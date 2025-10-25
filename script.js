// Sound laden
const hoverSound = new Audio('sounds/hover.mp3');
hoverSound.volume = 0.01;

// Hover-Effekte für alle .fx Bilder (Trump Bilder)
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

// 🔁 Bildwechsel für Cobie oben
const cobieImg = document.getElementById("cobie");
if (cobieImg) {
  cobieImg.addEventListener("mouseenter", () => {
    cobieImg.src = "img/cobieGif.gif";
  });
  cobieImg.addEventListener("mouseleave", () => {
    cobieImg.src = "img/cobie.jpg";
  });
}
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

  const container = document.createElement("div");
  container.classList.add("fall-container");
  document.body.appendChild(container);

  images.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("falling");
    container.appendChild(img);

    let topOffset = 0;
    if (i < 4) topOffset = 30; // obere Reihe
    else if (i < 8) topOffset = 250; // mittlere Reihe
    else topOffset = 450; // untere Reihe

    img.style.top = `${topOffset}px`;
    img.style.left = `${20 + i * 100}px`;
    img.style.animationDelay = (Math.random() * 1.5) + "s";
  });

  // Optional: nach 10 Sekunden alles wieder aufräumen
  setTimeout(() => {
    document.body.classList.remove("shake-body");
    container.remove();
    chaosTriggered = false;
  }, 10000);
}
