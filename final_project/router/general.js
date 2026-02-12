const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to check if the user exists
const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
  
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Send JSON response with formatted books data
  console.log("/");
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Retrieve the isbn parameter from the request URL and send the corresponding books's details
  console.log("/isbn/:isbn");
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  // Getting the book details based on the author
  console.log("/author/:author");
  const author = req.params.author;

  let authorBooks = [];

  for (const isbn in books) {
    if (books[isbn].author === author) {
      authorBooks.push(books[isbn]);
    }
  }
  if (authorBooks.length > 0) {
    res.send(authorBooks);
  } else {
    return res.status(200).json({ message: "No books found for the author " + author });
  }

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  // getting the book details based on the title
  console.log("/title/:title");
  const title = req.params.title;

  let titleBooks = [];

  for (const isbn in books) {
    if (books[isbn].title === title) {
      titleBooks.push(books[isbn]);
    }
  }

  if (titleBooks.length > 0) {
    res.send(titleBooks);
  } else {
    return res.status(200).json({ message: "No books found with the title " + title });
  }

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  console.log("/review/:isbn");
  const isbnReq = req.params.isbn;

  let reviews = null;

  for (const isbn in books) {
    if (isbn === isbnReq) {
      reviews = books[isbn].reviews;
    }
  }

  if (reviews) {
    res.send(reviews);
  } else {
    return res.status(200).json({ message: "No reviews found for the isbn " + isbn });
  }

});

module.exports.general = public_users;
