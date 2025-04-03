document.addEventListener("DOMContentLoaded", () => {
  const newsLinks = [
    "https://open.substack.com/pub/dropsitenews/p/gaza-children-israel-sniper-shoot-jazeera?r=jonc4&utm_medium=ios",
    "https://www.documentcloud.org/documents/25592020-letter-from-a-palestinian-political-prisoner-in-louisiana-march-18-2025/",
    "https://www.diagonalthoughts.com/?p=1728",
    "https://archive.org/details/palisriciailleursalighter",
    "https://www.salon.com/2001/10/16/susans/",
    "https://mirror.xyz/sartoshi.eth/QukjtL1076-1SEoNJuqyc-x4Ut2v8_TocKkszo-S_nU"
  ];

  let currentNewsLinkIndex = 0;
  const newsButton = document.querySelector(".news-button");

  // Handle click on the "NEWS" button
  if (newsButton) {
    newsButton.addEventListener("click", (event) => {
      event.preventDefault();
      const link = newsLinks[currentNewsLinkIndex];
      const newTab = window.open(link, "_blank");

      // Cycle to the next link
      currentNewsLinkIndex = (currentNewsLinkIndex + 1) % newsLinks.length;
    });
  }
});
