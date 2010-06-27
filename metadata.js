var http = require('http');
var events = require('events');

var service = require('./lib/service');
var parse = require('./lib/parse');
var transform = require('./lib/transform');

exports.searchForTrack = function(track, callback) {
	return createController('search', 'track', track, callback);
};

exports.searchForArtist = function(artist, callback) {
	return createController('search', 'artist', artist, callback);
};

exports.searchForAlbum = function(album, callback) {
	return createController('search', 'album', album, callback);
};

exports.lookup = function(uri, callback)
{
	var kind = uri.split(':')[1];

	return createController('lookup', kind, uri, callback);
}

var createController = function(operation, type, query, callback) {
	var instance = new events.EventEmitter;

	instance.type = type;
	instance.query = query;
	instance.callback = callback;

	var parser = parse
		.createParser(instance.type)
		.addListener(instance.type, function(node) {
			var obj = transform.nodeToJSON(node);
			instance.emit(instance.type, obj);
		})
		.addListener('done', function() {
			instance.emit('done');
		})
		.addListener('error', function(msg) {
			instance.emit('error', msg);
		});

	var client = service
		.createClient()
		.addListener('data', function(chunk) {
			parser.parse(chunk);
		})
		.addListener('error', function(msg) {
			instance.emit('error', msg);
		});

	instance.addListener(instance.type, function(item) {
		instance.callback(item);
	});

	instance.execute = function() {
		if (operation == 'search') {
			client.search(instance.type + '.xml', instance.query);
		}
		else if (operation == 'lookup') {
			client.lookup(instance.query);
		}
	}

	return instance;
}
