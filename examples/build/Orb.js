/**
 * @author axiverse / http://axiverse.com
 */
'use strict';

/*

Dependencies:
	moment.js

*/

var orb = orb || { revision: 0 };	
/**
 * @author axiverse / http://axiverse.com
 */
 
orb.Clock = function( autoStart ) {

	this.autoStart = ( autoStart !== undefined ) ? autoStart : true;

	this.startTime = 0;
	this.oldTime = 0;
	this.elapsedTime = 0;
	this.localTime = 0;
	this.localElapsedTime = 0;
	this.multiplier = 1;
	this.running = false;

	this.frame = {

		diff: 0,
		delta: 0,

	}
};

orb.Clock.prototype = {

	constructor: orb.Clock,

	start: function() {

		this.startTime = performance !== undefined && performance.now !== undefined
					 ? performance.now()
					 : Date.now();

		this.oldTime = this.startTime;
		this.localTime = Date.now();

		this.running = true;

	},

	stop: function() {

		this.getElapsedTime();
		this.running = false;

	},

	getElapsedTime: function () {

		this.getDelta();
		return this.elapsedTime;

	},

	getLocalElapsedTime: function () {

		this.getDelta();
		return this.localElapsedTime;

	},

	getLocalTime: function() {

		this.getDelta();
		return this.localTime;

	},

	getDelta: function() {

		var diff = 0;
		var delta = 0;

		if ( this.autoStart && ! this.running ) {

			this.start();

		}

		if ( this.running ) {

			var newTime = performance !== undefined && performance.now !== undefined
					 ? performance.now()
					 : Date.now();

			diff = 0.001 * ( newTime - this.oldTime );
			delta = diff * this.multiplier;

			this.oldTime = newTime;

			this.elapsedTime += diff;

			this.localTime += delta;
			this.localElapsedTime += delta;

		}

		this.frame.diff = diff;
		this.frame.delta = delta;

		return this.frame;

	}

}
/**
 * @author axiverse / http://axiverse.com
 */

orb.Core = function ( domElement ) {

	// create nested 100% element

	this.layers = [];
	this.overlays = [];	// overlay objects that get an updated position as the globe spins or moves

	this.animating = false;

	this.renderer = new THREE.WebGLRenderer( { antialias: false /* , logarithmicDepthBuffer: 'logzbuf' */ } );
	this.scene = new THREE.Scene();
	//this.scene.fog = new THREE.FogExp2( 0x000000, 0.0025 );
	//this.scene.fog = new THREE.Fog( 0x000000, 100, 300 );
	this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000000000000 );

	this.camera.position.z = 300;


	var renderer = this.renderer;
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x000000, 1 );

	this.clock = new orb.Clock();

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

		var elapsed = this.clock.getLocalElapsedTime();
		orb.time.update( 0, elapsed * 50 );

		// render loop

		// setup
		for ( var i = 0; i < this.layers.length; ++i ) {

			this.layers[ i ].onUpdate( elapsed );

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

orb.Global = function ( domElement ) {


};

orb.Global.prototype = {

	// time

	// camera

	// user

	// history

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

orb.Constants['Fragment'].Earth = '//\n// Atmospheric scattering fragment shader\n//\n// Author: Sean O\'Neil\n//\n// Copyright (c) 2004 Sean O\'Neil\n//\n// Ported for use with three.js/WebGL by James Baicoianu\n\n//uniform sampler2D s2Tex1;\n//uniform sampler2D s2Tex2;\n\nuniform float fNightScale;\nuniform vec3 v3LightPosition;\nuniform sampler2D tDiffuse;\n//uniform sampler2D tDiffuseNight;\n//uniform sampler2D tClouds;\n\nuniform float fMultiplier;\n\nvarying vec3 c0;\nvarying vec3 c1;\nvarying vec3 vNormal;\nvarying vec2 vUv;\n\nvoid main (void)\n{\n	//gl_FragColor = vec4(c0, 1.0);\n	//gl_FragColor = vec4(0.25 * c0, 1.0);\n	//gl_FragColor = gl_Color + texture2D(s2Tex1, gl_TexCoord[0].st) * texture2D(s2Tex2, gl_TexCoord[1].st) * gl_SecondaryColor;\n	float phong = max(dot(normalize(-vNormal), normalize(v3LightPosition)), 0.0);\n\n	vec3 diffuseTex = texture2D( tDiffuse, vUv ).xyz;\n	//vec3 diffuseNightTex = texture2D( tDiffuseNight, vUv ).xyz;\n\n	//diffuseTex = vec3(0.0);\n	//diffuseNightTex = vec3(0.0);\n	//vec3 cloudsTex = texture2D( tClouds, vUv ).xyz;\n\n	//vec3 day = max( diffuseTex, cloudsTex ) * c0;\n	//vec3 night = fNightScale * (0.7 * pow(diffuseNightTex, vec3(3)) + 0.3 * diffuseNightTex) * (1.0 - c0) * phong * (1.0 - cloudsTex);\n\n\n\n	// specular\n	//vec3 r = reflect( -normalize(v3LightPosition), normalize(vNormal) );\n	//float specular =  0.2 * pow(max(dot(r, normalize(cameraPosition)), 0.0), 3.0);\n\n\n\n\n\n	//gl_FragColor = vec4(c1, 1.0) + vec4(day + night, 1.0);\n\n	//gl_FragColor = vec4(fMultiplier * (c1 + day + night), 1.0);\n	gl_FragColor = vec4(c1 + c0 * diffuseTex, 1.0);\n	//gl_FragColor.r += specular;\n	//gl_FragColor.rg += vUv.xy;\n\n}';

orb.Constants['Fragment'].RibbonUpdate = '// update the ribbon shader\n\nvarying vec2 vUv;\n\nuniform sampler2D tPositions;\nuniform sampler2D tVelocities;\n\nuniform float delta;\n\nvoid main() {\n\n	vec2 uv = gl_FragCoord.xy / resolution.xy;\n	vec4 data = texture2D( tPosition, uv );\n	vec3 position = data.xy;\n	vec3 velocity = texture3D( tVelocity, position.xy ).xy;\n\n	// x = lng\n	// y = lat\n	gl_FragColor = vec4( position + velocity * delta, 1., 1. );\n\n}';

orb.Constants['Fragment'].Sky = '//\n// Atmospheric scattering fragment shader\n//\n// Author: Sean O\'Neil\n//\n// Copyright (c) 2004 Sean O\'Neil\n//\n\nuniform vec3 v3LightPos;\nuniform float g;\nuniform float g2;\n\nuniform float fMultiplier;\n\nvarying vec3 v3Direction;\nvarying vec3 c0;\nvarying vec3 c1;\n\n// Calculates the Mie phase function\nfloat getMiePhase(float fCos, float fCos2, float g, float g2)\n{\n	return 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + fCos2) / pow(1.0 + g2 - 2.0 * g * fCos, 1.5);\n}\n\n// Calculates the Rayleigh phase function\nfloat getRayleighPhase(float fCos2)\n{\n	return 0.75 + 0.75 * fCos2;\n}\n\nvoid main (void)\n{\n	float fCos = dot(v3LightPos, v3Direction) / length(v3Direction);\n	float fCos2 = fCos * fCos;\n\n	vec3 color =	getRayleighPhase(fCos2) * c0 +\n					getMiePhase(fCos, fCos2, g, g2) * c1;\n\n 	gl_FragColor = vec4(fMultiplier * fMultiplier * color, 1.0);\n	gl_FragColor.a = gl_FragColor.b;\n}';

orb.Constants['Fragment'].Stars = 'uniform vec3 color;\nuniform sampler2D texture;\n\nvarying vec3 vColor;\n\nvoid main() {\n\n	gl_FragColor = vec4( color * vColor, 1.0 );\n	//gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );\n	//gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );\n}';

orb.Constants['Vertex'].Earth = '//\n// Atmospheric scattering vertex shader\n//\n// Author: Sean O\'Neil\n//\n// Copyright (c) 2004 Sean O\'Neil\n//\n// Ported for use with three.js/WebGL by James Baicoianu\n\nuniform vec3 v3LightPosition;		// The direction vector to the light source\nuniform vec3 v3InvWavelength;	// 1 / pow(wavelength, 4) for the red, green, and blue channels\nuniform float fCameraHeight;	// The camera\'s current height\nuniform float fCameraHeight2;	// fCameraHeight^2\nuniform float fOuterRadius;		// The outer (atmosphere) radius\nuniform float fOuterRadius2;	// fOuterRadius^2\nuniform float fInnerRadius;		// The inner (planetary) radius\nuniform float fInnerRadius2;	// fInnerRadius^2\nuniform float fKrESun;			// Kr * ESun\nuniform float fKmESun;			// Km * ESun\nuniform float fKr4PI;			// Kr * 4 * PI\nuniform float fKm4PI;			// Km * 4 * PI\nuniform float fScale;			// 1 / (fOuterRadius - fInnerRadius)\nuniform float fScaleDepth;		// The scale depth (i.e. the altitude at which the atmosphere\'s average density is found)\nuniform float fScaleOverScaleDepth;	// fScale / fScaleDepth\nuniform sampler2D tDiffuse;\n\nvarying vec3 c0;\nvarying vec3 c1;\nvarying vec3 vNormal;\nvarying vec2 vUv;\n\nconst int nSamples = 3;\nconst float fSamples = 3.0;\n\nfloat scale(float fCos)\n{\n	float x = 1.0 - fCos;\n	return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));\n}\n\nvoid main(void)\n{\n	// Get the ray from the camera to the vertex and its length (which is the far point of the ray passing through the atmosphere)\n	vec3 v3Ray = position - cameraPosition;\n	float fFar = length(v3Ray);\n	v3Ray /= fFar;\n\n	// Calculate the closest intersection of the ray with the outer atmosphere (which is the near point of the ray passing through the atmosphere)\n	float B = 2.0 * dot(cameraPosition, v3Ray);\n	float C = fCameraHeight2 - fOuterRadius2;\n	float fDet = max(0.0, B*B - 4.0 * C);\n	float fNear = 0.5 * (-B - sqrt(fDet));\n\n	// Calculate the ray\'s starting position, then calculate its scattering offset\n	vec3 v3Start = cameraPosition + v3Ray * fNear;\n	fFar -= fNear;\n	float fDepth = exp((fInnerRadius - fOuterRadius) / fScaleDepth);\n	float fCameraAngle = dot(-v3Ray, position) / length(position);\n	float fLightAngle = dot(v3LightPosition, position) / length(position);\n	float fCameraScale = scale(fCameraAngle);\n	float fLightScale = scale(fLightAngle);\n	float fCameraOffset = fDepth*fCameraScale;\n	float fTemp = (fLightScale + fCameraScale);\n\n	// Initialize the scattering loop variables\n	float fSampleLength = fFar / fSamples;\n	float fScaledLength = fSampleLength * fScale;\n	vec3 v3SampleRay = v3Ray * fSampleLength;\n	vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;\n\n	// Now loop through the sample rays\n	vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);\n	vec3 v3Attenuate;\n	for(int i=0; i<nSamples; i++)\n	{\n		float fHeight = length(v3SamplePoint);\n		float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight));\n		float fScatter = fDepth*fTemp - fCameraOffset;\n		v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));\n		v3FrontColor += v3Attenuate * (fDepth * fScaledLength);\n		v3SamplePoint += v3SampleRay;\n	}\n\n	// Calculate the attenuation factor for the ground\n	c0 = v3Attenuate;\n	c1 = v3FrontColor * (v3InvWavelength * fKrESun + fKmESun);\n\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n	//gl_TexCoord[0] = gl_TextureMatrix[0] * gl_MultiTexCoord0;\n	//gl_TexCoord[1] = gl_TextureMatrix[1] * gl_MultiTexCoord1;\n	vUv = uv;\n	vNormal = normal;\n}';

orb.Constants['Vertex'].EarthMap = '//\n// Atmospheric scattering vertex shader\n//\n// Author: Sean O\'Neil\n//\n// Copyright (c) 2004 Sean O\'Neil\n//\n// Ported for use with three.js/WebGL by James Baicoianu\n\nuniform vec3 v3LightPosition;		// The direction vector to the light source\nuniform vec3 v3InvWavelength;	// 1 / pow(wavelength, 4) for the red, green, and blue channels\nuniform float fCameraHeight;	// The camera\'s current height\nuniform float fCameraHeight2;	// fCameraHeight^2\nuniform float fOuterRadius;		// The outer (atmosphere) radius\nuniform float fOuterRadius2;	// fOuterRadius^2\nuniform float fInnerRadius;		// The inner (planetary) radius\nuniform float fInnerRadius2;	// fInnerRadius^2\nuniform float fKrESun;			// Kr * ESun\nuniform float fKmESun;			// Km * ESun\nuniform float fKr4PI;			// Kr * 4 * PI\nuniform float fKm4PI;			// Km * 4 * PI\nuniform float fScale;			// 1 / (fOuterRadius - fInnerRadius)\nuniform float fScaleDepth;		// The scale depth (i.e. the altitude at which the atmosphere\'s average density is found)\nuniform float fScaleOverScaleDepth;	// fScale / fScaleDepth\nuniform sampler2D tDiffuse;\n\nvarying vec3 c0;\nvarying vec3 c1;\nvarying vec3 vNormal;\nvarying vec2 vUv;\n\nconst int nSamples = 3;\nconst float fSamples = 3.0;\n\nfloat scale(float fCos)\n{\n	float x = 1.0 - fCos;\n	return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));\n}\n\nvoid main(void)\n{\n	// Get the ray from the camera to the vertex and its length (which is the far point of the ray passing through the atmosphere)\n	float theta = (uv.y) * 3.1415;\n	float phi = (uv.x) * 2.0 * 3.1415;\n\n	vec3 v3position = -vec3( fInnerRadius * sin(theta) * cos(phi), fInnerRadius * sin(theta) * sin(phi), fInnerRadius * cos(theta) );\n	vec3 v3camera = 6.0 * v3position;\n	float ffCameraHeight = length(v3camera);\n	float ffCameraHeight2 = ffCameraHeight * ffCameraHeight;\n	vec3 v3Ray = v3position - v3camera;\n	float fFar = length(v3Ray);\n	v3Ray /= fFar;\n\n	// Calculate the closest intersection of the ray with the outer atmosphere (which is the near point of the ray passing through the atmosphere)\n	float B = 2.0 * dot(v3camera, v3Ray);\n	float C = ffCameraHeight2 - fOuterRadius2;\n	float fDet = max(0.0, B*B - 4.0 * C);\n	float fNear = 0.5 * (-B - sqrt(fDet));\n\n	// Calculate the ray\'s starting position, then calculate its scattering offset\n	vec3 v3Start = v3camera + v3Ray * fNear;\n	fFar -= fNear;\n	float fDepth = exp((fInnerRadius - fOuterRadius) / fScaleDepth);\n	float fCameraAngle = dot(-v3Ray, v3position) / length(v3position);\n	float fLightAngle = dot(v3LightPosition, v3position) / length(v3position);\n	float fCameraScale = scale(fCameraAngle);\n	float fLightScale = scale(fLightAngle);\n	float fCameraOffset = fDepth*fCameraScale;\n	float fTemp = (fLightScale + fCameraScale);\n\n	// Initialize the scattering loop variables\n	float fSampleLength = fFar / fSamples;\n	float fScaledLength = fSampleLength * fScale;\n	vec3 v3SampleRay = v3Ray * fSampleLength;\n	vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;\n\n	// Now loop through the sample rays\n	vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);\n	vec3 v3Attenuate;\n	for(int i=0; i < nSamples; i++)\n	{\n		float fHeight = length(v3SamplePoint);\n		float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight));\n		float fScatter = fDepth*fTemp - fCameraOffset;\n		v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));\n		v3FrontColor += v3Attenuate * (fDepth * fScaledLength);\n		v3SamplePoint += v3SampleRay;\n	}\n\n	// Calculate the attenuation factor for the ground\n	c0 = v3Attenuate;\n	c1 = v3FrontColor * (v3InvWavelength * fKrESun + fKmESun);\n	//c0 = vec3( uv.u, uv.v, 0 );\n\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n	//gl_TexCoord[0] = gl_TextureMatrix[0] * gl_MultiTexCoord0;\n	//gl_TexCoord[1] = gl_TextureMatrix[1] * gl_MultiTexCoord1;\n	vUv = uv;\n	vNormal = normal;\n}';

orb.Constants['Vertex'].RibbonUpdate = 'varying vec2 vUv;\n\nvoid main() {\n\n	vUv = vec2(uv.x, 1.0 - uv.y);\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n}';

orb.Constants['Vertex'].Sky = '//\n// Atmospheric scattering vertex shader\n//\n// Author: Sean O\'Neil\n//\n// Copyright (c) 2004 Sean O\'Neil\n//\n\nuniform vec3 v3LightPosition;	// The direction vector to the light source\nuniform vec3 v3InvWavelength;	// 1 / pow(wavelength, 4) for the red, green, and blue channels\nuniform float fCameraHeight;	// The camera\'s current height\nuniform float fCameraHeight2;	// fCameraHeight^2\nuniform float fOuterRadius;		// The outer (atmosphere) radius\nuniform float fOuterRadius2;	// fOuterRadius^2\nuniform float fInnerRadius;		// The inner (planetary) radius\nuniform float fInnerRadius2;	// fInnerRadius^2\nuniform float fKrESun;			// Kr * ESun\nuniform float fKmESun;			// Km * ESun\nuniform float fKr4PI;			// Kr * 4 * PI\nuniform float fKm4PI;			// Km * 4 * PI\nuniform float fScale;			// 1 / (fOuterRadius - fInnerRadius)\nuniform float fScaleDepth;		// The scale depth (i.e. the altitude at which the atmosphere\'s average density is found)\nuniform float fScaleOverScaleDepth;	// fScale / fScaleDepth\n\nconst int nSamples = 3;\nconst float fSamples = 3.0;\n\nvarying vec3 v3Direction;\nvarying vec3 c0;\nvarying vec3 c1;\n\n\nfloat scale(float fCos)\n{\n	float x = 1.0 - fCos;\n	return fScaleDepth * exp(-0.00287 + x*(0.459 + x*(3.83 + x*(-6.80 + x*5.25))));\n}\n\nvoid main(void)\n{\n	// Get the ray from the camera to the vertex and its length (which is the far point of the ray passing through the atmosphere)\n	vec3 v3Ray = position - cameraPosition;\n	float fFar = length(v3Ray);\n	v3Ray /= fFar;\n\n	// Calculate the closest intersection of the ray with the outer atmosphere (which is the near point of the ray passing through the atmosphere)\n	float B = 2.0 * dot(cameraPosition, v3Ray);\n	float C = fCameraHeight2 - fOuterRadius2;\n	float fDet = max(0.0, B*B - 4.0 * C);\n	float fNear = 0.5 * (-B - sqrt(fDet));\n\n	// Calculate the ray\'s starting position, then calculate its scattering offset\n	vec3 v3Start = cameraPosition + v3Ray * fNear;\n	fFar -= fNear;\n	float fStartAngle = dot(v3Ray, v3Start) / fOuterRadius;\n	float fStartDepth = exp(-1.0 / fScaleDepth);\n	float fStartOffset = fStartDepth * scale(fStartAngle);\n	//c0 = vec3(1.0, 0, 0) * fStartAngle;\n\n	// Initialize the scattering loop variables\n	float fSampleLength = fFar / fSamples;\n	float fScaledLength = fSampleLength * fScale;\n	vec3 v3SampleRay = v3Ray * fSampleLength;\n	vec3 v3SamplePoint = v3Start + v3SampleRay * 0.5;\n\n	//gl_FrontColor = vec4(0.0, 0.0, 0.0, 0.0);\n\n	// Now loop through the sample rays\n	vec3 v3FrontColor = vec3(0.0, 0.0, 0.0);\n	for(int i=0; i<nSamples; i++)\n	{\n		float fHeight = length(v3SamplePoint);\n		float fDepth = exp(fScaleOverScaleDepth * (fInnerRadius - fHeight));\n		float fLightAngle = dot(v3LightPosition, v3SamplePoint) / fHeight;\n		float fCameraAngle = dot(v3Ray, v3SamplePoint) / fHeight;\n		float fScatter = (fStartOffset + fDepth * (scale(fLightAngle) - scale(fCameraAngle)));\n		vec3 v3Attenuate = exp(-fScatter * (v3InvWavelength * fKr4PI + fKm4PI));\n\n		v3FrontColor += v3Attenuate * (fDepth * fScaledLength);\n		v3SamplePoint += v3SampleRay;\n	}\n\n	// Finally, scale the Mie and Rayleigh colors and set up the varying variables for the pixel shader\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n	c0 = v3FrontColor * (v3InvWavelength * fKrESun);\n	c1 = v3FrontColor * fKmESun;\n	v3Direction = cameraPosition - position;\n}';

orb.Constants['Vertex'].Stars = 'attribute float size;\nattribute vec3 ca;\n\nvarying vec3 vColor;\n\nvoid main() {\n\n	vColor = ca;\n\n	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\n	//gl_PointSize = size;\n	//gl_PointSize = size * ( 300.0 / length( mvPosition.xyz ) );\n	gl_PointSize = 1.5;\n\n	gl_Position = projectionMatrix * mvPosition;\n\n}';

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


// ArcGeometry
// Surface aligned arc geometry.

orb.ArcGeometry = function( from, to, radius ) {
	
	THREE.Geometry.call( this );

	// create unit vector
	var a = from.toVector3();
	var b = to.toVector3();

	/*
	var c = new THREE.Vector3();

	var r = new THREE.Quaternion();
	r.setFromUnitVectors( a, b );

	var q = new THREE.Quaternion();
	var segments = 50;

	for ( var i = 0; i < segments; ++i ) {

		var v = new THREE.Vector3();

		q.set( 0, 0, 0, 1 );
		q.slerp( r, i / segments );

		v.copy( uFrom );
		v.applyQuaternion( q );

	}
	*/

	var segments = 10;
	for ( var i = 0; i < segments + 1; ++i ) {

		var p = new THREE.Vector3().copy( a );
		p.lerp( b, i / segments );
		p.normalize().multiplyScalar( radius );

		this.vertices.push( p );

	}

};

orb.ArcGeometry.prototype = Object.create( THREE.Geometry.prototype );


orb.RibbonGeometry = function() {
	
	THREE.Geometry.call( this );

};

orb.RibbonGeometry.prototype = Object.create( THREE.Geometry.prototype );
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
// vertical bars out of the earth

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
/**
 * @author axiverse / http://axiverse.com
 *
 * The globe in a 2D format
 */

orb.MapLayer = function ( ) {

	orb.Layer.call( this );

	orb.textures = {
		day: THREE.ImageUtils.loadTexture( 'textures/map-small.jpg' ),
	}

	var u = function(type, value) {
		return {
			type: type,
			value: value
		};
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
		var geometry = new THREE.PlaneBufferGeometry( 200, 100, 100, 50 );

		var material = new THREE.ShaderMaterial({
			uniforms:		uniforms,
			vertexShader:	orb.Constants.Vertex.EarthMap,
			fragmentShader:	orb.Constants.Fragment.Earth,

			depthWrite: true,
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

		light.set( 1, 0, 0 );
		light.applyMatrix4( orb.time.matrix );

		uniforms.v3LightPosition.value = light;
		uniforms.fCameraHeight.value = camera;
		uniforms.fCameraHeight2.value = camera * camera;

	};
};

orb.MapLayer.prototype = Object.create( orb.Layer.prototype );


/**
 * @author axiverse / http://axiverse.com
 *
 * Globe geometry layer
 */

orb.GeometryLayer = function ( ) {

	orb.Layer.call( this );

	orb.textures = {
		day: THREE.ImageUtils.loadTexture( 'textures/map-small.jpg' ),
	}

	var u = function(type, value) {
		return {
			type: type,
			value: value
		};
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

	// create terrain geometry
	{
		var geometry = new THREE.SphereGeometry( orb.Constants.Atmosphere.innerRadius, 100, 100 );
		geometry = new THREE.BufferGeometry().fromGeometry( geometry );

		var material = new THREE.ShaderMaterial({
			uniforms:		uniforms,
			vertexShader:	orb.Constants.Vertex.Earth,
			fragmentShader:	orb.Constants.Fragment.Earth,

			depthWrite: true,
		});

		var mesh = new THREE.Mesh( geometry, material );
		mesh.group = 'globe';

		this.scene.add( mesh );

	};

	// create sky geometry
	{
		var geometry = new THREE.SphereGeometry( orb.Constants.Atmosphere.outerRadius, 100, 100 );
		geometry = new THREE.BufferGeometry().fromGeometry( geometry );

		var material = new THREE.ShaderMaterial({
			uniforms:		uniforms,
			vertexShader:	orb.Constants.Vertex.Sky,
			fragmentShader:	orb.Constants.Fragment.Sky,

			side: THREE.BackSide,
			transparent: true,
			//depthWrite: false,
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

orb.RibbonLayer = function() {

	this.cadence;
	this.offset;

	this.positions = [];


	var uniforms = {
		time: { type: 'f', value: 1.0 },
		resolution: { type: 'v2', value: new THREE.Vector2( WIDTH, WIDTH )},
		texture: { type: 't', value: null }
	};

	this.passThroughShader = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: orb.Constants['Vertex'].PassThrough,
		fragmentShader: orb.Constants['Fragment'].Shader,
	});

	this.stepShader = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: orb.Constants['Vertex'].PassThrough,
		fragmentShader: orb.Constants['Fragment'].Shader,
	});

	// 1, 2, 3, 4, 5 -> 1

	/*

	input: velocity map

	update position map.


	*/

}

orb.RibbonLayer.prototype = Object.create( orb.Layer.prototype );

orb.RibbonLayer.render = function(position, output, delta) {


	renderer.render( scene, camera, output );
	this.currentPosition = output;

}

/**
 * Creates a render target
 */
orb.RibbonLayer.getRenderTarget = function( format ) {

	var renderTarget = new THREE.WebGLRenderTarget( WIDTH, WIDTH, {
		wrapS: THREE.RepeatWrapping,
		wrapT: THREE.RepeatWrapping,
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		format: format,
		type: THREE.FloatType,
		stencilBuffer: false
	});

	return renderTarget;
}

orb.RibbonLayer.generateTexture = function() {

	var a = new Float32Array( PARTICLES * 3 );

	for ( var k = 0, kl = a.length; k < kl; k += 3 ) {

			var x = Math.random() - 0.5;
			var y = Math.random() - 0.5;
			var z = Math.random() - 0.5;

			a[ k + 0 ] = x * 10;
			a[ k + 1 ] = y * 10;
			a[ k + 2 ] = z * 10;

	}

	var texture = new THREE.DataTexture( a, WIDTH, WIDTH, THREE.RGBFormat, THREE.FloatType );
	texture.minFilter = THREE.NearestFilter;
	texture.magFilter = THREE.NearestFilter;
	texture.needsUpdate = true;
	texture.flipY = false;

	return texture;

}

orb.RibbonLayer.onUpdate = function() {

	

}




orb.RibbonGeometry = function () {

	THREE.BufferGeometry.call( this );

	var vertices = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 );
	// position on the buffer, u, v, time
	var references = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 );

	this.addAttribute( 'position', vertices );
	this.addAttribute( 'reference', referecnes );




}

orb.RibbonGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );



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

		scale = scale || 1.0;
		target = target || new THREE.Vector3();


		var phi = this.lat * ( Math.PI / 180 );
		var theta = - this.lng * ( Math.PI / 180 );

		return target.set(
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
