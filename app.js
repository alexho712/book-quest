/*
    Citation Scope: Node.js CRUD operations and database connection to OSU flip servers. 
    Date: 8/1/2023
    Originality: Adapted from starter code
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

PORT        = 16954;                 // Set a port number at the top so it's easy to change in the future
// Database
var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Force price to be displayed as float to 2 decimal places
exphbs.create({}).handlebars.registerHelper('formatPrice', function(price) {
    return price.toFixed(2);
  });

/*
    ROUTES
*/                      
// Home Page
app.get('/', (request, response) => {
    response.render('index');
});


// Books Page - Read, Add, Update, Delete
app.get('/books.hbs', function(req, res)
{
    // Declare Query 1
    let query1;

    // If there is no query string, we just perform a basic SELECT
    if (req.query.title === undefined)
    {
        query1 = "SELECT * FROM Books;";
    }

    // If there is a query string, we assume this is a search, and return desired results
    else
    {
        query1 = `SELECT * FROM Books WHERE title LIKE "${req.query.title}%"`
    }

    // Query 2/3 is the same in both cases
    let query2 = "SELECT * FROM Authors;";
    let query3 = "SELECT * FROM Genres;";


    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
            
        // Save the books
        let books = rows;
            
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
                
            // Save the authors 
            let authors = rows;

            // Construct an object for reference in the table
            // Array.map is awesome for doing something with each
            // element of an array.
            let authormap = {}
            authors.map(author => {
                let id = parseInt(author.author_id, 10);

                authormap[id] = author["author_name"];
            })

            // Overwrite the author ID with the name of the author in the book object
            books = books.map(book => {
                return Object.assign(book, {author_id: authormap[book.author_id]})
            })
            
            // Run the third query
            db.pool.query(query3, (error, rows, fields) => {
                let genres = rows;
                return res.render('books', {data: books, authors: authors, genres: genres});
            })
        })
    })
});

app.post('/add-book-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let genre = parseInt(data['input-genre']);
    if (isNaN(genre))
    {
        genre = 'NULL'
    }
    
    // Create the query and run it on the database
    query1 = `INSERT INTO Books (title, author_id, genre_id, price, stock) VALUES ('${data['input-title']}', '${data['input-author']}', ${genre}, '${data['input-price']}', '${data['input-stock']}')`;
    db.pool.query(query1, function(error, rows, fields){
    
        // Check to see if there was an error
        if (error) {
    
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
    
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Books and
        // presents it on the screen
        else
        {
            res.redirect('/books.hbs');
        }
    })
});

app.delete('/delete-book-ajax/', function(req,res,next){
    let data = req.body;
    let bookID = parseInt(data.book_id);
    let deleteOrder_has_Books = `DELETE FROM Order_has_Books WHERE book_id = ?`;
    let deleteBook= `DELETE FROM Books WHERE book_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteOrder_has_Books, [bookID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteBook, [bookID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

app.put('/put-book-ajax', function(req,res,next){
    let data = req.body;

    let price = data.price;
    let stock = parseInt(data.stock);
    let title = parseInt(data.title)

    let queryUpdateBook = `UPDATE Books SET price = ?, stock = ? WHERE Books.book_id = ?`;
    let selectBook = `SELECT * FROM Books WHERE book_id = ?`

    // Run the 1st query
    db.pool.query(queryUpdateBook, [price, stock, title], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
  
        // If there was no error, we return that data so we can use it to update the books'
        // table on the front-end
        else
        {
            db.pool.query(selectBook, [title], function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
                } else {
                res.send(rows);
                }
            })
        }
    })
});

// Authors Page - Read, Add, Delete
app.get('/authors.hbs', function(req, res)
{
    // Declare Query 1
    query1 = "SELECT * FROM Authors;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        // Save the authors
        let authors = rows;
        return res.render('authors', {data: authors});
    })
});

app.post('/add-author-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Authors (author_name) VALUES ('${data['input-name']}')`;
    db.pool.query(query1, function(error, rows, fields){
    
        // Check to see if there was an error
        if (error) {
    
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
    
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Books and
        // presents it on the screen
        else
        {
            res.redirect('/authors.hbs');
        }
    })
});

app.delete('/delete-author-ajax/', function(req,res,next){
    let data = req.body;
    let authorID = parseInt(data.author_id);
    let deleteAuthor = `DELETE FROM Authors WHERE author_id = ?`;
    let deleteBook= `DELETE FROM Books WHERE author_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteBook, [authorID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteAuthor, [authorID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

// Genres Page - Read, Add, Delete 
app.get('/genres.hbs', function(req, res)
{
    // Declare Query 1
    query1 = "SELECT * FROM Genres;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        // Save the genres
        let genres = rows;
        return res.render('genres', {data: genres});
    })
});

app.post('/add-genre-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Genres (description) VALUES ('${data['input-genre']}')`;
    db.pool.query(query1, function(error, rows, fields){
    
        // Check to see if there was an error
        if (error) {
    
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
    
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Books and
        // presents it on the screen
        else
        {
            res.redirect('/genres.hbs');
        }
    })
});

app.delete('/delete-genre-ajax/', function(req,res){
    let data = req.body;
    let genreID = parseInt(data.genre_id);
    let deleteGenre= `DELETE FROM Genres WHERE genre_id = ?`;
  
  
          // Run the query
          db.pool.query(deleteGenre, [genreID], function(error, rows, fields){
              if (error) {

              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
              res.sendStatus(204);
              }
  })});

// Customers Page - Read, Add, Update, Delete
app.get('/customers.hbs', function(req, res)
{
    // Declare Query 1
    query1 = "SELECT * FROM Customers;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        // Save the customers
        let customers = rows;
        return res.render('customers', {data: customers});
    })
});

app.post('/add-customer-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (customer_name, address, phone_number) VALUES ('${data['input-customer-name']}', '${data['input-address']}', '${data['input-phone']}')`;
    db.pool.query(query1, function(error, rows, fields){
    
        // Check to see if there was an error
        if (error) {
    
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
    
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Books and
        // presents it on the screen
        else
        {
            res.redirect('/customers.hbs');
        }
    })
});

app.delete('/delete-customer-ajax/', function(req,res,next){
    let data = req.body;
    let customerID = parseInt(data.customer_id);
    let deleteCustomer = `DELETE FROM Customers WHERE customer_id = ?`;
    let deleteOrder= `DELETE FROM Orders WHERE order_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteOrder, [customerID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteCustomer, [customerID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

app.put('/put-customer-ajax', function(req,res,next){
    let data = req.body;

    let address = data.address;
    let phoneNumber = data.phone_number;
    let totalOrderCount = parseInt(data.total_order_count);
    let customerName = parseInt(data.customer_name);

    let queryUpdateCustomer = `UPDATE Customers SET address = ?, phone_number = ?, total_order_count = ? WHERE Customers.customer_id = ?`;
    let selectCustomer = `SELECT * FROM Customers WHERE customer_id = ?`;

    // Run the 1st query
    db.pool.query(queryUpdateCustomer, [address, phoneNumber, totalOrderCount, customerName], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
  
        // If there was no error, we return that data so we can use it to update the customers'
        // table on the front-end
        else
        {
            db.pool.query(selectCustomer, [customerName], function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
                } else {
                res.send(rows);
                }
            })
        }
    })
});

// Orders Page - Read, Add, Update, Delete
app.get('/orders.hbs', function(req, res)
{
    // Declare Query 1 (Orders) and 2 (Customers)
    query1 = "SELECT * FROM Orders;";
    query2 = "SELECT * FROM Customers;";

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){

        // Save the orders
        let orders = rows;

        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
                
            // Save the customers 
            let customers = rows;

            return res.render('orders', {data: orders, customers: customers});
        })
    })
});

app.post('/add-order-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Orders (customer_id, date, books_sold, total_price) VALUES ('${data['input-customer']}', '${data['input-date']}', '${data['input-books-sold']}', '${data['input-total-price']}')`;
    db.pool.query(query1, function(error, rows, fields){
    
        // Check to see if there was an error
        if (error) {
    
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
    
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Books and
        // presents it on the screen
        else
        {
            res.redirect('/orders.hbs');
        }
    })
});

app.delete('/delete-order-ajax/', function(req,res,next){
    let data = req.body;
    let orderID = parseInt(data.order_id);
    let deleteOrder = `DELETE FROM Orders WHERE order_id = ?`;
    let deleteOrderHasBooks= `DELETE FROM Order_has_Books WHERE order_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteOrderHasBooks, [orderID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteOrder, [orderID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});

app.put('/put-order-ajax', function(req,res,next){
    let data = req.body;

    let customerID = parseInt(data.customer_id);
    let date = data.date;
    let booksSold = parseInt(data.books_sold);
    let totalPrice = data.total_price;
    let orderID = parseInt(data.order_id);

    let queryUpdateOrder = `UPDATE Orders SET customer_id = ?, date = ?, books_sold = ?, total_price = ? WHERE Orders.order_id = ?`;
    let selectOrder = `SELECT * FROM Orders WHERE order_id = ?`;

    // Run the 1st query
    db.pool.query(queryUpdateOrder, [customerID, date, booksSold, totalPrice, orderID], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
  
        // If there was no error, we return that data so we can use it to update the orders'
        // table on the front-end
        else
        {
            db.pool.query(selectOrder, [orderID], function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
                } else {
                res.send(rows);
                }
            })
        }
    })
});

// Order Has Books Page - Read, Add, Update, Delete
app.get('/order_has_books.hbs', function(req, res)
{
    // Declare Query 1 (Order_has_Books) and 2 (Books) and 3 (Orders)
    query1 = "SELECT * FROM Order_has_Books;";
    query2 = "SELECT * FROM Books;";
    query3 = "SELECT * FROM Orders;";


    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
            
        // Save the order_has_books
        let order_has_books = rows;
            
        // Run the second query
        db.pool.query(query2, (error, rows, fields) => {
                
            // Save the books 
            let books = rows;

            // Run the third query
            db.pool.query(query3, (error, rows, fields) => {
                
                // Save the orders
                let orders = rows;
                return res.render('order_has_books', {data: order_has_books, books: books, orders:orders});
            })
        })
    })
});

app.post('/add-order-has-books-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Order_has_Books (book_id, order_id, quantity) VALUES ('${data['input-book']}', '${data['input-order']}', '${data['input-quantity']}')`;
    db.pool.query(query1, function(error, rows, fields){
    
        // Check to see if there was an error
        if (error) {
    
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
    
        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Books and
        // presents it on the screen
        else
        {
            res.redirect('/order_has_books.hbs');
        }
    })
});

app.delete('/delete-order-has-books-ajax/', function(req,res,next){
    let data = req.body;
    let orderHasBooksID = parseInt(data.order_has_books_id);
    let deleteOrderHasBooks= `DELETE FROM Order_has_Books WHERE order_has_books_id = ?`;
  
  
        // Run the 1st query
        db.pool.query(deleteOrderHasBooks, [orderHasBooksID], function(error, rows, fields){
            if (error) {
  
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
  
            else
            {
            res.sendStatus(204);
            }
  })});


app.put('/put-order-has-books-ajax', function(req,res,next){
    let data = req.body;

    let bookID = parseInt(data.book_id);
    let orderID = parseInt(data.order_id);
    let quantity = parseInt(data.quantity);
    let orderHasBooksID = parseInt(data.order_has_books_id);

    let queryUpdateOrderHasBooks = `UPDATE Order_has_Books SET book_id = ?, order_id = ?, quantity = ? WHERE Order_has_Books.order_has_books_id = ?`;
    let selectOrderHasBooks = `SELECT * FROM Order_has_Books WHERE order_has_books_id = ?`;

    // Run the 1st query
    db.pool.query(queryUpdateOrderHasBooks, [bookID, orderID, quantity, orderHasBooksID], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }
  
        // If there was no error, we return that data so we can use it to update the orders'
        // table on the front-end
        else
        {
            db.pool.query(selectOrderHasBooks, [orderHasBooksID], function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
                } else {
                res.send(rows);
                }
            })
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});