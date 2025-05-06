document.addEventListener("DOMContentLoaded", function() {
  // Function to check and open the link in a new tab using sessionStorage
  function openLinkInNewTabIfNotOpened(url) {
    // Check if the URL is already stored in sessionStorage
    if (!sessionStorage.getItem(url)) {
      // If not, open the link in a new tab
      window.open(url, '_blank');
      // Store the URL in sessionStorage so it won't open again during this session
      sessionStorage.setItem(url, 'opened');
    }
  }

  // Attach the function to all specific links (Substack, Twitter, StatsFM, Letterboxd, DropkickD, Spotify)
  const buttons = document.querySelectorAll('.substack-button, .twitter, .statsfm, .letterboxd, .dropkickd-button, .spotify');
  buttons.forEach(button => {
    button.addEventListener('click', function(event) {
      // Prevent default link behavior
      event.preventDefault();
      // Get the URL from the button's href attribute
      const url = button.getAttribute('href');
      // Call the function to open the link if not already opened
      openLinkInNewTabIfNotOpened(url);
    });
  });
});
