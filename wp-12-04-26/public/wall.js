var mostRecentDT = Date.now();

function updateWall(data) {
    var i;
    for (i=0;i<data.length;i++) {
      var line = $('<div/>').addClass('comment');
      $('<div/>').addClass('dt').text(data[i].dt || '').appendTo(line);
      $('<div/>').addClass('name').text(data[i].name).appendTo(line);
      $('<div/>').addClass('comment').text(data[i].comment).appendTo(line);
      line.prependTo('#theWall').addClass('hl');
    }      
}


$(function() {

  // get the wall from our API
  $.getJSON("/wall",updateWall);
  mostRecentDT = Date.now();
  
  // every 2/10 of a second, get an updated wall and refresh the view
  setInterval(function() {
    $.getJSON("/wall",{from: mostRecentDT}, updateWall);
    mostRecentDT = Date.now();
  },200);

  
  $('#name').focus();

  // when the add button is clicked, send an add comment request to our API server
  $('#addComment').click(function() {
    $.getJSON("/wall",{from: mostRecentDT, dt: mostRecentDT = Date.now(), name: $('#name').val(), comment: $('#comment').val()},updateWall);
    $('#comment').val('');
  });

  // if the return key is pressed in the comment field, fire the click event on the add button
  $('#comment').bind('keydown', function(e) {
    if (e.which == 13) {
      $('#addComment').click();
    }
  });
  

});