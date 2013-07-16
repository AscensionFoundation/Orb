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