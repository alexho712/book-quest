/*
    Citation Scope: Delete a row of data in our database
    Date: 8/10/2023
    Originality: Adapted from starter code
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function deleteOrder(orderID) {
    let link = '/delete-order-ajax/';
    let data = {
      order_id: orderID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(orderID);
      }
    });
  }
  
  function deleteRow(orderID){
      let table = document.getElementById("orders-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == orderID) {
              table.deleteRow(i);
              deleteDropDownMenu(orderID);
              break;
         }
      }
  }

  function deleteDropDownMenu(orderID){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(orderID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }