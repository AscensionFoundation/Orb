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