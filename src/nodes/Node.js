



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