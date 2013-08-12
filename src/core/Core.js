/**
 * @author axiverse / http://axiverse.com
 */

ORB.Core = function ( element ) {

	// create nested 100% element

	this.layers = [];
	this.overlays = [];	// overlay objects that get an updated position as the globe spins or moves

	this._renderer = new THREE.WebGlRenderer( element );
	this._scene = new THREE.Scene();
	this._camera = new THREE.PerspectiveCamera();

	// attach renderer to the specified element
	// data discovery platform


	// camera
	// sunlight direction
	// virtual date
	// hmm???


};

ORB.Core.prototype = {

	constructor: ORB.Core,

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

	start: function () {
		// intro?
	},

	stop: function () {

	},

	render: function () {
		requestAnimcationFrame(render);

		// render loop

		// setup

		// render
		this._renderer.render( this._scene, this._camera );
	}

};