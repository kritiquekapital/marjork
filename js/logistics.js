export function initLogisticsTheme() {
  if (!document.body.classList.contains('theme-logistics')) return;

  const videoDurations = [/* your durations */];
  const totalDuration = videoDurations.reduce((sum, duration) => sum + duration, 0);
  const checkpointInterval = 4 * 60 * 60;
  const checkpoints = [];

  let currentTime = 0;
  for (let i = 0; currentTime < totalDuration; i++) {
    checkpoints.push({ name: `Checkpoint ${i + 1}`, time: currentTime });
    currentTime += checkpointInterval;
  }

  // DOM setup
  const transportContainer = document.createElement('div');
  transportContainer.className = 'logistics-transport';

  const mediaControls = document.createElement('div');
  mediaControls.className = 'media-controls';
  mediaControls.innerHTML = `
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
    <button data-action="unmute">🔇</button>
    <div class="progress-container">
      <progress class="progress-bar" max="${totalDuration}" value="0"></progress>
    </div>
  `;

  const shipper = document.createElement('div');
  shipper.className = 'logistics-shipper';
  transportContainer.append(shipper, mediaControls);
  document.body.appendChild(transportContainer);

  const checkpointsList = document.createElement('div');
  checkpointsList.id = 'checkpoints-list';
  checkpointsList.className = 'hidden';
  document.body.appendChild(checkpointsList);

  let player;
  const playerContainer = document.createElement('div');
  playerContainer.id = 'logistics-player';
  document.body.prepend(playerContainer);

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
        transportContainer.style.display = 'flex';
        document.querySelector('[data-action="unmute"]').textContent = '🔇';
      }
    }
  });

  checkpoints.forEach((checkpoint, index) => {
    const checkpointItem = document.createElement('div');
    checkpointItem.className = 'checkpoint';
    checkpointItem.textContent = checkpoint.name;
    checkpointItem.dataset.index = index;
    checkpointItem.addEventListener('click', () => {
      player.seekTo(checkpoint.time, true);
    });
    checkpointsList.appendChild(checkpointItem);
  });

  // Skip ad button
  const skipAdButton = document.createElement('button');
  skipAdButton.id = 'skip-ad-button';
  skipAdButton.textContent = 'Skip Ad';
  skipAdButton.addEventListener('click', () => {
    if (player.getPlayerState() === YT.PlayerState.AD) {
      player.stopVideo();
      player.playVideo();
    }
  });
  mediaControls.appendChild(skipAdButton);

  // Progress bar update
  setInterval(() => {
    if (!player) return;
    document.querySelector('.progress-bar').value = player.getCurrentTime();
  }, 1000);

  // Inactivity controls
  let inactivityTimer;
  const showControls = () => {
    transportContainer.classList.remove('hidden');
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      transportContainer.classList.add('hidden');
    }, 5000);
  };

  document.body.addEventListener('mousemove', showControls);
  document.body.addEventListener('click', showControls);

  // Button control handling
  const seekTimes = {
    '-4h': -14400, '-2h': -7200, '-1h': -3600, '-1m': -60,
    '+1m': 60, '+1h': 3600, '+2h': 7200, '+4h': 14400
  };

  mediaControls.addEventListener('click', (e) => {
    const action = e.target.closest('button')?.dataset.action;
    if (!action || !player) return;

    switch (action) {
      case 'unmute':
        if (player.isMuted()) {
          player.unMute();
          e.target.textContent = '🔊';
        } else {
          player.mute();
          e.target.textContent = '🔇';
        }
        break;
      case 'playpause':
        const state = player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) player.pauseVideo();
        else player.playVideo();
        break;
      case 'list':
        checkpointsList.classList.toggle('hidden');
        break;
      default:
        if (seekTimes[action]) {
          const newTime = player.getCurrentTime() + seekTimes[action];
          player.seekTo(Math.max(0, newTime));
        }
    }
  });

  // Cleanup
  return () => {
    if (player) player.destroy();
    transportContainer.remove();
    playerContainer.remove();
  };
}
