// constants

orb.Constants = {
	Fragment: {},
	Vertex: {},
};

orb.Constants.Atmosphere = {

	Kr				: 0.0025,
	Km				: 0.0010,
	ESun			: 20.0,
	g				: -0.950,
	wavelength		: [0.650, 0.570, 0.475],
	scaleDepth		: 0.25,
	mieScaleDepth	: 0.1,

	innerRadius		: 100,
	outerRadius		: 100 * 1.01

};

orb.Constants.BV = 
[0x9bb2ff, 0x9eb5ff, 0xa3b9ff, 0xaabfff, 0xb2c5ff, 0xbbccff, 0xc4d2ff,
 0xccd8ff, 0xd3ddff, 0xdae2ff, 0xdfe5ff, 0xe4e9ff, 0xe9ecff, 0xeeefff,
 0xf3f2ff, 0xf8f6ff, 0xfef9ff, 0xfff9fb, 0xfff7f5, 0xfff5ef, 0xfff3ea,
 0xfff1e5, 0xffefe0, 0xffeddb, 0xffebd6, 0xffe9d2, 0xffe8ce, 0xffe6ca,
 0xffe5c6, 0xffe3c3, 0xffe2bf, 0xffe0bb, 0xffdfb8, 0xffddb4, 0xffdbb0,
 0xffdaad, 0xffd8a9, 0xffd6a5, 0xffd5a1, 0xffd29c, 0xffd096, 0xffcc8f,
 0xffc885, 0xffc178, 0xffb765, 0xffa94b, 0xff9523, 0xff7b00, 0xff5200];

// 
