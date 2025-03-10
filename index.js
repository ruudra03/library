// Log success message
console.log("JavaScript loaded.");

// Book constructor
function Book(title, author, pages) {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }

  this.title = title; // Name of the book
  this.author = author; // Writer of the book
  this.pages = pages; // Total number of pages in the book
  this.isRead = false; // Is the book read from the library
}

// Get Book information
Book.prototype.info = function () {
  let infoString = `${this.title} by ${this.author}, ${this.pages} pages, ${
    this.isRead ? "read" : "not read yet"
  }`;

  return infoString;
};
