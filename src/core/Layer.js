/**
 * @author axiverse / http://axiverse.com
 */

orb.Layer = function () {

	this.scene = new THREE.Object3D();

};

orb.Layer.prototype = {

	constructor: orb.Layer,

	//?? element in the scene -> extension to THREE.js Object3D?
	onUpdate: function () {

	}
};