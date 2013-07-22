/**
 * @author axiverse / http://axiverse.com
 */

 var ORB = ORB || { };
/**
 * @author axiverse / http://axiverse.com
 */

ORB.Core = function ( element ) {

	this.layers = [];
	this.overlays = [];	// overlay objects that get an updated position as the globe spins or moves

	// attach renderer to the specified element
	// data discovery platform


	//this.date		// 
	//this.sunlight	// direction vector
	//this.
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
	}

};
/**
 * @author axiverse / http://axiverse.com
 */

 var ORB = ORB || { };
/**
 * @author axiverse / http://axiverse.com
 */

// atmospheric scattering shaders for realistic rendering
// http://etd.dtu.dk/thesis/58645/imm2554.pdf

ORB.AtmosphericLayer = function () {

};


ORB.AtmosphericInLayer = function () {
	// ease in animation layer
	// in -> stable -> out
};

ORB.AtmosphericOutLayer = function () {
	// ease out animation layer

};

/**
 * @author axiverse / http://axiverse.com
 */

// Tile map source layer - mapbox, or google maps
// Google maps layer plugin, perhaps other services as well.
/**
 * @author axiverse / http://axiverse.com
 */

 ORB.Geo = function ( latitude, longitude ) {
 	this.latitude = latitude || 0;
 	this.longitude = longitude || 0;
 };

 ORB.Geo.prototype = {

 	constructor: ORG.Geo,

 	set: function ( latitude, longitude ) {
 		this.latitude = latitude;
 		this.longitude = longitude;

 		return this;
 	},

 	setLatitude: function ( latitude ) {
 		this.latitude = latitude;

 		return this;
 	},

 	setLongitude: function ( longitude ) {
 		this.longitude = longitude;

 		return this;
 	},

 	copy: function ( g ) {
 		this.latitude = g.latitude;
 		this.longitude = g.longitude;

 		return this;
 	},

 	equals: function ( g ) {
 		return ( ( this.latitude === g.latitude ) && ( this.longitude === g.longitude ) );
 	},

 	fromArray: function ( array ) {
 		this.latitude = array[0];
 		this.longitude = array[1];

 		return this;
 	},

 	toArray: function () {
 		return [ this.latitude, this.longitude ];
 	},

 	clone: function () {
 		return new ORB.Geo( this.latitude, this.longitude );
 	}

 };
/**
 * @author axiverse / http://axiverse.com
 */

ORB.Vector3 = THREE.Vector3;

ORB.Vector3.prototype = THREE.Vector3.prototype;