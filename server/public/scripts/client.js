$(document).ready(function(){
  console.log('jQuery sourced.');
  // get all the books on page load
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $('#bookShelf').on('click', '.btn-delete', deleteBook)
  // call the readBook function if they click the button that they have read the book
  $('#bookShelf').on('click', '.btn-read', readBook)
  // TODO - Add code for edit & delete buttons
}

// trigger the delete route when delete button is pushed
function deleteBook() {
  console.log('deleting a book');
  // find the closest table row. It will contain everything about the book
  let book = $(this).closest('tr').data('book');
  // save the row so we can delete from dom after deleting from server
  // "this" needs to be inside of this function in order to select
  // the correct element 
  let row = this.closest('tr');
    console.log('book is selected as', book);
    $.ajax({
      type: 'DELETE',
      url: `/books/${book.id}`
    }).then(function (response) {
      // get rid of the row once we get success message from server
      $(row).empty();
      // get the updated book list from the server
      refreshBooks()
      // catch errors
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to delete book at this time. Please try again later.');
    });
}

// called when the mark as read button is pressed
function readBook() {
  console.log('read a book');
  // save the book data from the row
  let book = $(this).closest('tr').data('book');
  console.log(`changing status for ${book.title}...`);

  $.ajax({
    method: 'PUT',
    // go to the the put route with the book id
    url: `/books/${book.id}`,
    // send the current read/unread status along with
    data: {status: book.status}
  }).then(function (response) {
    // update the dom after success
    refreshBooks();
    // catch errors
  }).catch( (error) => {
    console.log('error from db', error);
    res.sendStatus(500);
  })
}

// submit new book function from original code
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
    let $tr = $('<tr></tr>');
    $tr.data('book', book);
    $tr.append(`<td><button class="btn-delete">Delete</button></td>`);
    if (book.status === 'Want to Read') {
      // apply same class to button either way. server will figure
      // out toggling the status
      $tr.append(`<td><button class="btn-read read">Mark as read</button></td>`);
    } else {
      $tr.append(`<td><button class="btn-read unread">Mark as unread</button></td>`);
    }
    $tr.append(`<td>${book.title}</td>`);
    $tr.append(`<td>${book.author}</td>`);
    $('#bookShelf').append($tr);
  }
}
