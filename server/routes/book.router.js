const express = require('express');
const router = express.Router();

const pool = require('../modules/pool.js');

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
router.put('/books/isRead/:id', (req, res) => {
  console.log('router PUT', req.body);
  let bookId = req.params.id;
  //let isRead = req.body.isRead;
  let sqlString = `UPDATE "books" SET "isRead"=true WHERE "id"=$1;`;
  
  // if(isRead === true){
  //   sqlString;
  // }else {
  //   res.sendStatus(500);
  //   return;
  // }

  pool.query(sqlString, [bookId])
  .then((dbResults) => {
    console.log(dbResults);
    res.sendStatus(200);
  })
  .catch((error) => {
    console.log(error);
    res.sendStatus(500);
  });
});

// TODO - DELETE 
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
router.delete('/books/:id', (req, res) => {
  let reqId = req.params.id;
    console.log('Deleted request Id,', reqId);
  
  let sqlString = 'DELETE FROM "books" WHERE "id"=$1;';
  pool.query(sqlString, [reqId])
    .then((result) => {
      console.log('Book deleted.');
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(`Error making db query ${sqlString}`, error);
      res.sendStatus(500);
    });
});

module.exports = router;
