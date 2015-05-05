/**
 * @author axiverse / http://axiverse.com
 */
 
orb.Clock = function( autoStart ) {

	this.autoStart = ( autoStart !== undefined ) ? autoStart : true;

	this.startTime = 0;
	this.oldTime = 0;
	this.elapsedTime = 0;
	this.localTime = 0;
	this.localElapsedTime = 0;
	this.multiplier = 1;
	this.running = false;

	this.frame = {

		diff: 0,
		delta: 0,

	}
};

orb.Clock.prototype = {

	constructor: orb.Clock,

	start: function() {

		this.startTime = performance !== undefined && performance.now !== undefined
					 ? performance.now()
					 : Date.now();

		this.oldTime = this.startTime;
		this.localTime = Date.now();

		this.running = true;

	},

	stop: function() {

		this.getElapsedTime();
		this.running = false;

	},

	getElapsedTime: function () {

		this.getDelta();
		return this.elapsedTime;

	},

	getLocalElapsedTime: function () {

		this.getDelta();
		return this.localElapsedTime;

	},

	getLocalTime: function() {

		this.getDelta();
		return this.localTime;

	},

	getDelta: function() {

		var diff = 0;
		var delta = 0;

		if ( this.autoStart && ! this.running ) {

			this.start();

		}

		if ( this.running ) {

			var newTime = performance !== undefined && performance.now !== undefined
					 ? performance.now()
					 : Date.now();

			diff = 0.001 * ( newTime - this.oldTime );
			delta = diff * this.multiplier;

			this.oldTime = newTime;

			this.elapsedTime += diff;

			this.localTime += delta;
			this.localElapsedTime += delta;

		}

		this.frame.diff = diff;
		this.frame.delta = delta;

		return this.frame;

	}

}