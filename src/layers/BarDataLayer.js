orb.BarDataLayer = function ( markers, texture ) {

	var palette = [
		0xd9d9d9, 0xb6b4b5, 0x9966cc, 0x15adff, 0x3e66a3,
		0x216288, 0xff7e7e, 0xff1f13, 0xc0120b, 0x5a1301, 0xffcc02,
		0xedb113, 0x9fce66, 0x0c9a39,
		0xfe9872, 0x7f3f98, 0xf26522, 0x2bb673, 0xd7df23,
		0xe6b23a, 0x7ed3f7];

	var colors = [];



	orb.Layer.call( this );
	//this.scene = new THREE.Scene();
	//this.scene.fog = new THREE.Fog( 0x000000, 100, 300 );

	var geometry = new THREE.Geometry();
	var material = new THREE.MeshBasicMaterial({
		color: 0xd56c2f,
		depthWrite: false,
		depthTest: false,
		blending: THREE.AdditiveBlending,
		vertexColors: THREE.FaceColors,
		transparent: true
	});

	var coordinate = new orb.Coordinate();
	var zero = new THREE.Vector3();

	var cube = new THREE.BoxGeometry( 1, 1, 1 );
	var box = new THREE.Mesh( cube, undefined );


	for ( var i = 0; i < markers.length; i += 4 ) {

		var lat = markers[ i ];
		var lng = markers[ i + 1 ];
		var size = Math.max( markers[ i + 2 ] * 200, 0.1 );
		var color = markers[ i + 3 ];
		var c = new THREE.Color( palette[ color ] );

		for (var j = 0; j < cube.faces.length; j++) {

			cube.faces[ j ].color = c;

		}

		coordinate.set( lat, lng );
		coordinate.toVector3( orb.Constants.Atmosphere.outerRadius, box.position );

		box.scale.set( 0.5, 0.5, size );
		box.lookAt(zero);

		box.updateMatrix();
		geometry.merge( box.geometry, box.matrix );
	}

	var mesh = new THREE.Mesh( geometry, material );
	this.scene.add(mesh);

};

orb.BarDataLayer.prototype = Object.create( orb.Layer.prototype );