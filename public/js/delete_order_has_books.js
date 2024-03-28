/*
    Citation Scope: Delete a row of data in our database
    Date: 8/10/2023
    Originality: Adapted from starter code
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function deleteOrderHasBooks(orderHasBooksID) {
    let link = '/delete-order-has-books-ajax/';
    let data = {
      order_has_books_id: orderHasBooksID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(orderHasBooksID);
      }
    });
  }
  
  function deleteRow(orderHasBooksID){
      let table = document.getElementById("order-has-books-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == orderHasBooksID) {
              table.deleteRow(i);
              deleteDropDownMenu(orderHasBooksID);
              break;
         }
      }
  }

  function deleteDropDownMenu(orderHasBooksID){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(orderHasBooksID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }