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

