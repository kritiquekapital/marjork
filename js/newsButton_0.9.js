// Simple array of your writings
const books = [
  {
    title: "Gorbachev Essay",
    cover: "covers/gorbachev.jpg",
    pdf:  "papers/gorbachev.pdf"
  },
  {
    title: "Color of Pomegranates Notes",
    cover: "covers/pomegranates.jpg",
    pdf:  "papers/pomegranates.pdf"
  }
  // add more here
];

const bookcase      = document.getElementById("bookcase");
const pdfReader     = document.getElementById("pdfReader");
const bookGrid      = document.getElementById("bookGrid");
const pdfFrame      = document.getElementById("pdfFrame");
const newsButton    = document.querySelector(".news-button");

const closeBookcase = document.getElementById("closeBookcase");
const closeReader   = document.getElementById("closeReader");

// Build grid
books.forEach(b => {
  const div = document.createElement("div");
  div.className = "book";
  div.dataset.pdf = b.pdf;
  div.innerHTML = `<img src="${b.cover}" alt="${b.title}"><span>${b.title}</span>`;
  div.addEventListener("click", () => {
    pdfFrame.src = b.pdf + "#view=FitH";
    pdfReader.style.display = "block";
  });
  bookGrid.appendChild(div);
});

// Button wiring
newsButton.addEventListener("click", () => bookcase.style.display = "block");
closeBookcase.addEventListener("click", () => bookcase.style.display = "none");
closeReader.addEventListener("click", () => {
  pdfReader.style.display = "none";
  pdfFrame.src = "";
});
