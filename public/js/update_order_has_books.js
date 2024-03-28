/*
    Citation Scope: Update a row of data in our database
    Date: 8/10/2023
    Originality: Adapted from starter code
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let updateOrderHasBooksForm = document.getElementById('update-order-has-books-form-ajax');

// Modify the objects we need
updateOrderHasBooksForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderHasBooks = document.getElementById("mySelect");
    let inputBook = document.getElementById("input-book-update");
    let inputOrder = document.getElementById("input-order-update");
    let inputQuantity = document.getElementById("input-quantity-update");

    // Get the values from the form fields
    let orderHasBooksValue = inputOrderHasBooks.value;
    let bookValue = inputBook.value;
    let orderValue = inputOrder.value;
    let quantityValue = inputQuantity.value;

    // currently the database table for orders does not allow updating values to NULL
    // so we must abort if being passed NULL for total order count.

    if (isNaN(bookValue)) 
    {
        return;
    }
    if (isNaN(orderValue)) 
    {
        return;
    }
    if (isNaN(quantityValue)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        order_has_books_id: orderHasBooksValue,
        book_id: bookValue,
        order_id: orderValue,
        quantity: quantityValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-order-has-books-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, orderHasBooksValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


function updateRow(data, orderHasBooksID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("order-has-books-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == orderHasBooksID) {

            // Get the location of the row where we found the matching order ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
       
            // Get td of book id value
            let book_td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign book id to our value we updated to
            book_td.innerHTML = parsedData[0].book_id; 

            // Get td of order id value
            let order_td = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign order id to our value we updated to
            order_td.innerHTML = parsedData[0].order_id; 

            // Get td of quantity value
            let quantity_td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign quantity to our value we updated to
            quantity_td.innerHTML = parsedData[0].quantity; 
        }
    }
}