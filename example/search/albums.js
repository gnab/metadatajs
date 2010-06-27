var sys = require('sys');
var metadata = require('../../metadata');

var search = metadata
	.searchForAlbum('cars', function(album) {
		sys.puts(album.name + ' by ' + album.artist.name);
	})
	.addListener('done', function() {
		sys.puts('Search complete');
	})
	.addListener('error', function(msg) {
		sys.puts('Error: ' + msg);
	})
	.execute();
