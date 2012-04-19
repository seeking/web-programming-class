$(function() {
	
	$.getJSON('http://localhost/~george/albums.php?jsoncallback=?',function(data) {
		
		for(i=0;i<data.albums.length;i++) {
			thisAlbum = data.albums[i];
			
			// make the row element
			var row = $('<tr/>');
			
			// add the thumbnail cell
			var cvrImg = $('<img/>').attr('src',thisAlbum.coverUrl).addClass('thumb');
			$('<td/>').addClass('thumb').append(cvrImg).appendTo(row);
			
			// add the artist cell
			$('<td/>').addClass('artist').text(thisAlbum.artist).appendTo(row);
			
			// add the title cell
			$('<td/>').addClass('title').text(thisAlbum.title).appendTo(row);
			
			// add the year cell
			$('<td/>').addClass('year').text(thisAlbum.year).appendTo(row);
			
			
			// add the row to the table body
			row.appendTo($('#albums'));
		}
		
	});
	
});