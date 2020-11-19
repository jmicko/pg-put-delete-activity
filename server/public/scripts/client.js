$(document).ready(function(){
  console.log('jQuery sourced.');
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

function deleteBook() {
  console.log('deleting a book');
  let book = $(this).closest('tr').data('book');
    console.log('book is selected as', book);
    $(this.closest('tr')).empty();
    $.ajax({
        type: 'DELETE',
        url: `/books/${book.id}`
    }).then(function (response) {
      refreshBooks()
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to delete book at this time. Please try again later.');
    });
}

function readBook() {
  console.log('read a book');
  let book = $(this).closest('tr').data('book');
  console.log(`changing status for ${book.title}...`);

  $.ajax({
    method: 'PUT',
    url: `/books/${book.id}`,
    data: {status: book.status}
  }).then(function (response) {
    refreshBooks();
  }).catch( (error) => {
    console.log('error from db', error);
    res.sendStatus(500);
  })
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
    let $tr = $('<tr></tr>');
    $tr.data('book', book);
    $tr.append(`<td><button class="btn-delete">Delete</button></td>`);
    if (book.status === 'Want to Read') {
      $tr.append(`<td><button class="btn-read">Mark as read</button></td>`);
    } else {
      $tr.append(`<td><button class="btn-read">Mark as unread</button></td>`);
    }
    $tr.append(`<td>${book.title}</td>`);
    $tr.append(`<td>${book.author}</td>`);
    $('#bookShelf').append($tr);
  }
}
