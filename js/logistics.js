let player;

export function initLogisticsTheme() {
  if (!document.body.classList.contains('theme-logistics')) return null;

  // Create transport controls
  const transportContainer = document.createElement('div');
  transportContainer.className = 'logistics-transport';
  
  // Create shipper arrow
  const shipper = document.createElement('div');
  shipper.className = 'logistics-shipper';
  
  // Create media controls
  const mediaControls = document.createElement('div');
  mediaControls.className = 'media-controls';
  mediaControls.innerHTML = `
    <button data-action="prev">⏮</button>
    <button data-action="rewind">⏪</button>
    <button data-action="playpause">⏯</button>
    <button data-action="fastforward">⏩</button>
    <button data-action="next">⏭</button>
    <button data-action="shuffle">🔀</button>
    <button data-action="repeat">🔁</button>
  `;

  // Assemble controls
  transportContainer.append(shipper, mediaControls);
  document.body.appendChild(transportContainer);

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
        event.target.setVolume(50);
        updatePlayButton();
        // Show controls after player is ready
        transportContainer.style.display = 'block';
      },
      onStateChange: updatePlayButton
    }
  });

  // Animation and control logic
  const gridContainer = document.querySelector('.grid-container');
  let isShipped = false;

  shipper.addEventListener('click', () => {
    isShipped = !isShipped;
    gridContainer.classList.toggle('shipped', isShipped);
    mediaControls.classList.toggle('visible', isShipped);
    shipper.style.transform = `translateX(-50%) rotate(${isShipped ? 180 : 0}deg)`;
  });

  // Media control handlers
  mediaControls.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
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
    gridContainer.classList.remove('shipped');
  };
}
