exports.elementToJSON = function(element) {
	var obj = {};
	obj.uri = element.getAttribute('href');
	
	element.children.forEach(function(child) {
		switch (child.name) {
			case 'name': 
				obj.name = child.text; 
				break;
			case 'artist': 
				obj.artist = exports.elementToJSON(child); 
				break;
			case 'album': 
				if (element.name == 'artist') {
					obj.albums = obj.albums || []
					obj.albums.push(exports.elementToJSON(child));
				}
				else {
					obj.album = exports.elementToJSON(child); 
				}
				break;
			case 'track': 
				obj.tracks = obj.tracks || []
				obj.tracks.push(exports.elementToJSON(child)); 
				break;
			case 'released': 
				obj.released = child.text; 
				break;
			case 'track-number': 
				obj.trackno = parseInt(child.text, 10); 
				break;
			case 'length': 
				obj.length = parseFloat(child.text, 10); 
				break;
			case 'popularity': 
				obj.popularity = parseFloat(child.text, 10); 
				break;
		}
	});
	
	return obj;
}
