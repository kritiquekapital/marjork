import { Draggable } from './draggable.js';

const newsButton = document.querySelector(".news-button");
const bookcaseWrapper = document.getElementById("bookcaseWrapper");
const bookcaseBackdrop = document.getElementById("bookcaseBackdrop");
const closeBookcaseBtn = document.getElementById("closeBookcase");
const bookcase = document.getElementById("bookcase");

// Make draggable like music player
new Draggable(bookcase, '.bookcase-header');

function openBookcase() {
  bookcaseWrapper.style.display = "block";
}

function closeBookcase() {
  bookcaseWrapper.style.display = "none";
}

// Open on News button click
newsButton.addEventListener("click", openBookcase);

// Close on backdrop or X click
bookcaseBackdrop.addEventListener("click", closeBookcase);
closeBookcaseBtn.addEventListener("click", closeBookcase);

// Optional: stop propagation if clicking inside
bookcase.addEventListener("click", (e) => e.stopPropagation());

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

