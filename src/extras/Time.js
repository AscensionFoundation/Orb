orb.time = {

	day:			0,
	minute:			0,
	declination:	0,
	spin:			0,

	euler:			new THREE.Euler(),
	matrix:			new THREE.Matrix4(),

	update: function ( day, minute ) {

		if ( day !== undefined && minute != undefined ) {

			this.day = day;
			this.minute = minute;

		}

		while ( this.minute > 1440 ) {

			this.minute -= 1440;
			this.day += 1;

		}

		if ( this.day > 365 ) {

			this.day = this.day % 365;
		
		}

		this.declination = -23.45 * Math.PI / 180 * Math.cos( 2 * Math.PI / 365.0 * (this.day + 10) );
		this.spin = -2 * Math.PI * ( this.minute / 1440 );

		this.euler.y = this.spin + Math.PI;
		this.euler.z = this.declination;

		this.matrix.makeRotationFromEuler( this.euler );

	}
};