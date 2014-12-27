/**
 * @author axiverse / http://axiverse.com
 */

 var orb = orb || { };
/**
 * @author axiverse / http://axiverse.com
 */

orb.Core = function ( element ) {

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
/**
 * @author axiverse / http://axiverse.com
 */

 var orb = orb || { };
/**
 * @author axiverse / http://axiverse.com
 */

// atmospheric scattering shaders for realistic rendering
// http://etd.dtu.dk/thesis/58645/imm2554.pdf

orb.AtmosphericLayer = function () {

};

orb.AtmosphericLayer.prototype = Object.create( orb.Layer.prototype );





orb.AtmosphericInLayer = function () {
	// ease in animation layer
	// in -> stable -> out
};

orb.AtmosphericOutLayer = function () {
	// ease out animation layer

};
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

orb.GeometryLayer = function ( ) {

	// create a bufferedgeometry from the geojson.
	// Index and created a shared geometry/index arraybuffer for all geometry
	
	// extract metadata objects for each geometry
	// create structures for efficient mouse/geometry collision


	// single line object for all outlines
	// individual geometrys for each country

};

orb.GeometryLayer.prototype = {


};
/**
 * @author axiverse / http://axiverse.com
 */

orb.Layer = function () {

};

orb.Layer.prototype = {

	constructor: orb.Layer

	//?? element in the scene -> extension to THREE.js Object3D?

};

/**
 * @author axiverse / http://axiverse.com
 */

// Tile map source layer - mapbox, or google maps
// Google maps layer plugin, perhaps other services as well.
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


/**
 * @author axiverse / http://axiverse.com
 */

 orb.Geo = function ( latitude, longitude ) {
 	this.latitude = latitude || 0;
 	this.longitude = longitude || 0;
 };

 orb.Geo.prototype = {

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
 		return new orb.Geo( this.latitude, this.longitude );
 	}

 };


orb.Sphere = function ( origin, radius ) {
	this.origin = origin;
	this.radius = radius;
}

orb.Ray = function ( origin, direction ) {
	this.origin = origin;
	this.direction = radius;
}

orb.intersects = function ( sphere, ray ) {

	var r = sphere.radius;
	var s = sphere.origin;
	var u = ray.origin;
	var v = ray.origin + ray.direction;
	var sq = function ( a ) { return a * a };

	var v_u = v.sub(u);
	var u_s = u.sub(s);

	var a = v_u.dot( v_u );
	var b = 2 * ( v_u.dot( u_s ) );
	var c = u_s.dot( u_s ) - ( r * r );

	var d = ( b * b ) - ( 4 * a * c );

	return ( d >= 0 );
	
}
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
/**
 * @author axiverse / http://aaronsun.com/
 */

orb.Unit = function( value, unit ) {

	this.value = value || 0;
	this.unit = unit || "";

};

orb.Unit.prototype = {

	constructor: orb.Unit,

	convert: function( unit ) {

	},

	normalize: function () {

		var conversion = orb.Unit.Conversions[ unit ];

		if ( conversion != undefined ) {

			this.value = this.value * conversion.ratio;
			this.unit = conversion.si;

		}

	},

	toString: function () {

		return value.toExponential + this.unit;

	}

};

orb.Unit.Conversions = {

	m: {

		name: "Meter",
		si: "m",
		ratio: 1

	},

	pc: {

		name: "Parsec",
		si: "m",
		ratio: +3.08567758e+16

	},

	au: {

		name: "Astronomical Unit",
		si: "m",
		ratio: +3.08567758e+16

	},

	ly: {

		name: "Light-year",
		si: "m",
		ratio: +3.08567758e+16

	},


};

orb.Unit.Prefix = {

	Y: 1e+24,
	Z: 1e+21,
	E: 1e+18,
	P: 1e+15,
	T: 1e+12,
	G: 1e+9,
	M: 1e+6,
	k: 1e+3,

	m: 1e-3,
	u: 1e-6,
	n: 1e-9,
	p: 1e-12,
	f: 1e-15,
	a: 1e-18,
	z: 1e-21,
	y: 1e-24,

	detect: function( unit ) {

		var components = {
			base: unit,
			prefix: "",
			ratio: 1
		}

		if ( unit.length > 1 ) {

			var base =  unit.substr( 1 );
			var prefix = unit.substr( 0, 1 );
			var ratio = orb.Unit.Prefix[ prefix ];

			if ( orb.Unit.Conversions[ base ] !== undefined &&
				 ratio !== undefined ) {

				components.base = base;
				components.prefix = prefix;
				components.ratio = ratio;

			}

		}

		return components;

	}

};
/**
 * @author axiverse / http://axiverse.com
 */

orb.Vector3 = THREE.Vector3;

orb.Vector3.prototype = THREE.Vector3.prototype;




orb.Node = function () {

	this._id = orb.NodeIdCount ++;
	this._uuid = '';

	this._name = '';

	this.parent = undefined;
	this.children = [];

	this._attributes = {};
	this._data = {};

};

orb.Node.prototype = {


	attribute: function ( key, value ) {

		if ( value !== undefined ) {

			this._attributes[ key ] = value;
			this.dispatchEvent( { type: 'attribute' } );

			return this;

		}

		return this._attributes[ key ];
	},

	add: function ( node ) {

		if ( node === this ) {

			return;

		}

		if ( node instanceof orb.Node ) {

			if ( node.parent !== undefined ) {

				node.parent.remove( node );

			}

			this.children.push( node );

		}

	},

	remove: function ( node ) {

	},

	traverse: function ( node ) {

	}
};

orb.NodeIdCount = 0;
NodeGroup.js