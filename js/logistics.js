let player;
let checkpoints = [];
let checkpointInterval = 4 * 60 * 60; // 4-hour intervals
let currentCheckpointIndex = 0;

const videoDurations = [/* Your video duration array here */];
let totalDuration = videoDurations.reduce((sum, duration) => sum + duration, 0);

function initializeCheckpoints() {
  checkpoints = [];
  let currentTime = 0;
  while (currentTime < totalDuration) {
    checkpoints.push({
      name: `Checkpoint ${checkpoints.length + 1}`,
      time: currentTime
    });
    currentTime += checkpointInterval;
  }
}

function createTransportControls() {
  const transportContainer = document.createElement('div');
  transportContainer.className = 'logistics-transport';

  // Media Controls
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

  // Shipper Element
  const logisticsShipper = document.createElement('div');
  logisticsShipper.className = 'logistics-shipper';

  transportContainer.append(logisticsShipper, mediaControls);
  document.body.appendChild(transportContainer);

  return { transportContainer, mediaControls, logisticsShipper };
}

export function initLogisticsTheme() {
  if (!document.body.classList.contains('theme-logistics')) return () => {};

  initializeCheckpoints();
  const { transportContainer, mediaControls, logisticsShipper } = createTransportControls();
  
  // Checkpoints List
  const checkpointsList = document.createElement('div');
  checkpointsList.id = 'checkpoints-list';
  checkpointsList.className = 'hidden';
  checkpoints.forEach((checkpoint, index) => {
    const item = document.createElement('div');
    item.className = 'checkpoint';
    item.textContent = checkpoint.name;
    item.dataset.index = index;
    checkpointsList.appendChild(item);
  });
  document.body.appendChild(checkpointsList);

  // Player Container
  const playerContainer = document.createElement('div');
  playerContainer.id = 'logistics-player';
  document.body.prepend(playerContainer);

  // YouTube Player
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
        setInterval(updateProgressBar, 1000);
      }
    }
  });

  // Event Handlers
  const handleControlClick = (action) => {
    /* Original control handler logic */
  };

  const handleShipperClick = () => {
    document.querySelector(".grid-container").classList.toggle("shipped");
    mediaControls.classList.toggle("visible");
  };

  logisticsShipper.addEventListener('click', handleShipperClick);
  mediaControls.addEventListener('click', (e) => {
    const action = e.target.closest('button')?.dataset.action;
    if (action) handleControlClick(action);
  });

  // Cleanup Function
  return () => {
    transportContainer.remove();
    checkpointsList.remove();
    playerContainer.remove();
    player.destroy();
    logisticsShipper.removeEventListener('click', handleShipperClick);
    mediaControls.removeEventListener('click', handleControlClick);
  };
}
