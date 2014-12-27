/**
 * @author axiverse / http://aaronsun.com/
 */


// TODO: lat [-90, 90], long [-180, 180]
orb.Coordiate = function ( latitude, longitude ) {

	this.lat = latitude || 0;
	this.lng = longitude || 0;

};

orb.Coordiate.prototype = {

	constructor: orb.Coordiate,

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

	toVector3: function( scale ) {

		var scale = scale || 6371;

		var phi = this.lat * ( Math.PI / 180 );
		var theta = - this.lng * ( Math.PI / 180 );

		return new THREE.Vector3(
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
orb.Coordiate.Ecliptic = function ( latitude, longitude ) {

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

