function showLoveMessage(event) {
  const messages = ["I love you!", "я тебя люблю!", "☀️ solnyshko ☀️"];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  const loveContainer = document.getElementById('loveContainer');
  const loveMessage = document.createElement('div');
  loveMessage.classList.add('love-message');
  loveMessage.innerText = randomMessage;

  const buttonRect = event.target.getBoundingClientRect();
  const buttonCenterX = buttonRect.left + buttonRect.width / 2;
  const buttonCenterY = buttonRect.top + buttonRect.height / 2;

  loveMessage.style.left = buttonCenterX + 'px';
  loveMessage.style.top = buttonCenterY + 'px';

  const randomX = Math.random() * window.innerWidth - buttonCenterX;
  const randomY = Math.random() * window.innerHeight - buttonCenterY;

  loveMessage.style.setProperty('--dx', randomX + 'px');
  loveMessage.style.setProperty('--dy', randomY + 'px');

  loveContainer.appendChild(loveMessage);

  loveMessage.style.transition = 'transform 2s ease, opacity 2s ease';
  loveMessage.style.transform = `translate(${randomX}px, ${randomY}px)`;
  loveMessage.style.opacity = '0';

  setTimeout(() => {
    loveMessage.remove();
  }, 2000);
}
