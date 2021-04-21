$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
  $('#bookShelf').on('click', '.delete-book', deleteBookHandler);
  $('#bookShelf').on('click', '.update-book', bookReadHandler)
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td><button class="update-book" data-id="${book.id}">I've read this!</button></td>
        <td><button class="delete-book" data-id="${book.id}">Delete Book</button></td>
      </tr>
    `);
  }
}

//passes book id to PUT/update call
function bookReadHandler(){
  isRead($(this).data("id")); //should there be a second param? true?
}

//PUT request to update that a book has been read
function isRead(bookId ){ //should there be a second param?
  $.ajax({
    method: 'PUT',
    url: `books/books/isRead/${bookId}`,
    data:{
      isRead: true
    }
  })
  .then(function(response) {
    //refresh book list with new data
    refreshBooks();
  })
  .catch(function(error) {
    alert('Error on book read.', error);
  });
}

function deleteBookHandler(){
  //call AJAX to DELETE this book
  deleteBook($(this).data("id"));
}

function deleteBook(bookId) {
  $.ajax({
      method: 'DELETE',
      url: `/books/books/${bookId}`,
  })
  .then(function (response) {
      //refresh book list
      refreshBooks();
  })
  .catch(function(error){
    alert('Error deleting book.', error);
  });
}//end deleteBook
