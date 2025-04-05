let player;
let checkpoints = [];
let checkpointButton;

const videoDurations = [ /* same full array as before */ ];

let totalDuration = videoDurations.reduce((sum, duration) => sum + duration, 0);
let checkpointInterval = 4 * 60 * 60;
let currentTime = 0;

for (let i = 0; currentTime < totalDuration; i++) {
  checkpoints.push({ name: `Checkpoint ${i + 1}`, time: currentTime });
  currentTime += checkpointInterval;
}

export function initLogisticsTheme() {
  if (!document.body.classList.contains('theme-logistics')) return;

  const transportContainer = document.createElement('div');
  transportContainer.className = 'logistics-transport';

  const mediaControls = document.createElement('div');
  mediaControls.className = 'media-controls';
  mediaControls.innerHTML = `
    <div class="controls-row row-1">
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
    <div class="controls-row row-2">
      <button data-action="list">📋</button>
      <button data-action="unmute">🔇</button>
      <div class="progress-container">
        <progress class="progress-bar" max="${totalDuration}" value="0"></progress>
      </div>
      <button id="skip-ad-button">⏭</button>
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

  checkpoints.forEach((checkpoint, index) => {
    const item = document.createElement('div');
    item.className = 'checkpoint';
    item.textContent = checkpoint.name;
    item.dataset.index = index;
    item.addEventListener('click', () => {
      if (player?.seekTo) player.seekTo(checkpoint.time, true);
    });
    checkpointsList.appendChild(item);
  });

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
        mediaControls.classList.add('show');
        document.querySelector('[data-action="unmute"]').textContent = '🔇';

        // safe progress bar update loop
        setInterval(() => {
          if (typeof player?.getCurrentTime === 'function') {
            document.querySelector('.progress-bar').value = player.getCurrentTime();
          }
        }, 1000);
      }
    }
  });

  const handleControlClick = (action) => {
    if (!player) return;

    const seekTimes = {
      '-4h': -14400, '-2h': -7200, '-1h': -3600, '-1m': -60,
      '+1m': 60, '+1h': 3600, '+2h': 7200, '+4h': 14400
    };

    switch (action) {
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
        const state = player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
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
  };

  function skipAd() {
    if (player && player.getPlayerState() === YT.PlayerState.AD) {
      player.stopVideo();
      player.playVideo();
    }
  }

  document.getElementById('skip-ad-button').addEventListener('click', skipAd);

  mediaControls.addEventListener('click', (e) => {
    const action = e.target.closest('button')?.dataset.action;
    if (action) handleControlClick(action);
  });

  return () => {
    if (player) player.destroy();
    player = null;
    transportContainer.remove();
    playerContainer.remove();
  };
}
