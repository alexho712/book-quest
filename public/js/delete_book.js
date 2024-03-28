/*
    Citation Scope: Delete a row of data in our database
    Date: 8/2/2023
    Originality: Adapted from starter code
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function deleteBook(bookID) {
    let link = '/delete-book-ajax/';
    let data = {
      book_id: bookID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(bookID);
      }
    });
  }
  
  function deleteRow(bookID){
      let table = document.getElementById("book-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == bookID) {
              table.deleteRow(i);
              deleteDropDownMenu(bookID);
              break;
         }
      }
  }

  function deleteDropDownMenu(bookID){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(bookID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }