orb.SpaceParticleLayer = function ( coordinates ) {

	orb.Layer.call( this );

	var geometry = new THREE.Geometry();
	var material = new THREE.PointCloudMaterial( {
		sizeAttenuation: false,
		color: 0xffffff,
		size: 1
	});

	for ( var i = 0; i < coordinates.length; i += 3 ) {

		var x = coordinates[ i ];
		var y = coordinates[ i + 1 ];
		var z = coordinates[ i + 2 ];

		geometry.vertices.push( new THREE.Vector3( x, y, z ) );
	}

	var cloud = new THREE.PointCloud( geometry, material );
	this.scene.add( cloud );

	var axis = new THREE.AxisHelper( 100 );
	this.scene.add( axis );

};

orb.SpaceParticleLayer.prototype = Object.create( orb.Layer.prototype );