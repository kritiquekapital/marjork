// Space Background Stream Controller
(function() {
  const SPACE_STREAM_URL = "https://www.youtube.com/embed/H999s0P1Er0?autoplay=1&mute=1&loop=1&controls=0&showinfo=0";
  const THEME_CLASS = 'theme-space';
  
  // Create hidden iframe
  const spaceIframe = document.createElement('iframe');
  Object.assign(spaceIframe, {
    src: SPACE_STREAM_URL,
    allow: 'autoplay',
    sandbox: 'allow-scripts allow-same-origin',
    title: 'Space Background Stream',
    class: 'space-background-stream',
    style: `position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.2;
            display: none;`
  });

  document.body.appendChild(spaceIframe);

  // Theme Observer
  const observer = new MutationObserver(() => {
    const isSpaceTheme = document.body.classList.contains(THEME_CLASS);
    spaceIframe.style.display = isSpaceTheme ? 'block' : 'none';
    
    // Reset source when theme changes
    if (isSpaceTheme && !spaceIframe.src.includes('H999s0P1Er0')) {
      spaceIframe.src = SPACE_STREAM_URL;
    }
  });

  // Start observing body for class changes
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Initial check
  if (document.body.classList.contains(THEME_CLASS)) {
    spaceIframe.style.display = 'block';
  }
})();
