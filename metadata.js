var sys = require('sys');
var http = require('http');
var events = require('events');

var service = require('./lib/service');
var parse = require('./lib/parse');
var transform = require('./lib/transform');

module.exports = {
	searchForTrack : function(track, callback) {
		return new Controller('search', 'track', track, callback);
	},
	searchForArtist : function(artist, callback) {
		return new Controller('search', 'artist', artist, callback);
	},
	searchForAlbum : function(album, callback) {
		return new Controller('search', 'album', album, callback);
	},
	lookup : function(uri, callback) {
		var kind = uri.split(':')[1];
		return new Controller('lookup', kind, uri, callback);
	}
};

Controller.prototype.__proto__ = events.EventEmitter.prototype;

function Controller(operation, type, query, callback) {
	this.operation = operation;
	this.type = type;
	this.query = query;
	this.callback = callback;

	var self = this;

	this.parser = parse.createParser()
		.addListener('element', function(element) {
			if (elementIsOfType(element, type)) {
				var obj = transform.elementToJSON(element);
				callback(obj);
			}
		})
		.addListener('done', function() {
			self.emit('done');
		})
		.addListener('error', function(msg) {
			self.emit('error', msg);
		});

	this.client = service.createClient()
		.addListener('data', function(chunk) {
			self.parser.parse(chunk);
		})
		.addListener('error', function(msg) {
			self.emit('error', msg);
		});
}

Controller.prototype.execute = function() {
	switch (this.operation) {
		case 'search':
			this.client.search(this.type + '.xml', this.query);
			break;
		case 'lookup':
			this.client.lookup(this.query);
			break;
	}
}

function elementIsOfType(element, type) {
	var rootElement = element.ownerDocument.documentElement;

	return element.name == type && 
		(element == rootElement || element.parentNode == rootElement);
}
