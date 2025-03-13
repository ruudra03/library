// Library initialisation
let library = [];

// Book constructor
function Book(id, title, author, pages) {
  if (!new.target) {
    throw new Error("You must use the 'new' operator to call the constructor");
  }

  this.id = id;
  this.title = title; // Name of the book
  this.author = author; // Writer of the book
  this.pages = pages; // Total number of pages in the book
  this.isRead = false; // Is the book read from the library (deafault value is false)
}

// Set Book is read flag to true
Book.prototype.isReadTrue = function () {
  this.isRead = true;
};

// Get Book HTML element
Book.prototype.htmlString = function () {
  let htmlString = `
      <div class="book-record">
        <span class="book-id">${this.id}</span>
        <span class="book-is-read ${this.isRead ? "read" : "not-read"}">${
    this.isRead ? "Read" : "Not Read"
  }</span>
      </div>
      <div class="book-info">
        <span class="title">${this.title}</span>
        <span class="author">by ${this.author}</span>
        <span class="pages">(${this.pages} pages)</span>
      </div>
    `;

  return htmlString;
};

// Load stored library data
document.addEventListener("DOMContentLoaded", function () {
  // Fetch local JSON file
  fetch("./data.json")
    .then(function (res) {
      if (!res.ok) {
        throw new Error(`HTTP error! ${res.statusText}`);
      }

      return res.json(); // Parse JSON data
    })
    .then(function (data) {
      // Render book elements from the library
      renderLibrary(data);
    })
    .catch(function (err) {
      console.error(`Fetch failed! ${err}`);
    });
});

// Render books from library to HTML as elements
function renderLibrary(libraryData) {
  const container = document.querySelector("#library");

  // Reset container in case of repeated fetch
  container.innerHTML = "";

  // Create book elements from library
  libraryData.forEach(function (book) {
    // Add new Book object to library
    addBookToLibrary(book.id, book.title, book.author, book.pages, book.isRead);
  });
}

// Add Book to library
function addBookToLibrary(id, title, author, pages, isRead) {
  let newBookId;

  // Check if ID is provided
  if (id) {
    newBookId = id;
  } else {
    // Generate unique id
    newBookId = crypto.randomUUID();
  }

  // Create new book using Book constructor
  let newBook = new Book(newBookId, title, author, pages);

  // Mark read if required i.e., change default value of false
  if (isRead) {
    newBook.isReadTrue();
  }

  // Add to Library array
  library.push(newBook);

  // Add book element to HTML
  const container = document.querySelector("#library");
  let bookElement = document.createElement("div");
  bookElement.classList.add("book"); // Add CSS class

  bookElement.innerHTML = newBook.htmlString();

  // Append book element to library
  container.appendChild(bookElement);

  return newBook;
}

// Add event listener for the add new button to display new book form dialog
const newBookBtn = document.querySelector("#newBookBtn");
const newBookDialog = document.querySelector("#newBookDialog");
const dialogCloseBtn = document.querySelector("#closeBtn");
const newBookForm = document.querySelector("#newBookForm");

console.log(newBookForm.elements["bookIsRead"].value);

newBookBtn.addEventListener("click", function () {
  // Display dialog
  newBookDialog.showModal();
});

// Listen for cancel inside the dialog
dialogCloseBtn.addEventListener("click", function (e) {
  newBookDialog.close();
});

// Listen for new book form submission
newBookForm.addEventListener("submit", function (e) {
  // Stop form submission
  e.preventDefault();

  let bookTitle = newBookForm.elements["bookTitle"].value;
  let bookAuthor = newBookForm.elements["bookAuthor"].value;
  let bookPages = newBookForm.elements["bookPages"].value;
  let bookIsRead = newBookForm.elements["bookIsRead"].value;

  console.log(bookIsRead);

  addBookToLibrary(null, bookTitle, bookAuthor, bookPages, bookIsRead);

  // Close the dialog
  newBookDialog.close();
});
