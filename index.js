// Library initialisation
let library = [];

// Select HTML element for library
const container = document.querySelector("#library");

// Book constructor
function Book(id, title, author, pages) {
  if (!new.target) {
    throw new Error(
      "Book constructor failed! Function called without the use of 'new'"
    );
  }

  this.id = id;
  this.title = title; // Name of the book
  this.author = author; // Writer of the book
  this.pages = pages; // Total number of pages in the book
  this.isRead = false; // Is the book read from the library (deafault value is false)
}

// Set Book is read flag to true
Book.prototype.isReadToggle = function () {
  if (this.isRead) {
    this.isRead = false;
  } else {
    this.isRead = true;
  }
};

// Get Book HTML element
Book.prototype.htmlString = function () {
  let htmlString = `
      <div class="book-actions">
        <button
          class="toggle-read-btn ${this.isRead ? "read" : "not-read"}" 
          type="button"
          title="Click to ${this.isRead ? "unread" : "read"}"
          onclick="toggleReadAction(this, '${this.id}')"
        >
          Read
        </button>
        <button 
          class="remove-book-btn" 
          type="button"
          onclick="removeBookFromLibrary(this.parentElement.parentElement, '${
            this.id
          }')"
        >
            <img class="delete-icon" src="./images/delete_icon.png" alt="Delete icon">
        </button>
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
    newBook.isReadToggle();
  }

  // Add to Library array
  library.push(newBook);

  // Add book element to HTML
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

// Form inputs
let bookTitle = newBookForm.elements["bookTitle"];
let bookAuthor = newBookForm.elements["bookAuthor"];
let bookPages = newBookForm.elements["bookPages"];
let bookIsRead = newBookForm.elements["bookIsRead"];

newBookBtn.addEventListener("click", function () {
  // Display dialog
  newBookDialog.style.display = "block";
});

// Listen for cancel inside the dialog
dialogCloseBtn.addEventListener("click", function (e) {
  newBookDialog.style.display = "none";
});

//

// Listen for new book form submission
newBookForm.addEventListener("submit", function (e) {
  // Stop form submission
  e.preventDefault();

  // Remove missing-input CSS class from previous submission
  bookTitle.classList.remove("missing-input");
  bookAuthor.classList.remove("missing-input");
  bookPages.classList.remove("missing-input");

  // Check for required inputs
  if (!bookTitle.value || !bookAuthor.value || !bookPages.value) {
    // Add CSS classes to display errors
    if (!bookTitle.value) {
      bookTitle.classList.add("missing-input");
    }

    if (!bookAuthor.value) {
      bookAuthor.classList.add("missing-input");
    }

    if (!bookPages.value) {
      bookPages.classList.add("missing-input");
    }
  } else {
    // Create new book and add to the HTML library
    addBookToLibrary(
      null,
      bookTitle.value,
      bookAuthor.value,
      bookPages.value,
      bookIsRead.checked
    );

    // Reset the form
    clearFormInputs();

    // Close the dialog
    newBookDialog.style.display = "none";
  }
});

// Reset form inputs
function clearFormInputs() {
  bookTitle.value = "";
  bookAuthor.value = "";
  bookPages.value = 0;
  bookIsRead.checked = false;
}

// Book actions (Toggle read and Remove book)

// Toggle read action
function toggleReadAction(bookReadDiplay, bookId) {
  // Change CSS
  bookReadDiplay.classList.toggle("read");
  bookReadDiplay.classList.toggle("not-read");

  // Find book
  let bookSelection = library.find(function (book) {
    return book.id === bookId;
  });

  // Toggle read
  bookSelection.isReadToggle();
}

// Remove book action
function removeBookFromLibrary(bookElement, bookId) {
  // Remove element from DOM
  bookElement.remove(bookElement);

  // Remove element from library
  library.forEach(function (book, index) {
    if (book.id === bookId) {
      library.splice(index, 1);
    }
  });
}
