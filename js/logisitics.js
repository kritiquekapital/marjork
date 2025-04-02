// logisticsTheme.js
export function initLogisticsTheme() {
  if (!document.body.classList.contains('theme-logistics')) return null;

  // Create container
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
    <button data-action="queue">📃</button>
  `;

  // Assemble elements
  transportContainer.append(shipper, mediaControls);
  document.body.appendChild(transportContainer);

  // Animation logic
  const gridContainer = document.querySelector('.grid-container');
  let isShipped = false;

  shipper.addEventListener('click', () => {
    isShipped = !isShipped;
    
    gridContainer.classList.toggle('shipped', isShipped);
    mediaControls.classList.toggle('visible', isShipped);
    
    // Animate arrow
    shipper.style.transform = `translateX(-50%) rotate(${isShipped ? 180 : 0}deg)`;
    shipper.style.top = isShipped ? '-35px' : '-40px';
  });

  // Cleanup function
  return () => {
    transportContainer.remove();
    gridContainer.classList.remove('shipped');
  };
}
