/*
    Citation Scope: Delete a row of data in our database
    Date: 8/2/2023
    Originality: Adapted from starter code
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function deleteGenre(genreID) {
    let link = '/delete-genre-ajax/';
    let data = {
      genre_id: genreID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(genreID);
      }
    });
  }
  
  function deleteRow(genreID){
      let table = document.getElementById("genres-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == genreID) {
              table.deleteRow(i);
              deleteDropDownMenu(genreID);
              break;
         }
      }
  }

  function deleteDropDownMenu(genreID){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(genreID)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }