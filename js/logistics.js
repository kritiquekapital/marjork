let inactivityTimer;
let player;
let checkpoints = [];
let checkpointButton;

// Exact video lengths in seconds
const videoDurations = [
  28810, 26958, 28807, 28799, 28787, 28803, 28800, 28790, 28800, 28800,
  28792, 28805, 28800, 28787, 28800, 28800, 28792, 28802, 28800, 28791,
  28803, 28800, 28789, 28806, 28800, 28786, 28800, 28800, 28793, 28800,
  28800, 28792, 28800, 28800, 28792, 28808, 28800, 28784, 28805, 28799,
  28788, 28809, 28799, 28783, 28808, 28793, 18131, 28807, 28800, 28789,
  28805, 28803, 28787, 28804, 28803, 28789, 28800, 28800, 28795, 28804,
  28800, 28792, 28801, 28804, 22170, 28809, 28792, 28791, 28802, 28802,
  28788, 28807, 28795, 28791, 28808, 28800, 28781, 28810, 28800, 28783,
  28804, 28800, 28788, 28801, 28800, 28791, 28804, 28800, 28788, 28801,
  28808, 28783, 28810, 28800, 28783, 28809, 28800, 28783, 28808, 28800,
  28785, 28809, 28800, 16477, 28800, 28800, 15266
];

// Compute total playlist duration
let totalDuration = videoDurations.reduce((sum, duration) => sum + duration, 0);

// Define checkpoint intervals at 4-hour marks
let checkpointInterval = 4 * 60 * 60; // 4 hours in seconds
let currentTime = 0;

// Generate checkpoints based on actual video durations
for (let i = 0; currentTime < totalDuration; i++) {
  checkpoints.push({
    name: `Checkpoint ${i + 1}`,
    time: currentTime
  });

  currentTime += checkpointInterval;
}

// Ensure DOM is fully loaded before running script
document.addEventListener("DOMContentLoaded", function () {
  const transportContainer = document.createElement('div');
  transportContainer.className = 'logistics-transport';
  transportContainer.style.display = 'none';

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

  // Initialize YouTube Player
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
        transportContainer.style.display = 'block';
        document.querySelector('[data-action="unmute"]').textContent = '🔇';
      }
    }
  });

  // Function to update progress bar
  const updateProgressBar = () => {
    if (!player) return;
    const currentTime = player.getCurrentTime();
    document.querySelector('.progress-bar').value = currentTime;
  };

  // Periodically update progress bar
  setInterval(updateProgressBar, 1000);
});
