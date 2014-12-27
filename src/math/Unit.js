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