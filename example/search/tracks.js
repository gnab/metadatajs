var sys = require('sys');
var metadata = require('../../metadata');

var search = metadata
	.searchForTrack('under the bridge', function(track) {
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

