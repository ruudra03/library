// Log success message
console.log("JavaScript loaded.");

// Library Object Initialisation
let library = [];

// Book constructor
function Book(id, title, author, pages) {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }

  this.id = id;
  this.title = title; // Name of the book
  this.author = author; // Writer of the book
  this.pages = pages; // Total number of pages in the book
  this.isRead = false; // Is the book read from the library (deafault value is false)
}

// Get Book information
Book.prototype.info = function () {
  let infoString = `${this.title} by ${this.author}, ${this.pages} pages, ${
    this.isRead ? "read" : "not read yet"
  }`;

  return infoString;
};

// Set Book is read flag to true
Book.prototype.isReadTrue = function () {
  this.isRead = true;
};

// Add Book to library
function addBookToLibrary(title, author, pages, isRead) {
  // Generate unique id
  const ID = crypto.randomUUID();

  // Create new book using Book constructor
  let newBook = new Book(ID, title, author, pages);

  // Mark read if required i.e., change default value of false
  if (isRead) {
    newBook.isReadTrue();
  }

  // Add to Library array
  library.push(newBook);

  return newBook;
}

// "The Hobbit" example
console.log(addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295));
