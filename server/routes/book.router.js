const express = require('express');
const router = express.Router();

const pool = require('../modules/pool');

// Get all books
router.get('/', (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool.query(queryText).then(result => {
    // Sends back the results in an object
    res.send(result.rows);
  })
  .catch(error => {
    console.log('error getting books', error);
    res.sendStatus(500);
  });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post('/',  (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool.query(queryText, [newBook.author, newBook.title])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status
router.put('/:id',  (req, res) => {
  let book = req.body; // Book with updated content
  let id = req.params.id; // id of the book to update
  // TODO - REPLACE BELOW WITH YOUR CODE
  console.log(`Updating book ${id} with `, book.status);
  let sqlText = '';
  // if statement checks book status, and changes it to the opposite
  if (book.status === 'Want to Read') {
    sqlText = `UPDATE books SET status='Finished' WHERE id=$1;`
  } else {
    sqlText = `UPDATE books SET status='Want to Read' WHERE id=$1;`
  }
  pool.query(sqlText, [id])
    .then((result) => {
        res.sendStatus(200);
    })
    .catch( (error) => {
        console.log('error from db', error);
        res.sendStatus(500);
    })
});

// TODO - DELETE 
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
router.delete('/:id',  (req, res) => {
  let id = req.params.id; // id of the thing to delete
  console.log('Delete route called with id of', id);

  // TODO - REPLACE BELOW WITH YOUR CODE
  let sqlText = `DELETE FROM books WHERE id=$1;`;
  pool.query(sqlText, [id])
      .then( (result) => {
          console.log('got back', result.rows);
          res.send(result.rows);
      })
      .catch( (error) => {
          console.log('error from db', error);
          res.sendStatus(500);
      })
});

module.exports = router;
