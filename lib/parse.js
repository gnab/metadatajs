var events = require('events');
var dom = require('../vendor/jsdom/lib/jsdom').dom.level1.core;
var xml = require('../vendor/node-xml/lib/node-xml')

exports.createParser = function() {
	var instance = new events.EventEmitter;

	instance.document = new dom.Document();
	var currentElement = instance.document;

	instance.parser = new xml.SaxParser(function(p) {
		
		p.onStartElementNS(function(elem, attrs, prefix, uri, namespaces) {
			var element = instance.document.createElement(elem);
			
			attrs.forEach(function(attr) {
				element.setAttribute(attr[0], attr[1]);
			});

			currentElement.appendChild(element);
			currentElement = element;
		});

		p.onEndElementNS(function(elem, prefix, uri) {
			if (currentElement == instance.document) {
				instance.emit('done');
			}
			else {
				instance.emit('element', currentElement);
			}

			currentElement = currentElement.parentNode;
		});

		p.onCharacters(function(chars) {
			currentElement.text = chars;
		});

		p.onError(function(msg) {
			instance.emit('error', msg);
		});

	});

	instance.parse = function(str) {
		instance.parser.parseString(str);
	}

	return instance;
}
