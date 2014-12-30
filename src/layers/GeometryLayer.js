
orb.GeometryLayer = function ( ) {

	orb.Layer.call( this );

	// create a bufferedgeometry from the geojson.
	// Index and created a shared geometry/index arraybuffer for all geometry
	
	// extract metadata objects for each geometry
	// create structures for efficient mouse/geometry collision


	// single line object for all outlines
	// individual geometrys for each country

	/*
	var geometry = new THREE.SphereGeometry( 10, 32, 32 );
	var material = new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture( 'textures/map-small.jpg' )
	})

	var mesh = new THREE.Mesh( geometry, material );

	this.scene.add( mesh );
	*/




	orb.textures = {
		day: THREE.ImageUtils.loadTexture( 'textures/map-small.jpg' ),
	}


	var u = function(type, value) {
		return {
			type: type,
			value: value
		};
	};

	var toBufferGeometry = function( geometry ) {

		var vertices = geometry.vertices;
		var faces = geometry.faces;

		var triangles = 0;
		for ( var i = 0; i < faces.length; i ++ ) {

			if ( faces[ i ] instanceof THREE.Face4 ) {
				triangles = triangles + 2;
			} else {
				triangles = triangles + 1;
			}

		}

		var bufferGeometry = new THREE.BufferGeometry();

		bufferGeometry.attributes = {

			index: {
				itemSize: 1,
				array: new Uint16Array( triangles * 3 )
			},
			position: {
				numItems: vertices.length * 3,
				itemSize: 3,
				array: new Float32Array( vertices.length * 3 )
			},
			normal: {
				itemSize: 3,
				array: new Float32Array( vertices.length * 3 )
			},
			uv: {
				itemSize: 2,
				array: new Float32Array( vertices.length * 2 )
			}

		};

		var indices = bufferGeometry.attributes.index.array;
		var positions = bufferGeometry.attributes.position.array;
		var normals = bufferGeometry.attributes.normal.array;
		var uv = bufferGeometry.attributes.uv.array;

		var i3 = 0;
		var n = new THREE.Vector3();

		for ( var i = 0; i < vertices.length; i ++ ) {

			var v = vertices[ i ];
			n.copy( v ).normalize();

			positions[ i3 + 0 ] = v.x;
			positions[ i3 + 1 ] = v.y;
			positions[ i3 + 2 ] = v.z;

			normals[ i3 + 0 ] = n.x;
			normals[ i3 + 1 ] = n.y;
			normals[ i3 + 2 ] = n.z;

			i3 += 3;

		}

		i3 = 0;
		for ( var i = 0; i < faces.length; i ++ ) {

			var face = faces[ i ];

			indices[ i3 + 0 ] = face.a;
			indices[ i3 + 1 ] = face.b;
			indices[ i3 + 2 ] = face.c;

			var faceUv = geometry.faceVertexUvs[0][ i ];
			uv[ face.a * 2 + 0 ] = faceUv[ 0 ].x;
			uv[ face.a * 2 + 1 ] = faceUv[ 0 ].y;
			uv[ face.b * 2 + 0 ] = faceUv[ 1 ].x;
			uv[ face.b * 2 + 1 ] = faceUv[ 1 ].y;
			uv[ face.c * 2 + 0 ] = faceUv[ 2 ].x;
			uv[ face.c * 2 + 1 ] = faceUv[ 2 ].y;

			i3 += 3;

			if ( face instanceof THREE.Face4 ) {

				indices[ i3 + 0 ] = face.c;
				indices[ i3 + 1 ] = face.d;
				indices[ i3 + 2 ] = face.a;

				i3 += 3;

			}

		}

		var offset = {
			start: 0,
			index: 0,
			count: triangles * 3
		};

		bufferGeometry.offsets = [ offset ];

		bufferGeometry.computeBoundingSphere();

		return bufferGeometry;

	};

	var atm = orb.Constants.Atmosphere;

	var uniforms = {
		v3LightPosition			: u( "v3", new THREE.Vector3(1e8, 0, 1e8).normalize() ),
		v3InvWavelength			: u( "v3", new THREE.Vector3(1 / Math.pow(atm.wavelength[0], 4), 1 / Math.pow(atm.wavelength[1], 4), 1 / Math.pow(atm.wavelength[2], 4)) ),
		fCameraHeight			: u( "f", 0 ),
		fCameraHeight2			: u( "f", 0 ),
		fInnerRadius			: u( "f", atm.innerRadius ),
		fInnerRadius2			: u( "f", atm.innerRadius * atm.innerRadius ),
		fOuterRadius			: u( "f", atm.outerRadius ),
		fOuterRadius2			: u( "f", atm.outerRadius * atm.outerRadius ),
		fKrESun					: u( "f", atm.Kr * atm.ESun ),
		fKmESun					: u( "f", atm.Km * atm.ESun ),
		fKr4PI					: u( "f", atm.Kr * 4.0 * Math.PI ),
		fKm4PI					: u( "f", atm.Km * 4.0 * Math.PI ),
		fScale					: u( "f", 1 / ( atm.outerRadius - atm.innerRadius ) ),
		fScaleDepth				: u( "f", atm.scaleDepth ),
		fScaleOverScaleDepth	: u( "f", 1 / ( atm.outerRadius - atm.innerRadius ) / atm.scaleDepth ),
		g						: u( "f", atm.g ),
		g2						: u( "f", atm.g * atm.g ),
		nSamples				: u( "i", 3 ),
		fSamples				: u( "f", 3.0 ),
		tDiffuse				: u( "t", orb.textures.day ),
		tDiffuseNight			: u( "t", orb.textures.night ),
		tClouds					: u( "t", null ),
		fNightScale				: u( "f", 1 ),
		fMultiplier				: u( "f", 1 ),
	};

	{
		var geometry = new THREE.SphereGeometry( orb.Constants.Atmosphere.innerRadius, 100, 100 );
		//var geometry = new THREE.SphereGeometry( orb.config.atmosphere.innerRadius, 5, 5, 0, Math.PI, 0, Math.PI/2 );
		//var geometry = new THREE.WebMercatorGeometry( orb.config.atmosphere.innerRadius, 100, 100 );
		// geometry = toBufferGeometry( geometry );

		var material = new THREE.ShaderMaterial({
			uniforms:		uniforms,
			vertexShader:	orb.Constants.Vertex.Earth,
			fragmentShader:	orb.Constants.Fragment.Earth
		});
		/*
		material = new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture('/debug.jpg')
		});
		*/
		// material.wireframe = true;

		var mesh = new THREE.Mesh( geometry, material );
		mesh.group = 'globe';

		this.scene.add( mesh );

	};



	{
		var geometry = new THREE.SphereGeometry( orb.Constants.Atmosphere.outerRadius, 100, 100 );
		//geometry = toBufferGeometry( geometry );

		var material = new THREE.ShaderMaterial({
			uniforms:		uniforms,
			vertexShader:	orb.Constants.Vertex.Sky,
			fragmentShader:	orb.Constants.Fragment.Sky,

			side: THREE.BackSide,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending
		});




		var mesh = new THREE.Mesh( geometry, material );
		mesh.group = 'globe';


		this.scene.add( mesh );
	};

	var light = new THREE.Vector3( 1, 1, 0 );
	var euler = new THREE.Euler( 0, 0, 0 );
	var matrix = new THREE.Matrix4();
	var camera = 0;

	this.onUpdate = function () {

		camera = orb.core.camera.position.length();
		//uniforms.v3InvWavelength.value.set(1 / Math.pow(wavelength.red, 4), 1 / Math.pow(wavelength.green, 4), 1 / Math.pow(wavelength.blue, 4) );

		light.set( 1, 0, 0 );
		light.applyMatrix4( orb.time.matrix );
		//light.copy( Orb.camera.position ).normalize();
		//light.copy( Orb.camera.position ).normalize().multiplyScalar( -1 );

		uniforms.v3LightPosition.value = light;
		uniforms.fCameraHeight.value = camera;
		uniforms.fCameraHeight2.value = camera * camera;

	};
};

orb.GeometryLayer.prototype = Object.create( orb.Layer.prototype );