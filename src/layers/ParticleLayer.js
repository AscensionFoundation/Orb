orb.ParticleLayer = function ( markers, texture ) {

	orb.Layer.call( this );

	var material = new THREE.MeshBasicMaterial( {
		color: 0xd56c2f,
		map: THREE.ImageUtils.loadTexture( texture ),
		transparent: true,
		blending: THREE.AdditiveBlending,
		depthWrite: false,
		side: THREE.DoubleSide
	} );
	var coordinate = new orb.Coordinate();
	var zero = new THREE.Vector3();

	for ( var i = 0; i < markers.length; ++i ) {

		var size = ( markers[i].size || 1 ) / 5;
		var geometry = new THREE.PlaneBufferGeometry(size, size);
		var mesh = new THREE.Mesh( geometry, material );

		coordinate.set(markers[i].lat, markers[i].lng);
		coordinate.toVector3(orb.Constants.Atmosphere.outerRadius, mesh.position);

		mesh.lookAt(zero);

		this.scene.add(mesh);

	}



};

orb.ParticleLayer.prototype = Object.create( orb.Layer.prototype );