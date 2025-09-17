import { Draggable } from './draggable.js';

// DOM elements
const newsButton       = document.querySelector(".news-button");
const bookcaseWrapper  = document.getElementById("bookcaseWrapper");
const bookcaseBackdrop = document.getElementById("bookcaseBackdrop");
const closeBookcaseBtn = document.getElementById("closeBookcase");
const bookcase         = document.getElementById("bookcase");
const bookGrid         = document.getElementById("bookGrid");
const pdfReader        = document.getElementById("pdfReader");
const pdfFrame         = document.getElementById("pdfFrame");
const closeReader      = document.getElementById("closeReader");

// Header elements in PDF reader shelf
const pdfSectionEl     = document.getElementById("pdfSection");  // <span id="pdfSection"></span>
const pdfWorkTitleEl   = document.getElementById("pdfWorkTitle"); // <span id="pdfWorkTitle"></span>

// Make draggable for bookcase
new Draggable(bookcase, '.bookcase-header');

// Open/close functions
function openBookcase() { bookcaseWrapper.style.display = "block"; }
function closeBookcase() { bookcaseWrapper.style.display = "none"; }

// Event listeners
newsButton.addEventListener("click", openBookcase);
closeBookcaseBtn.addEventListener("click", closeBookcase);
bookcaseBackdrop.addEventListener("click", closeBookcase);
bookcase.addEventListener("click", e => e.stopPropagation());

closeReader.addEventListener("click", () => {
  if (currentBook) {
    currentBook.classList.remove("picked-up", "checked-out");
    bookGrid.querySelectorAll(".book").forEach(book => book.classList.remove("locked"));
    currentBook = null;
  }
  pdfReader.style.display = "none";
  pdfFrame.src = "";
});

// Current book
let currentBook = null;

// Book list
const books = [
  { section: "History", title: "Russia1", cover: "suprises/covers/I. each productivist needs to read his newspaper.jpg", pdf: "suprises/books/Russia1.pdf", color: "rgba(139,0,0,0.7)" },
  { section: "Film", title: "Russia2", cover: "suprises/covers/II. ussr october XV anniversary.jpg", pdf: "suprises/books/Russia1.pdf", color: "rgba(0,0,139,0.7)" },
  { section: "History", title: "Russia3", cover: "suprises/covers/III. look me in the eye and answer honestly.jpg", pdf: "suprises/books/Russia1.pdf", color: "rgba(0,139,0,0.7)" },
  { section: "Film", title: "Russia4", cover: "suprises/covers/IV. international solidarity.jpg", pdf: "suprises/books/Russia1.pdf", color: "rgba(139,69,19,0.7)" },
];

// Build book grid
books.forEach(b => {
  const div = document.createElement("div");
  div.className = "book";
  div.dataset.pdf = b.pdf;

  div.innerHTML = `
    <img src="${b.cover}" alt="${b.title}">
    <span style="background-color: ${b.color || 'rgba(0,0,0,0.6)'}">${b.title}</span>
  `;

  div.addEventListener("click", () => {
    if (currentBook) return;

    currentBook = div;
    div.classList.add("checked-out");
    bookGrid.querySelectorAll(".book").forEach(book => {
      if (book !== div) book.classList.add("locked");
    });
    div.classList.add("picked-up");

    // Show PDF reader and force on top
    pdfReader.style.display = "flex";
    pdfReader.style.zIndex = "2000";

    // Set header info
    pdfSectionEl.textContent = b.section || "";
    pdfWorkTitleEl.textContent = b.title || "";

    // Load PDF at 100% zoom
    pdfFrame.src = b.pdf + "#zoom=100";
    pdfFrame.style.width = "95%";
    pdfFrame.style.height = "95%";
  });

  bookGrid.appendChild(div);
});
