const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user. Username and password required."});
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Send the books object as a formatted JSON string
  res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Retrieve the ISBN from request parameters
  const isbn = req.params.isbn;
  
  // Check if the book exists
  if (books[isbn]) {
    res.send(books[isbn]);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  
  // Get all the keys (ISBNs) from books object
  let bookKeys = Object.keys(books);
  let booksByAuthor = [];
  
  // Iterate through all books and check if author matches
  bookKeys.forEach((key) => {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  });
  
  // Check if any books were found
  if (booksByAuthor.length > 0) {
    res.send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    res.status(404).json({message: "No books found by this author"});
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  
  // Get all the keys (ISBNs) from books object
  let bookKeys = Object.keys(books);
  let booksByTitle = [];
  
  // Iterate through all books and check if title matches
  bookKeys.forEach((key) => {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  });
  
  // Check if any books were found
  if (booksByTitle.length > 0) {
    res.send(JSON.stringify(booksByTitle, null, 4));
  } else {
    res.status(404).json({message: "No books found with this title"});
  }
});

// Task 5: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Check if the book exists
  if (books[isbn]) {
    // Send the reviews for the book
    res.send(books[isbn].reviews);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

// ============================================
// ASYNC/AWAIT VERSIONS (Tasks 10-13)
// ============================================

// Task 10: Get all books using async callback
public_users.get('/async', async function (req, res) {
  try {
    // Simulate async operation with Promise
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
    
    const bookList = await getBooks;
    res.send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching books"});
  }
});

// Task 11: Get book details based on ISBN using async callback
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    
    // Simulate async operation with Promise
    const getBookByISBN = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });
    
    const book = await getBookByISBN;
    res.send(JSON.stringify(book, null, 4));
  } catch (error) {
    res.status(404).json({message: error});
  }
});

// Task 12: Get book details based on Author using async callback
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    
    // Simulate async operation with Promise
    const getBooksByAuthor = new Promise((resolve, reject) => {
      let bookKeys = Object.keys(books);
      let booksByAuthor = [];
      
      bookKeys.forEach((key) => {
        if (books[key].author === author) {
          booksByAuthor.push(books[key]);
        }
      });
      
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject("No books found by this author");
      }
    });
    
    const bookList = await getBooksByAuthor;
    res.send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(404).json({message: error});
  }
});

// Task 13: Get book details based on Title using async callback
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    
    // Simulate async operation with Promise
    const getBooksByTitle = new Promise((resolve, reject) => {
      let bookKeys = Object.keys(books);
      let booksByTitle = [];
      
      bookKeys.forEach((key) => {
        if (books[key].title === title) {
          booksByTitle.push(books[key]);
        }
      });
      
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject("No books found with this title");
      }
    });
    
    const bookList = await getBooksByTitle;
    res.send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(404).json({message: error});
  }
});

module.exports.general = public_users;