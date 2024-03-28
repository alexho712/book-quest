/*
    Citation Scope: Update a row of data in our database
    Date: 8/10/2023
    Originality: Adapted from starter code
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/


// Get the objects we need to modify
let updateOrderForm = document.getElementById('update-order-form-ajax');

// Modify the objects we need
updateOrderForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrder = document.getElementById("mySelect");
    let inputCustomer = document.getElementById("input-customer-update");
    let inputDate = document.getElementById("input-date-update");
    let inputBooksSold = document.getElementById("input-books-sold-update");
    let inputTotalPrice = document.getElementById("input-total-price-update");

    // Get the values from the form fields
    let orderValue = inputOrder.value;
    let customerValue = inputCustomer.value;
    let dateValue = inputDate.value;
    let booksSoldValue = inputBooksSold.value;
    let totalPriceValue = inputTotalPrice.value;
    
    // currently the database table for orders does not allow updating values to NULL
    // so we must abort if being passed NULL for total order count.

    if (isNaN(booksSoldValue)) 
    {
        return;
    }
    if (isNaN(totalPriceValue)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        order_id: orderValue,
        customer_id: customerValue,
        date: dateValue,
        books_sold: booksSoldValue,
        total_price: totalPriceValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-order-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, orderValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


function updateRow(data, orderID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("orders-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == orderID) {

            // Get the location of the row where we found the matching order ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
       
            // Get td of customer ID value
            let customer_td = updateRowIndex.getElementsByTagName("td")[1];

            // Reassign customer ID to our value we updated to
            customer_td.innerHTML = parsedData[0].customer_id; 

            // Get td of date value
            let date_td = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign date to our value we updated to
            date_td.innerHTML = parsedData[0].date; 

            // Get td of books sold value
            let books_sold_td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign books sold to our value we updated to
            books_sold_td.innerHTML = parsedData[0].books_sold; 

            // Get td of total price value
            let total_price_td = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign total price to our value we updated to
            total_price_td.innerHTML = parsedData[0].total_price; 
        }
    }
}