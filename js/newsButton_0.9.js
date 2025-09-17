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

// Make draggable
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

// Book list
const books = [
  { title: "Russia1", cover: "suprises/covers/I. each productivist needs to read his newspaper.jpg", pdf: "suprises/books/Russia1.pdf" },
  { title: "Russia1", cover: "suprises/covers/II. ussr october XV anniversary.jpg", pdf: "suprises/books/Russia1.pdf" },
  { title: "Russia1", cover: "suprises/covers/III. look me in the eye and answer honestly.jpg", pdf: "suprises/books/Russia1.pdf" },
  { title: "Russia1", cover: "suprises/covers/IV. international solidarity.jpg", pdf: "suprises/books/Russia1.pdf" },
];

let currentBook = null;

// Build book grid and handle clicks
books.forEach(b => {
  const div = document.createElement("div");
  div.className = "book";
  div.dataset.pdf = b.pdf;
  div.innerHTML = `<img src="${b.cover}" alt="${b.title}"><span>${b.title}</span>`;

  div.addEventListener("click", () => {
    if (currentBook) return; // only one book at a time

    currentBook = div;
    div.classList.add("checked-out"); // dim/lock visually
    bookGrid.querySelectorAll(".book").forEach(book => {
      if (book !== div) book.classList.add("locked");
    });

    div.classList.add("picked-up"); // animate

    pdfFrame.src = b.pdf + "#view=FitH";
    pdfReader.style.display = "block";
  });

  bookGrid.appendChild(div);
});


