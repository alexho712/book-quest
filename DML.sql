/*
Yat Tung Ho, Brendan Baldocchi
Group 85
Project Step 3 Draft 
*/

-- Query to get all books with author and genre details
SELECT b.book_id, b.title, a.author_name, g.description AS genre, b.price, b.stock
FROM Books b
INNER JOIN Authors a ON b.author_id = a.author_id
INNER JOIN Genres g ON b.genre_id = g.genre_id;

-- Query to get all authors
SELECT * FROM Authors;

-- Query to add a new author to the Authors table
INSERT INTO Authors (author_name)
VALUES (:authorNameInput);

-- Query to update an author's information in the Authors table
UPDATE Authors
SET author_name = :updatedAuthorNameInput
WHERE author_id = :authorIDToUpdate;

-- Query to delete an author from the Authors table
DELETE FROM Authors WHERE author_id = :authorIDToDelete;

-- Query to get all genres
SELECT * FROM Genres;

-- Query to add a new genre to the Genres table
INSERT INTO Genres (description)
VALUES (:genreDescriptionInput);

-- Query to update a genre's information in the Genres table
UPDATE Genres
SET description = :updatedGenreDescriptionInput
WHERE genre_id = :genreIDToUpdate;

-- Query to delete a genre from the Genres table
DELETE FROM Genres WHERE genre_id = :genreIDToDelete;

-- Query to add a new book
INSERT INTO Books (title, author_id, genre_id, price, stock)
VALUES (:bookTitleInput, :authorIDInput, :genreIDInput, :priceInput, :stockInput);

-- Query to update a book's information
UPDATE Books
SET title = :updatedBookTitleInput, author_id = :updatedAuthorIDInput,
    genre_id = :updatedGenreIDInput, price = :updatedPriceInput,
    stock = :updatedStockInput
WHERE book_id = :bookIDToUpdate;

-- Query to delete a book
DELETE FROM Books WHERE book_id = :bookIDToDelete;

-- Query to get all customers
SELECT * FROM Customers;

-- Query to add a new customer to the Customers table
INSERT INTO Customers (customer_name, address, phone_number, total_order_count)
VALUES (:customerNameInput, :addressInput, :phoneNumberInput, :totalOrderCountInput);

-- Query to update a customer's information in the Customers table
UPDATE Customers
SET customer_name = :updatedCustomerNameInput,
    address = :updatedAddressInput,
    phone_number = :updatedPhoneNumberInput,
    total_order_count = :updatedTotalOrderCountInput
WHERE customer_id = :customerIDToUpdate;

-- Query to delete a customer from the Customers table
DELETE FROM Customers WHERE customer_id = :customerIDToDelete;

-- Query to get all orders with customer details
SELECT o.order_id, o.customer_id, o.date, o.books_sold, o.total_price, c.customer_name
FROM Orders o
INNER JOIN Customers c ON o.customer_id = c.customer_id;

-- Query to add a new order
INSERT INTO Orders (customer_id, date, books_sold, total_price)
VALUES (:customerIDInput, :dateInput, :booksSoldInput, :totalPriceInput);

-- Query to update an order's information
UPDATE Orders
SET customer_id = :updatedCustomerIDInput,
    date = :updatedDateInput,
    books_sold = :updatedBooksSoldInput,
    total_price = :updatedTotalPriceInput
WHERE order_id = :orderIDToUpdate;

-- Query to delete an order
DELETE FROM Orders WHERE order_id = :orderIDToDelete;

-- Query to get all order_has_books details
SELECT * FROM Order_has_Books;

-- Query to add a new entry to the Order_has_Books table
INSERT INTO Order_has_Books (book_id, order_id, quantity)
VALUES (:bookIDInput, :orderIDInput, :quantityInput);

-- Query to update an entry in the Order_has_Books table
UPDATE Order_has_Books
SET book_id = :updatedBookIDInput,
    order_id = :updatedOrderIDInput,
    quantity = :updatedQuantityInput
WHERE order_has_books_id = :orderHasBooksIDToUpdate;

-- Query to delete an entry from the Order_has_Books table
DELETE FROM Order_has_Books WHERE order_has_books_id = :orderHasBooksIDToDelete;
