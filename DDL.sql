/*
Yat Tung Ho, Brendan Baldocchi
Group 85
Project Step 3 Draft 
*/

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- CREATE TABLES TO MATCH PROJECT SCHEMA
DROP TABLE IF EXISTS Customers;
CREATE TABLE Customers (
    customer_id int NOT NULL AUTO_INCREMENT,
    customer_name varchar(255) NOT NULL,
    address varchar(255) NOT NULL,
    phone_number varchar(255) NOT NULL,
    total_order_count int DEFAULT 0 NOT NULL,
    PRIMARY KEY (customer_id)
);

DROP TABLE IF EXISTS Authors;
CREATE TABLE Authors (
    author_id int NOT NULL AUTO_INCREMENT,
    author_name varchar(255) NOT NULL,
    PRIMARY KEY (author_id)
);

DROP TABLE IF EXISTS Genres;
CREATE TABLE Genres (
    genre_id int NOT NULL AUTO_INCREMENT,
    description varchar(255) NOT NULL,
    PRIMARY KEY (genre_id)
);

DROP TABLE IF EXISTS Books;
CREATE TABLE Books (
    book_id int NOT NULL AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    author_id int NOT NULL,
    genre_id int DEFAULT NULL,
    price decimal(19,2) NOT NULL,
    stock int NOT NULL,
    PRIMARY KEY (book_id),
    FOREIGN KEY (author_id) REFERENCES Authors(author_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS Orders;
CREATE TABLE Orders (
    order_id int NOT NULL AUTO_INCREMENT,
    customer_id int NOT NULL,
    date date NOT NULL,
    books_sold int NOT NULL,
    total_price decimal(19,2) NOT NULL,
    PRIMARY KEY (order_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Order_has_Books;
CREATE TABLE Order_has_Books (
    order_has_books_id int NOT NULL AUTO_INCREMENT,
    book_id int NOT NULL,
    order_id int NOT NULL,
    quantity int NOT NULL,
    PRIMARY KEY(order_has_books_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE
);

-- CREATE AND INSERT SAMPLE DATA INTO ALL TABLES 
INSERT INTO Genres (description)
VALUES ('Fantasy'),
('Mystery'),
('Horror'),
('Romance'),
('Biography');

INSERT INTO Authors (author_name)
VALUES ('Stephen King'),
('Agatha Christie'),
('George R. R. Martin'),
('Maya Angelou'),
('Jane Austen');

INSERT INTO Books (title, author_id, genre_id, price, stock) 
VALUES ('I Know Why the Caged Bird Sings', (SELECT author_id FROM Authors WHERE author_name = 'Maya Angelou'), (SELECT genre_id FROM Genres WHERE description = 'Biography'), 29.99, 2),
('Murder on the Orient Express', (SELECT author_id FROM Authors WHERE author_name = 'Agatha Christie'), (SELECT genre_id FROM Genres WHERE description = 'Mystery'), 24.75, 4),
('Pride and Prejudice', (SELECT author_id FROM Authors WHERE author_name = 'Jane Austen'), (SELECT genre_id FROM Genres WHERE description = 'Romance'), 11.99, 2),
('Game of Thrones', (SELECT author_id FROM Authors WHERE author_name = 'George R. R. Martin'), (SELECT genre_id FROM Genres WHERE description = 'Fantasy'), 32.50, 1),
('The Shining', (SELECT author_id FROM Authors WHERE author_name = 'Stephen King'), (SELECT genre_id FROM Genres WHERE description = 'Horror'), 60.00, 3);

INSERT INTO Customers (customer_name, address, phone_number, total_order_count) 
VALUES ('Roland Miles', '5038 Preston Rd', '(460)912-0086', 0),
('Claire Hayes', '9128 Wycliff Ave', '(867)630-0269', 1),
('Harper Alvarez', '8020 N Stelling Rd', '(322)692-7263', 2),
('Jerome Hanson', '9167 Oak Ridge Ln', '(365)709-8620', 1),
('Todd Castro', '8235 Avondale Ave', '(748)411-0576', 1);

INSERT INTO Orders (customer_id, date, books_sold, total_price)
VALUES ((SELECT customer_id FROM Customers WHERE customer_name = 'Claire Hayes'), '2023-05-22', 2, 89.99), 
((SELECT customer_id FROM Customers WHERE customer_name = 'Jerome Hanson'), '2023-05-29', 1, 32.50),
((SELECT customer_id FROM Customers WHERE customer_name = 'Todd Castro'), '2023-06-09', 2, 23.98),
((SELECT customer_id FROM Customers WHERE customer_name = 'Harper Alvarez'), '2023-06-15', 1, 29.99),
((SELECT customer_id FROM Customers WHERE customer_name = 'Harper Alvarez'), '2023-07-04', 3, 74.25);

INSERT INTO Order_has_Books (book_id, order_id, quantity) 
VALUES ((SELECT book_id FROM Books WHERE title = 'The Shining'), '1', 1),
((SELECT book_id FROM Books WHERE title = 'I Know Why the Caged Bird Sings'), '1', 1),
((SELECT book_id FROM Books WHERE title = 'I Know Why the Caged Bird Sings'), '4', 1),
((SELECT book_id FROM Books WHERE title = 'Pride and Prejudice'), '3', 2),
((SELECT book_id FROM Books WHERE title = 'Murder on the Orient Express'), '5', 3);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
