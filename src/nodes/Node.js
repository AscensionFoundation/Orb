



ORB.Node = function () {

	this._id = ORB.NodeIdCount ++;
	this._uuid = '';

	this._name = '';

	this.parent = undefined;
	this.children = [];

	this._attributes = {};
	this._data = {};

};

ORB.Node.prototype = {


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

		if ( node instanceof ORB.Node ) {

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

ORB.NodeIdCount = 0;