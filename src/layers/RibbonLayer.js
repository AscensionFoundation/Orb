
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


