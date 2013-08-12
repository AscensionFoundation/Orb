

ORB.Sphere = function ( origin, radius ) {
	this.origin = origin;
	this.radius = radius;
}

ORB.Ray = function ( origin, direction ) {
	this.origin = origin;
	this.direction = radius;
}

ORB.intersects = function ( sphere, ray ) {

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