/**
 * @author axiverse / http://axiverse.com
 */

 THREE.SpaceNavigatorControls = function ( object, domElement ) {



 	this.updateGamepad = function () {

		var gamepad = navigator.getGamepads();

		if (gamepad[0] != undefined) {
			var nav = gamepad[0];

			var s = {
				left: nav.buttons[0],
				right: nav.buttons[1],

				x: nav.axes[0], // right positive
				y: nav.axes[1], // back positive
				z: nav.axes[2], // down positive

				rx: nav.axes[3], // tilt backwards positive
				ry: nav.axes[4], // tilt left positive
				rz: nav.axes[5] // clockwise positive
			}

			_eye.multiplyScalar(-s.z + 1);

			normalz.copy(_eye).normalize();
			normalx.copy(_eye).cross(this.object.up).normalize();

			var rx = new THREE.Quaternion().setFromAxisAngle(normalx, s.rx);
			var ry = new THREE.Quaternion().setFromAxisAngle(this.object.up, s.ry);
			var rz = new THREE.Quaternion().setFromAxisAngle(normalz, s.rz);

			rx.multiply(ry).multiply(rz);
			//var euler = new THREE.Euler( s.rx, s.ry, s.rz, 'XYZ' );
			//var quaternion = new THREE.Quaternion();
			//quaternion.setFromEuler(euler);

			_eye.applyQuaternion( rx );
			_this.object.up.applyQuaternion( rx );


			//console.log(s.x);
			//var left = new THREE.Vector3().copy(_eye).cross(_this.object.up).normalize().multiplyScalar(-s.x * 10);

			//_this.target.add(left);

			/*

			var left = new THREE.Vector3(_eye, _this.object.up);
			var cross = new THREE.Vector3().crossVectors(left, nl);

			var angle = Math.acos()
			*/
		}

	}
	
}