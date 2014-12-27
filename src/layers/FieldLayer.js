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