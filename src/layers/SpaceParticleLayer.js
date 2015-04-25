// star map

orb.SpaceParticleLayer = function ( coordinates ) {

	orb.Layer.call( this );

	var attributes = {

		size: {	type: 'f', value: [] },
		ca:   {	type: 'c', value: [] }

	};

	var uniforms = {

		amplitude: { type: "f", value: 1.0 },
		color:     { type: "c", value: new THREE.Color( 0xffffff ) },
		texture:   { type: "t", value: THREE.ImageUtils.loadTexture( "textures/sprites/disc.png" ) },

	};

	//uniforms.texture.value.wrapS = uniforms.texture.value.wrapT = THREE.RepeatWrapping;

	var material = new THREE.ShaderMaterial( {

		uniforms:       uniforms,
		attributes:     attributes,
		vertexShader:   orb.Constants.Vertex.Stars,
		fragmentShader: orb.Constants.Fragment.Stars,
		transparent:    true

	});



	var geometry = new THREE.Geometry();
	var size = attributes.size.value;
	var color = attributes.ca.value;

	for ( var i = 0; i < coordinates.length; i += 5 ) {

		var x = coordinates[ i ];
		var y = coordinates[ i + 1 ];
		var z = coordinates[ i + 2 ];
		var ci = coordinates[ i + 3 ];
		var absmag = coordinates[ i + 4 ];


		var bv = Math.floor(( ci + 0.4 ) / ( 0.4 + 5.46 ) * ( orb.Constants.BV.length ));

		geometry.vertices.push( new THREE.Vector3( x, y, z ).multiplyScalar(1000000) );
		size.push( absmag );
		color.push( new THREE.Color( orb.Constants.BV[ bv ] ));

	}

	var cloud = new THREE.PointCloud( geometry, material );
	this.scene.add( cloud );

	var axis = new THREE.AxisHelper( 100 );
	this.scene.add( axis );

};

orb.SpaceParticleLayer.prototype = Object.create( orb.Layer.prototype );