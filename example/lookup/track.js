var sys = require('sys');
var metadata = require('../../metadata');

var lookup = metadata
	.lookup('spotify:track:44uMvOzyu7tMWgL8yvwnhA', function(track) {
		sys.puts(track.name + ' (' + track.album.name + ' by ' + 
			track.artist.name + ')');
	})
	.addListener('done', function() {
		sys.puts('Search complete');
	})
	.addListener('error', function(msg) {
		sys.puts('Error: ' + msg);
	})
	.execute();
