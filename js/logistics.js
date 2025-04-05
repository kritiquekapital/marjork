let inactivityTimer;
let player;
let checkpoints = [];
let checkpointButton;

// Exact video lengths in seconds (converted from your timestamps)
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

// Inject checkpoints into the UI
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

export function initLogisticsTheme() {
  if (!document.body.classList.contains('theme-logistics')) return null;

  // Create transport controls with new buttons
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
      <progress class="progress-bar" max="${totalDurationInSeconds}" value="0"></progress>
    </div>
  `;

  document.body.appendChild(mediaControls);
    let inactivityTimer;

  // Create shipper arrow
  const shipper = document.createElement('div');
  shipper.className = 'logistics-shipper';

  transportContainer.append(shipper, mediaControls);
  document.body.appendChild(transportContainer);

  // Create the checkpoints list
  const checkpointsList = document.createElement('div');
  checkpointsList.id = 'checkpoints-list';
  checkpointsList.className = 'hidden';
  document.body.appendChild(checkpointsList);

  checkpointButton = document.querySelector('[data-action="list"]');

  // Populate the checkpoints list with clickable items
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
      mediaControls.style.display = 'block';
      document.querySelector('[data-action="unmute"]').textContent = '🔇';
    }
  }
});

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
        // Toggle visibility of checkpoints list
        if (checkpointsList.classList.contains('hidden')) {
          checkpointsList.classList.remove('hidden');
          checkpointsList.classList.add('show');
        } else {
          checkpointsList.classList.remove('show');
          checkpointsList.classList.add('hidden');
        }
        break;

      default:
        if (seekTimes[action]) {
          const newTime = player.getCurrentTime() + seekTimes[action];
          player.seekTo(Math.max(0, newTime));
        }
    }
  };

// Function to update progress bar
const updateProgressBar = () => {
  if (!player) return;
  const currentTime = player.getCurrentTime();
  document.querySelector('.progress-bar').value = currentTime;
};

// Periodically update progress bar
setInterval(updateProgressBar, 1000);

// Function to show  controls
function showControls() {
  Controls.classList.remove('hidden');
  // Reset the inactivity timer
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    Controls.classList.add('hidden'); // Fade out after 5 seconds of inactivity
  }, 5000); // 5 seconds of inactivity
}

// Add event listeners for user interaction (button clicks, mouse movement, etc.)
document.body.addEventListener('mousemove', showControls);
document.body.addEventListener('click', showMediaControls);

// Initially, show the media controls when the page is loaded or when autoplay starts
showMediaControls();
  
// Function to simulate skipping the ad using YouTube's API
function skipAd() {
  // Check if the player is currently in an ad state
  if (player && player.getPlayerState() === YT.PlayerState.AD) {
    // Skip the ad
    player.stopVideo(); // Stop video to skip the ad
    player.playVideo(); // Start playing the video after ad
  } else {
    console.log('No ad playing.');
  }
}

// Create skip ad button
const skipAdButton = document.createElement('button');
skipAdButton.id = 'skip-ad-button';
skipAdButton.textContent = 'Skip Ad';  // Or use an icon, like ⏭️

// Add event listener for the skip ad button
skipAdButton.addEventListener('click', skipAd);

// Append it to the media controls or desired location
document.querySelector('.media-controls').appendChild(skipAdButton);

  // Event listeners
  mediaControls.addEventListener('click', (e) => {
    const action = e.target.closest('button')?.dataset.action;
    if (action) handleControlClick(action);
  });

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
