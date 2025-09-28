// Sound laden
const hoverSound = new Audio('sounds/hover.mp3');
hoverSound.volume = 0.5;

document.querySelectorAll('.fx').forEach(img => {
  img.addEventListener('mouseover', () => {
    const angle = Math.floor(Math.random() * 10 - 5);
    img.style.transform = `rotate(${angle}deg) scale(1.1)`;
    hoverSound.currentTime = 0;
    hoverSound.play();
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
    cobieImg.src = "img/cobie.gif";
  });

  cobieImg.addEventListener("mouseleave", () => {
    cobieImg.src = "img/cobie.jpg";
  });
}
