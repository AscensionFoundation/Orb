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