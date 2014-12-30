/**
 * @author axiverse / http://axiverse.com
 */
'use strict';

 var orb = orb || { revision: 0 };
/**
 * @author axiverse / http://axiverse.com
 */

orb.Core = function ( domElement ) {

	// create nested 100% element

	this.layers = [];
	this.overlays = [];	// overlay objects that get an updated position as the globe spins or moves

	this.animating = false;

	this.renderer = new THREE.WebGLRenderer( { antialias: false, logarithmicDepthBuffer: 'logzbuf' } );
	this.scene = new THREE.Scene();
	//this.scene.fog = new THREE.FogExp2( 0x000000, 0.0025 );
	//this.scene.fog = new THREE.Fog( 0x000000, 100, 300 );
	this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100000000 );

	this.camera.position.z = 300;


	var renderer = this.renderer;
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x111111, 1 );

	this.clock = new THREE.Clock();

	// attach renderer to the specified element
	// data discovery platform


	// camera
	// sunlight direction
	// virtual date
	// hmm???

	domElement.appendChild( this.renderer.domElement );

	var that = this;
	window.addEventListener( 'resize', function() {

		that.camera.aspect = window.innerWidth / window.innerHeight;
		that.camera.updateProjectionMatrix();

		that.renderer.setSize( window.innerWidth, window.innerHeight );

	}, false );

};

orb.Core.prototype = {

	constructor: orb.Core,

	setDate: function ( date ) {

		if ( date instanceof Date ) {
			this._date = date;
		}

		return this;
	},

	getDate: function ( date ) {

		if ( this._date === undefined ) {
			return Date.now();
		}

		return Date.now();
	},




	add: function ( layer ) {

		this.scene.add( layer.scene );
		this.layers.push(layer);

	},

	remove: function ( layer ) {

		this.scene.remove( layer.scene );
		var index = this.layers.indexOf(layer);

		if (index > -1) {
		    this.layers.splice(index, 1);
		}
		
	},

	start: function () {

		if ( this.animating ) {

			return;

		}

		var that = this;
		var step = function() {

			if ( that.animating ) {

				requestAnimationFrame( step );
				that.render();

			}

		};

		this.animating = true;
		requestAnimationFrame( step );

	},

	stop: function () {

		this.animating = false;

	},

	render: function () {

		if (orb.trackball != undefined) {
			orb.trackball.update();
		}

		var elapsed = this.clock.getElapsedTime();
		orb.time.update( 0, elapsed * 50 );

		// render loop

		// setup
		for ( var i = 0; i < this.layers.length; ++i ) {

			this.layers[ i ].onUpdate();

		}

		// render
		this.renderer.render( this.scene, this.camera );

		if ( stats !== undefined ) { 
			stats.update();
		}
	}

};
/**
 * @author axiverse / http://axiverse.com
 */

orb.Layer = function () {

	this.scene = new THREE.Object3D();

};

orb.Layer.prototype = {

	constructor: orb.Layer,

	//?? element in the scene -> extension to THREE.js Object3D?
	onUpdate: function () {

	}
};
// constants

orb.Constants = {
	Fragment: {},
	Vertex: {},
};

orb.Constants.Atmosphere = {

	Kr				: 0.0025,
	Km				: 0.0010,
	ESun			: 20.0,
	g				: -0.950,
	wavelength		: [0.650, 0.570, 0.475],
	scaleDepth		: 0.25,
	mieScaleDepth	: 0.1,

	innerRadius		: 100,
	outerRadius		: 100 * 1.01

};

orb.Constants.BV = 
[0x9bb2ff, 0x9eb5ff, 0xa3b9ff, 0xaabfff, 0xb2c5ff, 0xbbccff, 0xc4d2ff,
 0xccd8ff, 0xd3ddff, 0xdae2ff, 0xdfe5ff, 0xe4e9ff, 0xe9ecff, 0xeeefff,
 0xf3f2ff, 0xf8f6ff, 0xfef9ff, 0xfff9fb, 0xfff7f5, 0xfff5ef, 0xfff3ea,
 0xfff1e5, 0xffefe0, 0xffeddb, 0xffebd6, 0xffe9d2, 0xffe8ce, 0xffe6ca,
 0xffe5c6, 0xffe3c3, 0xffe2bf, 0xffe0bb, 0xffdfb8, 0xffddb4, 0xffdbb0,
 0xffdaad, 0xffd8a9, 0xffd6a5, 0xffd5a1, 0xffd29c, 0xffd096, 0xffcc8f,
 0xffc885, 0xffc178, 0xffb765, 0xffa94b, 0xff9523, 0xff7b00, 0xff5200];

// 

orb.Constants['Fragment'].Earth = '//\n// Atmospheric scattering fragment shader\n//\n// Author: Sean O\'Neil\n//\n// Copyright (c) 2004 Sean O\'Neil\n//\n// Ported for use with three.js/WebGL by James Baicoianu\n\n//uniform sampler2D s2Tex1;\n//uniform sampler2D s2Tex2;\n\nuniform float fNightScale;\nuniform vec3 v3LightPosition;\nuniform sampler2D tDiffuse;\n//uniform sampler2D tDiffuseNight;\n//uniform sampler2D tClouds;\n\nuniform float fMultiplier;\n\nvarying vec3 c0;\nvarying vec3 c1;\nvarying vec3 vNormal;\nvarying vec2 vUv;\n\nvoid main (void)\n{\n	//gl_FragColor = vec4(c0, 1.0);\n	//gl_FragColor = vec4(0.25 * c0, 1.0);\n	//gl_FragColor = gl_Color + texture2D(s2Tex1, gl_TexCoord[0].st) * texture2D(s2Tex2, gl_TexCoord[1].st) * gl_SecondaryColor;\n	float phong = max(dot(normalize(-vNormal), normalize(v3LightPosition)), 0.0);\n\n	vec3 diffuseTex = texture2D( tDiffuse, vUv ).xyz;\n	//vec3 diffuseNightTex = texture2D( tDiffuseNight, vUv ).xyz;\n\n	//diffuseTex = vec3(0.0);\n	//diffuseNightTex = vec3(0.0);\n	//vec3 cloudsTex = texture2D( tClouds, vUv ).xyz;\n\n	//vec3 day = max( diffuseTex, cloudsTex ) * c0;\n	//vec3 night = fNightScale * (0.7 * pow(diffuseNightTex, vec3(3)) + 0.3 * diffuseNightTex) * (1.0 - c0) * phong * (1.0 - cloudsTex);\n\n\n\n	// specular\n	//vec3 r = reflect( -normalize(v3LightPosition), normalize(vNormal) );\n	//float specular =  0.2 * pow(max(dot(r, normalize(cameraPosition)), 0.0), 3.0);\n\n\n\n\n\n	//gl_FragColor = vec4(c1, 1.0) + vec4(day + night, 1.0);\n\n	//gl_FragColor = vec4(fMultiplier * (c1 + day + night), 1.0);\n	gl_FragColor = vec4(c1 + c0 * diffuseTex, 1.0);\n	//gl_FragColor.r += specular;\n\n}';

orb.Constants['Fragment'].Sky = '//\n// Atmospheric scattering fragment shader\n//\n// Author: Sean O\'Neil\n//\n// Copyright (c) 2004 Sean O\'Neil\n//\n\nuniform vec3 v3LightPos;\nuniform float g;\nuniform float g2;\n\nuniform float fMultiplier;\n\nvarying vec3 v3Direction;\nvarying vec3 c0;\nvarying vec3 c1;\n\n// Calculates the Mie phase function\nfloat getMiePhase(float fCos, float fCos2, float g, float g2)\n{\n	return 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + fCos2) / pow(1.0 + g2 - 2.0 * g * fCos, 1.5);\n}\n\n// Calculates the Rayleigh phase function\nfloat getRayleighPhase(float fCos2)\n{\n	return 0.75 + 0.75 * fCos2;\n}\n\nvoid main (void)\n{\n	float fCos = dot(v3LightPos, v3Direction) / length(v3Direction);\n	float fCos2 = fCos * fCos;\n\n	vec3 color =	getRayleighPhase(fCos2) * c0 +\n					getMiePhase(fCos, fCos2, g, g2) * c1;\n\n 	gl_FragColor = vec4(fMultiplier * fMultiplier * color, 1.0);\n	gl_FragColor.a = gl_FragColor.b;\n}';

orb.Constants['Fragment'].Stars = 'uniform vec3 color;\nuniform sampler2D texture;\n\nvarying vec3 vColor;\n\nvoid main() {\n\n	gl_FragColor = vec4( color * vColor, 1.0 );\n	gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );\n\n}';

orb.Constants['Vertex'].Earth = '//\n// Atmospheric scattering vertex shader\n//\n// Author: Sean O\'Neil\n//\n// Copyright (c) 2004 Sean O\'Neil\n//\n// Ported for use with three.js/WebGL by James Baicoianu\n\nuniform vec3 v3LightPosition;		// The direction vector to the light source\nuniform vec3 v3InvWavelength;	// 1 / pow(wavelength, 4) for the red, green, and blue channels\nuniform float fCameraHeight;	// The camera\'s current height\nuniform float fCameraHeight2;	// fCameraHeight^2\nuniform float fOuterRadius;		// The outer (atmosphere) radius\nuniform float fOuterRadius2;	// fOuterRadius^2\nuniform float fInnerRadius;		// The inner (planetary) radius\nuniform float fInnerRadius2;	// fInnerRadius^2\nuniform float fKrESun;			// Kr * ESun\nuniform float fKmESun;			// Km * ESun\nuniform float fKr4PI;			// Kr * 4 * PI\nuniform float fKm4PI;			// Km * 4 * PI\nuniform float fScale;			// 1 / (fOuterRadius - fInnerRadius)\nuniform float fScaleDepth;		// The scale depth (i.e. the altitude at which the atmosphere\'s average density is found)\nuniform float fScaleOverScaleDepth;	// fScale / fScaleDepth\nuniform sampler2D tDiffuse;\n\nvarying vec3 v3Direction;\nvarying vec3 c0;\nvarying vec3 c1;\nvarying vec3 vNormal;\nvarying vec2 vUv;\n\nconst int nSamples = 3;\nconst float fSamples = 3.0;\n\nfloat scale(float fCos)\n{\n	float x = 1.0 - fCos;\n	return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));\n}\n\nvoid main(void)\n{\n	// Get the ray from the camera to the vertex and its length (which is the far point of the ray passing through the atmosphere)\n	vec3 v3Ray = position - cameraPosition;\n	float fFar = length(v3Ray);\n	v3Ray /= fFar;\n\n	// Calculate the closest intersection of the ray with the outer atmosphere (which is the near point of the ray passing through the atmosphere)\n	float B = 2.0 * dot(cameraPosition, v3Ray);\n	float C = fCameraHeight2 - fOuterRadius2;\n	float fDet = max(0.0, B*B - 4.0 * C);\n	float fNear = 0.5 * (-B - sqrt(fDet));\n\n	// Calculate the ray\'s starting position, then calculate its scattering offset\n	vec3 v3Start = cameraPosition + v3Ray * fNear;\n	fFar -= fNear;\n	float fDepth = exp((fInnerRadius - fOuterRadius) / fScaleDepth);\n	float fCameraAngle = dot(-v3Ray, position) / length(position);\n	float fLightAngle = dot(v3LightPosition, position) / length(position);\n	float fCameraScale = scale(fCameraAngle);\n	float fLightScale = scale(fLightAngle);\n	float fCameraOffset = fDepth*fCameraScale;\n	float fTemp = (fLightScale + fCameraScale);\n\n	// Initialize the scattering loop variables\n	float fSampleLength = fFar / fSamples;\n	float fScaledLength = fSampleLength * fScale;\n	vec3 v3SampleRay = v3Ray * fSampleLength;\n	vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;\n\n	// Now loop through the sample rays\n	vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);\n	vec3 v3Attenuate;\n	for(int i=0; i<nSamples; i++)\n	{\n		float fHeight = length(v3SamplePoint);\n		float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight));\n		float fScatter = fDepth*fTemp - fCameraOffset;\n		v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));\n		v3FrontColor += v3Attenuate * (fDepth * fScaledLength);\n		v3SamplePoint += v3SampleRay;\n	}\n\n	// Calculate the attenuation factor for the ground\n	c0 = v3Attenuate;\n	c1 = v3FrontColor * (v3InvWavelength * fKrESun + fKmESun);\n\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n	//gl_TexCoord[0] = gl_TextureMatrix[0] * gl_MultiTexCoord0;\n	//gl_TexCoord[1] = gl_TextureMatrix[1] * gl_MultiTexCoord1;\n	vUv = uv;\n	vNormal = normal;\n}';

orb.Constants['Vertex'].Sky = '//\n// Atmospheric scattering vertex shader\n//\n// Author: Sean O\'Neil\n//\n// Copyright (c) 2004 Sean O\'Neil\n//\n\nuniform vec3 v3LightPosition;	// The direction vector to the light source\nuniform vec3 v3InvWavelength;	// 1 / pow(wavelength, 4) for the red, green, and blue channels\nuniform float fCameraHeight;	// The camera\'s current height\nuniform float fCameraHeight2;	// fCameraHeight^2\nuniform float fOuterRadius;		// The outer (atmosphere) radius\nuniform float fOuterRadius2;	// fOuterRadius^2\nuniform float fInnerRadius;		// The inner (planetary) radius\nuniform float fInnerRadius2;	// fInnerRadius^2\nuniform float fKrESun;			// Kr * ESun\nuniform float fKmESun;			// Km * ESun\nuniform float fKr4PI;			// Kr * 4 * PI\nuniform float fKm4PI;			// Km * 4 * PI\nuniform float fScale;			// 1 / (fOuterRadius - fInnerRadius)\nuniform float fScaleDepth;		// The scale depth (i.e. the altitude at which the atmosphere\'s average density is found)\nuniform float fScaleOverScaleDepth;	// fScale / fScaleDepth\n\nconst int nSamples = 3;\nconst float fSamples = 3.0;\n\nvarying vec3 v3Direction;\nvarying vec3 c0;\nvarying vec3 c1;\n\n\nfloat scale(float fCos)\n{\n	float x = 1.0 - fCos;\n	return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));\n}\n\nvoid main(void)\n{\n	// Get the ray from the camera to the vertex and its length (which is the far point of the ray passing through the atmosphere)\n	vec3 v3Ray = position - cameraPosition;\n	float fFar = length(v3Ray);\n	v3Ray /= fFar;\n\n	// Calculate the closest intersection of the ray with the outer atmosphere (which is the near point of the ray passing through the atmosphere)\n	float B = 2.0 * dot(cameraPosition, v3Ray);\n	float C = fCameraHeight2 - fOuterRadius2;\n	float fDet = max(0.0, B*B - 4.0 * C);\n	float fNear = 0.5 * (-B - sqrt(fDet));\n\n	// Calculate the ray\'s starting position, then calculate its scattering offset\n	vec3 v3Start = cameraPosition + v3Ray * fNear;\n	fFar -= fNear;\n	float fStartAngle = dot(v3Ray, v3Start) / fOuterRadius;\n	float fStartDepth = exp(-1.0 / fScaleDepth);\n	float fStartOffset = fStartDepth * scale(fStartAngle);\n	//c0 = vec3(1.0, 0, 0) * fStartAngle;\n\n	// Initialize the scattering loop variables\n	float fSampleLength = fFar / fSamples;\n	float fScaledLength = fSampleLength * fScale;\n	vec3 v3SampleRay = v3Ray * fSampleLength;\n	vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;\n\n	//gl_FrontColor = vec4(0.0, 0.0, 0.0, 0.0);\n\n	// Now loop through the sample rays\n	vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);\n	for(int i=0; i<nSamples; i++)\n	{\n		float fHeight = length(v3SamplePoint);\n		float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight));\n		float fLightAngle = dot(v3LightPosition, v3SamplePoint) / fHeight;\n		float fCameraAngle = dot(v3Ray, v3SamplePoint) / fHeight;\n		float fScatter = (fStartOffset + fDepth * (scale(fLightAngle) - scale(fCameraAngle)));\n		vec3 v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));\n\n		v3FrontColor += v3Attenuate * (fDepth * fScaledLength);\n		v3SamplePoint += v3SampleRay;\n	}\n\n	// Finally, scale the Mie and Rayleigh colors and set up the varying variables for the pixel shader\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n	c0 = v3FrontColor * (v3InvWavelength * fKrESun);\n	c1 = v3FrontColor * fKmESun;\n	v3Direction = cameraPosition - position;\n}';

orb.Constants['Vertex'].Stars = 'attribute float size;\nattribute vec3 ca;\n\nvarying vec3 vColor;\n\nvoid main() {\n\n	vColor = ca;\n\n	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\n	//gl_PointSize = size;\n	gl_PointSize = size * ( 300.0 / length( mvPosition.xyz ) );\n\n	gl_Position = projectionMatrix * mvPosition;\n\n}';

orb.time = {

	day:			0,
	minute:			0,
	declination:	0,
	spin:			0,

	euler:			new THREE.Euler(),
	matrix:			new THREE.Matrix4(),

	update: function ( day, minute ) {

		if ( day !== undefined && minute != undefined ) {

			this.day = day;
			this.minute = minute;

		}

		while ( this.minute > 1440 ) {

			this.minute -= 1440;
			this.day += 1;

		}

		if ( this.day > 365 ) {

			this.day = this.day % 365;
		
		}

		this.declination = -23.45 * Math.PI / 180 * Math.cos( 2 * Math.PI / 365.0 * (this.day + 10) );
		this.spin = -2 * Math.PI * ( this.minute / 1440 );

		this.euler.y = this.spin + Math.PI;
		this.euler.z = this.declination;

		this.matrix.makeRotationFromEuler( this.euler );

	}
};
/**
 * @author axiverse / http://axiverse.com
 */

// atmospheric scattering shaders for realistic rendering
// http://etd.dtu.dk/thesis/58645/imm2554.pdf

orb.AtmosphericLayer = function () {

};

orb.AtmosphericLayer.prototype = Object.create( orb.Layer.prototype );





orb.AtmosphericInLayer = function () {
	// ease in animation layer
	// in -> stable -> out
};

orb.AtmosphericOutLayer = function () {
	// ease out animation layer

};
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
// generate points based on density
// move points vased on vector fields
// kill fading ribbons over time.

orb.FieldLayer = function () {

	this.lifespan = 1;
	this.density = 10000;
	this.resolution = 10;

	this.buffer = new Float32Array( this.density * this.resolution );
	this.geometry = new THREE.BufferedGeometry();

	var attributes = this.geometry.attributes;

	
};

orb.FieldLayer.prototype = {

	constructor: orb.FieldLayer,

	update: function () {



	},



	randomPoint: function () {

		var u = Math.random();
		var v = Math.random();

		var theta = 2 * Math.PI * u;
		var phi = Math.acos( 2 * v - 1 );

		return THREE.Vector3( Math.sin( theta ) * Math.cos( phi ),
							  Math.sin( theta ) * Math.sin( phi ),
							  Math.cos( theta ) );

	}

};

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

		var size = Math.random() * 2 + 0.5;
		var geometry = new THREE.PlaneBufferGeometry(size, size);
		var mesh = new THREE.Mesh( geometry, material );

		coordinate.set(markers[i].lat, markers[i].lng);
		coordinate.toVector3(orb.Constants.Atmosphere.outerRadius, mesh.position);

		mesh.lookAt(zero);

		this.scene.add(mesh);

	}



};

orb.ParticleLayer.prototype = Object.create( orb.Layer.prototype );
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
/**
 * @author axiverse / http://axiverse.com
 */

// Tile map source layer - mapbox, or google maps
// Google maps layer plugin, perhaps other services as well.
/**
 * @author axiverse / http://aaronsun.com/
 */


// TODO: lat [-90, 90], long [-180, 180]
orb.Coordinate = function ( latitude, longitude ) {

	this.lat = latitude || 0;
	this.lng = longitude || 0;

};

orb.Coordinate.prototype = {

	constructor: orb.Coordinate,

	set: function( latitude, longitude ) {

		this.lat = latitude;
		this.lng = longitude;

	},

	copy: function( coordinate ) {

		this.lng = coordinate.lng;
		this.lat = coordinate.lat;

	},


	fromArray: function( array ) {

		this.lat = array[ 0 ];
		this.lng = array[ 1 ];

	},

	toVector3: function( scale, target ) {

		var vector = target || new THREE.Vector3();

		var scale = scale || 6371;

		var phi = this.lat * ( Math.PI / 180 );
		var theta = - this.lng * ( Math.PI / 180 );

		return vector.set(
			scale * Math.cos( theta ) * Math.cos( phi ),
			scale * Math.sin( phi ),
			scale * Math.sin( theta) * Math.cos( phi ));

	},

	toString: function() {

		return this.lat + ', ' + this.lng;

	},

};

/**
 * Heliocentric ecliptic coordinate system with the sun as the origin and the
 * vernal equinox as the parimary direction
 */
orb.Coordinate.Ecliptic = function ( latitude, longitude ) {

	this.origin = orb.galactic.Anchor.Common.Sun;
	this.primary = "J2000.0";

};

/**
 * Galactic ecliptic coordinates system with the sun as the origin and the
 * galactic center as the primary direction
 */
orb.Coordinate.Galactic = function ( latitude, longitude ) {

	this.b = latitude || 0;
	this.l = longitude || 0;

};




orb.Sphere = function ( origin, radius ) {
	this.origin = origin;
	this.radius = radius;
}

orb.Ray = function ( origin, direction ) {
	this.origin = origin;
	this.direction = radius;
}

orb.intersects = function ( sphere, ray ) {

	var r = sphere.radius;
	var s = sphere.origin;
	var u = ray.origin;
	var v = ray.origin + ray.direction;
	var sq = function ( a ) { return a * a };

	var v_u = v.sub(u);
	var u_s = u.sub(s);

	var a = v_u.dot( v_u );
	var b = 2 * ( v_u.dot( u_s ) );
	var c = u_s.dot( u_s ) - ( r * r );

	var d = ( b * b ) - ( 4 * a * c );

	return ( d >= 0 );
	
}
orb.Region = function () {

	this.positive = [];	// additive areas
	this.negative = []; // subtractive areas

	this.computeBounds();

};

orb.Region.prototype = {

	constructor: orb.Region,

	computeBounds: function () {

		// TODO(axiverse): solve for wraparound bounding boxes, like russia

		this.bounds = {};
		var min = this.bounds.minimum = new THREE.Vector2( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );
		var max = this.bounds.maximum = new THREE.Vector2( Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY );

		this.positive.forEach( function ( polygon ) {

			polygon.forEach( function ( point ) {

				min.x = Math.min( min.x, point.x );
				min.y = Math.min( min.y, point.y );

				max.x = Math.max( max.x, point.x );
				max.y = Math.max( max.y, point.y );

			});

		});
	}
}


orb.Partition = function () {

	this.points = [];
	this.regions = [];

};

orb.Partition.prototype = {

	constructor: orb.Partition,

	add: function ( positioned ) {

		// 2d vector latitude/longitude
		var o = positioned.origin;

		return this;

	},

	remove: function ( positioned ) {

		return this;

	},

	nearest: function ( point, number ) {
		
		return [];

		// takes points and vectors...

		// TODO(axiverse): check for wraparound nearest points
		// TODO(axiverse): poles have to check a wide area... in 3d?
	}

};
/**
 * @author axiverse / http://aaronsun.com/
 */

orb.Unit = function( value, unit ) {

	this.value = value || 0;
	this.unit = unit || "";

};

orb.Unit.prototype = {

	constructor: orb.Unit,

	convert: function( unit ) {

	},

	normalize: function () {

		var conversion = orb.Unit.Conversions[ unit ];

		if ( conversion != undefined ) {

			this.value = this.value * conversion.ratio;
			this.unit = conversion.si;

		}

	},

	toString: function () {

		return value.toExponential + this.unit;

	}

};

orb.Unit.Conversions = {

	m: {

		name: "Meter",
		si: "m",
		ratio: 1

	},

	pc: {

		name: "Parsec",
		si: "m",
		ratio: +3.08567758e+16

	},

	au: {

		name: "Astronomical Unit",
		si: "m",
		ratio: +3.08567758e+16

	},

	ly: {

		name: "Light-year",
		si: "m",
		ratio: +3.08567758e+16

	},


};

orb.Unit.Prefix = {

	Y: 1e+24,
	Z: 1e+21,
	E: 1e+18,
	P: 1e+15,
	T: 1e+12,
	G: 1e+9,
	M: 1e+6,
	k: 1e+3,

	m: 1e-3,
	u: 1e-6,
	n: 1e-9,
	p: 1e-12,
	f: 1e-15,
	a: 1e-18,
	z: 1e-21,
	y: 1e-24,

	detect: function( unit ) {

		var components = {
			base: unit,
			prefix: "",
			ratio: 1
		}

		if ( unit.length > 1 ) {

			var base =  unit.substr( 1 );
			var prefix = unit.substr( 0, 1 );
			var ratio = orb.Unit.Prefix[ prefix ];

			if ( orb.Unit.Conversions[ base ] !== undefined &&
				 ratio !== undefined ) {

				components.base = base;
				components.prefix = prefix;
				components.ratio = ratio;

			}

		}

		return components;

	}

};
/**
 * @author axiverse / http://axiverse.com
 */

orb.Vector3 = THREE.Vector3;

orb.Vector3.prototype = THREE.Vector3.prototype;




orb.Node = function () {

	this._id = orb.NodeIdCount ++;
	this._uuid = '';

	this._name = '';

	this.parent = undefined;
	this.children = [];

	this._attributes = {};
	this._data = {};

};

orb.Node.prototype = {


	attribute: function ( key, value ) {

		if ( value !== undefined ) {

			this._attributes[ key ] = value;
			this.dispatchEvent( { type: 'attribute' } );

			return this;

		}

		return this._attributes[ key ];
	},

	add: function ( node ) {

		if ( node === this ) {

			return;

		}

		if ( node instanceof orb.Node ) {

			if ( node.parent !== undefined ) {

				node.parent.remove( node );

			}

			this.children.push( node );

		}

	},

	remove: function ( node ) {

	},

	traverse: function ( node ) {

	}
};

orb.NodeIdCount = 0;
