/*
    Citation Scope: Update a row of data in our database
    Date: 8/1/2023
    Originality: Adapted from starter code
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let updateBookForm = document.getElementById('update-book-form-ajax');

// Modify the objects we need
updateBookForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTitle = document.getElementById("mySelect");
    let inputPrice = document.getElementById("input-price-update");
    let inputStock = document.getElementById("input-stock-update");

    // Get the values from the form fields
    let titleValue = inputTitle.value;
    let priceValue = inputPrice.value;
    let stockValue = inputStock.value;
    
    // currently the database table for books does not allow updating values to NULL
    // so we must abort if being passed NULL for price and stock

    if (isNaN(priceValue)) 
    {
        return;
    }
    if (isNaN(stockValue)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        title: titleValue,
        price: priceValue,
        stock: stockValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, titleValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


function updateRow(data, bookID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("book-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == bookID) {

            // Get the location of the row where we found the matching book ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
       
            // Get td of Price value
            let price_td = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign Price to our value we updated to
            price_td.innerHTML = parsedData[0].price; 

            // Get td of Stock value
            let stock_td = updateRowIndex.getElementsByTagName("td")[5];

            // Reassign Price to our value we updated to
            stock_td.innerHTML = parsedData[0].stock; 
        }
    }
}