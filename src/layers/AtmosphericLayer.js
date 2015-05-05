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