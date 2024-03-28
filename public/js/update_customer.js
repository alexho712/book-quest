/*
    Citation Scope: Update a row of data in our database
    Date: 8/10/2023
    Originality: Adapted from starter code
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let updateCustomerForm = document.getElementById('update-customer-form-ajax');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("mySelect");
    let inputAddress = document.getElementById("input-address-update");
    let inputPhone = document.getElementById("input-phone-update");
    let inputCount = document.getElementById("input-count-update");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let addressValue = inputAddress.value;
    let phoneValue = inputPhone.value;
    let countValue = inputCount.value;
    
    // currently the database table for customers does not allow updating values to NULL
    // so we must abort if being passed NULL for total order count.

    if (isNaN(countValue)) 
    {
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        customer_name: nameValue,
        address: addressValue,
        phone_number: phoneValue,
        total_order_count: countValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-customer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, nameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})


function updateRow(data, customerID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("customers-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == customerID) {

            // Get the location of the row where we found the matching customer ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
       
            // Get td of Address value
            let address_td = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign Address to our value we updated to
            address_td.innerHTML = parsedData[0].address; 

            // Get td of Phone number value
            let phone_td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign Price to our value we updated to
            phone_td.innerHTML = parsedData[0].phone_number; 

            // Get td of Total order count value
            let count_td = updateRowIndex.getElementsByTagName("td")[4];

            // Reassign Total order count to our value we updated to
            count_td.innerHTML = parsedData[0].total_order_count; 
        }
    }
}