/*
    Citation Scope: Delete a row of data in our database
    Date: 8/2/2023
    Originality: Adapted from starter code
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function deleteAuthor(authorID) {
    let link = '/delete-author-ajax/';
    let data = {
      author_id: authorID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(authorID);
      }
    });
  }
  
  function deleteRow(authorID){
      let table = document.getElementById("author-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == authorID) {
              table.deleteRow(i);
              deleteDropDownMenu(authorID);
              break;
         }
      }
  }

  function deleteDropDownMenu(authorID){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(authorID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }