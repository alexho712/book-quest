/*
    Citation Scope: Delete a row of data in our database
    Date: 8/10/2023
    Originality: Adapted from starter code
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function deleteCustomer(customerID) {
    let link = '/delete-customer-ajax/';
    let data = {
      customer_id: customerID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(customerID);
      }
    });
  }
  
  function deleteRow(customerID){
      let table = document.getElementById("customers-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == customerID) {
              table.deleteRow(i);
              deleteDropDownMenu(customerID);
              break;
         }
      }
  }

  function deleteDropDownMenu(customerID){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(customerID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }