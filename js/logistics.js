let player;
let playerReady = false;

export function initLogisticsTheme() {
  if (!document.body.classList.contains('theme-logistics')) return null;

  const transportContainer = document.createElement('div');
  transportContainer.className = 'logistics-transport transport-hidden';

  const mediaControls = document.createElement('div');
  mediaControls.className = 'media-controls';

  const totalDuration = 3600 * 4; // Assume 4 hours as default max progress range

  mediaControls.innerHTML = `
    <div class="media-row top-row">
      <button data-action="-4h">-4h</button>
      <button data-action="-2h">-2h</button>
      <button data-action="-1h">-1h</button>
      <button data-action="-1m">-1m</button>
      <button data-action="playpause">⏯</button>
      <button data-action="+1m">+1m</button>
      <button data-action="+1h">+1h</button>
      <button data-action="+2h">+2h</button>
      <button data-action="+4h">+4h</button>
    </div>
    <div class="media-row bottom-row">
      <button data-action="list">📋</button>
      <button data-action="unmute">🔇</button>
      <div class="progress-container">
        <progress class="progress-bar" max="${totalDuration}" value="0"></progress>
      </div>
      <button id="skip-ad-button">⏭️</button>
    </div>
  `;

  const playerContainer = document.createElement('div');
  playerContainer.id = 'logistics-player';
  document.body.prepend(playerContainer);
  document.body.appendChild(transportContainer);
  document.body.appendChild(mediaControls);

  // Init YouTube Player
  player = new YT.Player('logistics-player', {
    height: '100%',
    width: '100%',
    playerVars: {
      listType: 'playlist',
      list: 'PLJUn5ZRCEXamUuAOpJ5VyTb0PA5_Pqlzw',
      autoplay: 1,
      controls: 0,
      loop: 1,
      modestbranding: 1,
      rel: 0
    },
    events: {
      onReady: (event) => {
        event.target.mute();
        mediaControls.classList.add('active');
        document.querySelector('[data-action="unmute"]').textContent = '🔇';
        playerReady = true;

        setInterval(updateProgressBar, 1000);
      }
    }
  });

  const updateProgressBar = () => {
    if (!playerReady || typeof player.getCurrentTime !== 'function') return;
    const currentTime = player.getCurrentTime();
    const progress = document.querySelector('.progress-bar');
    if (progress) {
      progress.value = currentTime;
    }
  };

  const skipAdButton = document.getElementById('skip-ad-button');
  if (skipAdButton) {
    skipAdButton.addEventListener('click', () => {
      if (!playerReady || typeof player.getCurrentTime !== 'function') return;
      const current = player.getCurrentTime();
      player.seekTo(current + 30); // skip 30 seconds
    });
  }

  mediaControls.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;

    if (!playerReady || typeof player.getCurrentTime !== 'function') return;

    switch (action) {
      case 'playpause':
        const state = player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
        break;
      case 'unmute':
        if (player.isMuted()) {
          player.unMute();
          btn.textContent = '🔊';
        } else {
          player.mute();
          btn.textContent = '🔇';
        }
        break;
      case 'list':
        alert('Checkpoint list not yet implemented!');
        break;
      default:
        // Handle time jumps
        if (/^[+-]\d+[hm]$/.test(action)) {
          const sign = action[0];
          const num = parseInt(action.slice(1, -1));
          const unit = action.slice(-1);
          let seconds = unit === 'h' ? num * 3600 : num * 60;

          if (sign === '-') seconds *= -1;

          const newTime = player.getCurrentTime() + seconds;
          player.seekTo(Math.max(newTime, 0), true);
        }
        break;
    }
  });

  return () => {
    if (player) {
      player.destroy();
      player = null;
    }
    transportContainer.remove();
    playerContainer.remove();
    mediaControls.remove();
  };
}
