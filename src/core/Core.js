/**
 * @author axiverse / http://axiverse.com
 */

ORB.Core = function ( element ) {

	this.layers = [];
	this.overlays = [];	// overlay objects that get an updated position as the globe spins or moves

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
	}

};