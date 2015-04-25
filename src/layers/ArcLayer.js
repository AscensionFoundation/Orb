// source, destination arcs

orb.ArcLayer = function ( coordinates ) {

	orb.Layer.call( this );

	var material = new THREE.LineBasicMaterial ({

		color: 0xffffff

	});

	for ( var i = 0; i < coordinates.length; ++i ) {

		var c = coordinates[ i ];
		var c0 = c[ 0 ];
		var c1 = c[ 1 ];

		var geometry = new orb.ArcGeometry( c0, c1, 100 );
		var mesh = new THREE.Line( geometry, material );

		this.scene.add( mesh );

	}

};

orb.ArcLayer.prototype = Object.create( orb.Layer.prototype );