let player;
let checkpoints = [];
let totalDurationInSeconds = 37 * 24 * 60 * 60; // 37 days in seconds
let checkpointInterval = 8 * 60 * 60; // 8 hours in seconds
let checkpointButton;

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

  // Generate checkpoints
  for (let i = 0; i <= totalDurationInSeconds / checkpointInterval; i++) {
    const checkpointTime = i * checkpointInterval;
    const checkpoint = new Date(checkpointTime * 1000).toISOString().substr(11, 8); // Convert seconds to HH:mm:ss format
    checkpoints.push({ name: `Checkpoint ${i + 1}`, time: checkpointTime });
  }

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

  const muteButton = mediaControls.querySelector('[data-action="unmute"]');
  if (muteButton) {
    const volumeSlider = document.createElement("input");
    volumeSlider.type = "range";
    volumeSlider.min = "0";
    volumeSlider.max = "1";
    volumeSlider.step = "0.01";
    volumeSlider.value = player && player.getVolume ? player.getVolume() / 100 : 1;
    volumeSlider.classList.add("logistics-volume-slider");

    volumeSlider.addEventListener("input", () => {
      if (player && player.setVolume) {
        player.setVolume(volumeSlider.value * 100);
      }
    });

    muteButton.replaceWith(volumeSlider);
  }

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

  // Update progress bar based on video time
  const updateProgressBar = () => {
    const currentTime = player.getCurrentTime();
    const progressBar = document.querySelector('.progress-bar');
    progressBar.value = currentTime;
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

  let inactivityTimer;
// Function to show media controls
function showMediaControls() {
  mediaControls.classList.remove('hidden');
  // Reset the inactivity timer
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    mediaControls.classList.add('hidden'); // Fade out after 5 seconds of inactivity
  }, 5000); // 5 seconds of inactivity
}

// Add event listeners for user interaction (button clicks, mouse movement, etc.)
document.body.addEventListener('mousemove', showMediaControls);
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

  // Periodically update progress bar
  setInterval(updateProgressBar, 1000);

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
