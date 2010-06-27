exports.nodeToJSON = function(node) {
	var obj = {};
	obj.uri = node.getAttribute('href');
	
	node.children.forEach(function(child) {
		switch (child.name) {
			case 'name': 
				obj.name = child.text; 
				break;
			case 'artist': 
				obj.artist = exports.nodeToJSON(child); 
				break;
			case 'album': 
				if (node.name == 'artist') {
					obj.albums = obj.albums || []
					obj.albums.push(exports.nodeToJSON(child));
				}
				else {
					obj.album = exports.nodeToJSON(child); 
				}
				break;
			case 'track': 
				obj.tracks = obj.tracks || []
				obj.tracks.push(exports.nodeToJSON(child)); 
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
