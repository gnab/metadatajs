var events = require('events');
var http = require('http');

exports.createClient = function() {
	var instance = new events.EventEmitter;
	instance.source = http.createClient(80, 'ws.spotify.com');

	instance.search = function(kind, query) {
		var url = '/search/1/' + kind + '?q=' + query;

		instance.fetch(url);
	}

	instance.lookup = function(uri) {
		var url = '/lookup/1/?uri=' + uri;

		var kind = uri.split(':')[1];
		switch (kind) {
			case 'artist': url += '&extras=albumdetail'; break;
			case 'album': url += '&extras=trackdetail'; break;
		}

		instance.fetch(url);
	}

	instance.fetch = function(url) {	
		try {
			var request = instance.source.request('GET', url,
				{'host': 'ws.spotify.com'});
		} 
		catch(error) {
			instance.emit('error', error);
			return;
		}

		request.addListener('response', function(response) {
			if (response.statusCode == 200) {
				response.setEncoding('utf8');
				response.addListener('data', function(chunk) {
					instance.emit('data', chunk);
				});
				response.addListener('end', function() {
					instance.emit('end');
				});
			}
			else {
				instance.emit('error', 'Got status code ' + response.statusCode +
					' from ws.spotify.com');
			}
		});

		request.end();
	};
		
	return instance;
};
