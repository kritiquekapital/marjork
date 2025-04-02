let player;

export function initLogisticsTheme() {
  if (!document.body.classList.contains('theme-logistics')) return null;

  // Create transport controls with new buttons
  const transportContainer = document.createElement('div');
  transportContainer.className = 'logistics-transport';
  transportContainer.style.display = 'none';

  const mediaControls = document.createElement('div');
  mediaControls.className = 'media-controls';
  mediaControls.innerHTML = `
    <button data-action="unmute">🔇</button>
    <button data-action="-4h">-4h</button>
    <button data-action="-2h">-2h</button>
    <button data-action="-1h">-1h</button>
    <button data-action="-1m">-1m</button>
    <button data-action="playpause">⏯</button>
    <button data-action="+1m">+1m</button>
    <button data-action="+1h">+1h</button>
    <button data-action="+2h">+2h</button>
    <button data-action="+4h">+4h</button>
    <button data-action="list">📋</button>
  `;

  // Create shipper arrow
  const shipper = document.createElement('div');
  shipper.className = 'logistics-shipper';

  transportContainer.append(shipper, mediaControls);
  document.body.appendChild(transportContainer);

  // YouTube Player initialization
  const playerContainer = document.createElement('div');
  playerContainer.id = 'logistics-player';
  document.body.prepend(playerContainer);

  // Control handlers
  const handleControlClick = (action) => {
    if (!player) return;

    const seekTimes = {
      '-4h': -14400,  // 4 hours in seconds
      '-2h': -7200,   // 2 hours
      '-1h': -3600,   // 1 hour
      '-1m': -60,      // 1 minute
      '+1m': 60,
      '+1h': 3600,
      '+2h': 7200,
      '+4h': 14400
    };

    switch(action) {
      case 'unmute':
        if (player.isMuted()) {
          player.unMute();
          document.querySelector('[data-action="unmute"]').textContent = '🔊';
        } else {
          player.mute();
          document.querySelector('[data-action="unmute"]').textContent = '🔇';
        }
        break;

      case 'playpause':
        if (player.getPlayerState() === YT.PlayerState.PLAYING) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
        break;

      case 'list':
        // Placeholder for list functionality
        console.log('List button clicked - implement playlist UI');
        break;

      default:
        if (seekTimes[action]) {
          const newTime = player.getCurrentTime() + seekTimes[action];
          player.seekTo(Math.max(0, newTime));
        }
    }
  };

  // Initialize YouTube Player
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
        event.target.mute(); // Start muted
        transportContainer.style.display = 'block';
        document.querySelector('[data-action="unmute"]').textContent = '🔇';
      },
      onStateChange: () => {
        const playButton = document.querySelector('[data-action="playpause"]');
        if (player.getPlayerState() === YT.PlayerState.PLAYING) {
          playButton.textContent = '⏸';
        } else {
          playButton.textContent = '▶';
        }
      }
    }
  });

  // Event listeners
  mediaControls.addEventListener('click', (e) => {
    const action = e.target.closest('button')?.dataset.action;
    if (action) handleControlClick(action);
  });

  // Animation logic remains same
  // ... (keep existing shipping animation code)

  // Cleanup function
  return () => {
    if (player) {
      player.destroy();
      player = null;
    }
    transportContainer.remove();
    playerContainer.remove();
  };
}
