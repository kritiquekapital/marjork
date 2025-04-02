// logisticsTheme.js
let player;

export function initLogisticsTheme() {
  if (!document.body.classList.contains('theme-logistics')) return null;

  // Create player container instead of iframe
  const playerContainer = document.createElement('div');
  playerContainer.id = 'logistics-player';
  document.body.prepend(playerContainer);

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
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });

  // Create transport controls (keep your existing HTML structure)
  const transportContainer = document.createElement('div');
  transportContainer.className = 'logistics-transport';
  // ... rest of your control creation code ...

  // Player control functions
  function onPlayerReady(event) {
    event.target.setVolume(50);
    updatePlayButton();
  }

  function onPlayerStateChange(event) {
    updatePlayButton();
  }

  function updatePlayButton() {
    const playButton = document.querySelector('[data-action="playpause"]');
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
      playButton.textContent = '⏸';
    } else {
      playButton.textContent = '▶';
    }
  }

  // Control handlers
  function handleControlClick(action) {
    switch(action) {
      case 'playpause':
        togglePlayback();
        break;
      case 'next':
        player.nextVideo();
        break;
      case 'prev':
        player.previousVideo();
        break;
      case 'rewind':
        player.seekTo(player.getCurrentTime() - 10);
        break;
      case 'fastforward':
        player.seekTo(player.getCurrentTime() + 10);
        break;
      case 'shuffle':
        player.setShuffle(true);
        break;
      case 'repeat':
        toggleRepeat();
        break;
    }
  }

  function togglePlayback() {
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }

  function toggleRepeat() {
    const repeatButton = document.querySelector('[data-action="repeat"]');
    const looping = player.getLoop();
    player.setLoop(!looping);
    repeatButton.style.color = !looping ? '#1db954' : '';
  }

  // Cleanup function
  return () => {
    if (player) {
      player.destroy();
      player = null;
    }
    transportContainer.remove();
    document.getElementById('logistics-player')?.remove();
    gridContainer.classList.remove('shipped');
  };
}
