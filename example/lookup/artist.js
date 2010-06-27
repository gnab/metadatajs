var sys = require('sys');
var metadata = require('../../metadata');

var lookup = metadata
	.lookup('spotify:artist:0xcxjw5UveWGhL9Q6wurR3', function(artist) {
		sys.puts(artist.name);
	})
	.addListener('done', function() {
		sys.puts('Search complete');
	})
	.addListener('error', function(msg) {
		sys.puts('Error: ' + msg);
	})
	.execute();
