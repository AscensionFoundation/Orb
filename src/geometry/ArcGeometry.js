// ArcGeometry
// Surface aligned arc geometry.

orb.ArcGeometry = function( from, to, radius ) {
	
	THREE.Geometry.call( this );

	// create unit vector
	var a = from.toVector3();
	var b = to.toVector3();

	/*
	var c = new THREE.Vector3();

	var r = new THREE.Quaternion();
	r.setFromUnitVectors( a, b );

	var q = new THREE.Quaternion();
	var segments = 50;

	for ( var i = 0; i < segments; ++i ) {

		var v = new THREE.Vector3();

		q.set( 0, 0, 0, 1 );
		q.slerp( r, i / segments );

		v.copy( uFrom );
		v.applyQuaternion( q );

	}
	*/

	var segments = 10;
	for ( var i = 0; i < segments + 1; ++i ) {

		var p = new THREE.Vector3().copy( a );
		p.lerp( b, i / segments );
		p.normalize().multiplyScalar( radius );

		this.vertices.push( p );

	}

};

orb.ArcGeometry.prototype = Object.create( THREE.Geometry.prototype );