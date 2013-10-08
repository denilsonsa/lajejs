/*jslint browser: true, devel: true, sloppy: true, white: true */

// vim:foldmethod=marker foldmarker={,}

"use strict";

// Returns a linear interpolation of y1,y2 based on x value between x1,x2.
function linearInterp(x, x1, x2, y1, y2) {
	return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
}

// Receives a table, a string (key_name), a list of strings (value_names) and a
// Number (key). Looks up the key in the key_name column and returns a linear
// interpolation of values from value_names columns.
//
// The table is an Array of objects. Each column/cell is an attribute of the
// object.
// The table must be sorted in ascending order (considering the key_name
// column).
// The object zero of the table is for key values lower than
// table[1][key_name].
//
// Yeah, I know, it seems a bit confusing. But at the same time it is simple
// and flexible.
function tableLookup(table, key_name, value_names, key) {
	var ret = {
		overLimit: false,
		underLimit: false
	};

	if (key < table[1][key_name]) {
		// The key is smaller than row 1, using the fallback value from row 0.
		ret.underLimit = true;
		ret.limit = table[1][key_name];
		for (var j = 0; j < value_names.length; j++) {
			var name = value_names[j];
			ret[name] = table[0][name];
		}
		return ret;
	} else {
		// Looking up the key starting between rows 1 and 2.
		for (var i = 2; i < table.length; i++) {
			if (table[i][key_name] >= key) {
				for (var j = 0; j < value_names.length; j++) {
					var name = value_names[j];
					ret[name] = linearInterp(
							key,
							table[i - 1][key_name], table[i][key_name],
							table[i - 1][name], table[i][name]);
				}
				return ret;
			}
		}
	}
	// Key not found, it means it is larger than the maximum row value. Using
	// the maximum value.
	var last = table.length - 1;
	ret.overLimit = true;
	ret.limit = table[last][key_name];
	for (var j = 0; j < value_names.length; j++) {
		var name = value_names[j];
		ret[name] = table[last][name];
	}
	return ret;
}


// Convenience function, in order to reduce copy-paste.
// Returns the same as tableLookup(), but augmented with a few extra
// attributes.
function doubleTableLookup(asb, bsa, value_names, a, b) {
	var data;

	if (a <= b) {
		data = tableLookup(asb, 'asb', value_names, a / b);
		data.smallest = a;
		data.largest = b;
		data.key = a / b;
		data.relacao = 'a/b';
	} else {
		data = tableLookup(bsa, 'bsa', value_names, b / a);
		data.smallest = b;
		data.largest = a;
		data.key = b / a;
		data.relacao = 'b/a';
	}

	return data;
}

// Convenience function, in order to reduce copy-paste.
function checkLimits(relacao, key, data, ret) {
	if (data.underLimit || data.overLimit) {
		var msg = '(' + relacao + ') = ' + key.toFixed(2) + '. Os valores foram calculados para uma relação (' + relacao + ') = ' + data.limit.toFixed(2) + '.';
		ret.msg = msg;
	}
}

function lajeTipo1(a, b, q) {
	// Coeficientes da laje tipo 1 = tabela 14 do Aderson para a <= b
	var asb = [
	{ asb: null, cm01: 377, cm02: 284, cma: 502, cmb: 117 },
	{ asb: 0.50, cm01: 377, cm02: 284, cma: 502, cmb: 117 },
	{ asb: 0.55, cm01: 371, cm02: 277, cma: 468, cmb: 126 },
	{ asb: 0.60, cm01: 364, cm02: 269, cma: 435, cmb: 135 },
	{ asb: 0.65, cm01: 356, cm02: 261, cma: 402, cmb: 142 },
	{ asb: 0.70, cm01: 347, cm02: 252, cma: 369, cmb: 149 },
	{ asb: 0.75, cm01: 337, cm02: 242, cma: 339, cmb: 159 },
	{ asb: 0.80, cm01: 327, cm02: 232, cma: 311, cmb: 167 },
	{ asb: 0.85, cm01: 315, cm02: 221, cma: 285, cmb: 174 },
	{ asb: 0.90, cm01: 303, cm02: 209, cma: 260, cmb: 180 },
	{ asb: 0.95, cm01: 291, cm02: 197, cma: 237, cmb: 183 },
	{ asb: 1.00, cm01: 279, cm02: 185, cma: 216, cmb: 184 }
	];

	// Coeficientes da laje tipo 1 = tabela 14 do Aderson para a > b
	var bsa = [
	{ bsa: null, cm01: 471, cm02: 199, cma: 208, cmb: 514 },
	{ bsa: 0.50, cm01: 471, cm02: 199, cma: 208, cmb: 514 },
	{ bsa: 0.55, cm01: 449, cm02: 199, cma: 218, cmb: 470 },
	{ bsa: 0.60, cm01: 427, cm02: 206, cma: 225, cmb: 425 },
	{ bsa: 0.65, cm01: 406, cm02: 211, cma: 230, cmb: 384 },
	{ bsa: 0.70, cm01: 386, cm02: 213, cma: 233, cmb: 345 },
	{ bsa: 0.75, cm01: 367, cm02: 212, cma: 233, cmb: 311 },
	{ bsa: 0.80, cm01: 348, cm02: 209, cma: 232, cmb: 280 },
	{ bsa: 0.85, cm01: 329, cm02: 206, cma: 230, cmb: 253 },
	{ bsa: 0.90, cm01: 311, cm02: 201, cma: 288, cmb: 228 },
	{ bsa: 0.95, cm01: 294, cm02: 194, cma: 223, cmb: 205 },
	{ bsa: 1.00, cm01: 279, cm02: 185, cma: 216, cmb: 184 }
	];

	var data = doubleTableLookup(asb, bsa, ['cma', 'cmb', 'cm01', 'cm02'], a, b);

	var ret = {
		ma:  data.cma  / 10000 * q * data.smallest * data.smallest,
		mb:  data.cmb  / 10000 * q * data.smallest * data.smallest,
		m01: data.cm01 / 10000 * q * data.smallest * data.smallest,
		m02: data.cm02 / 10000 * q * data.smallest * data.smallest
	};

	checkLimits(data.relacao, data.key, data, ret);
	return ret;
}

function lajeTipo10(a, b, q) {
	// Laje tipo 10 = tabela 23 do Aderson
	var asb = [
	{ asb: null, cxa: -131, cma:  -3, cmb:   6, cmr:  13 },
	{ asb: 0.30, cxa: -131, cma:  -3, cmb:   6, cmr:  13 },
	{ asb: 0.35, cxa: -167, cma:   4, cmb:   8, cmr:  24 },
	{ asb: 0.40, cxa: -204, cma:  12, cmb:  12, cmr:  37 },
	{ asb: 0.45, cxa: -243, cma:  21, cmb:  20, cmr:  52 },
	{ asb: 0.50, cxa: -280, cma:  30, cmb:  30, cmr:  69 },
	{ asb: 0.55, cxa: -315, cma:  40, cmb:  42, cmr:  89 },
	{ asb: 0.60, cxa: -349, cma:  51, cmb:  56, cmr: 110 },
	{ asb: 0.65, cxa: -382, cma:  61, cmb:  70, cmr: 130 },
	{ asb: 0.70, cxa: -415, cma:  71, cmb:  84, cmr: 149 },
	{ asb: 0.75, cxa: -447, cma:  80, cmb:  99, cmr: 168 },
	{ asb: 0.80, cxa: -476, cma:  89, cmb: 115, cmr: 185 },
	{ asb: 0.85, cxa: -502, cma:  97, cmb: 132, cmr: 200 },
	{ asb: 0.90, cxa: -527, cma: 105, cmb: 149, cmr: 214 },
	{ asb: 0.95, cxa: -551, cma: 111, cmb: 166, cmr: 226 },
	{ asb: 1.00, cxa: -573, cma: 116, cmb: 182, cmr: 236 },
	{ asb: 1.10, cxa: -611, cma: 122, cmb: 215, cmr: 254 },
	{ asb: 1.20, cxa: -647, cma: 126, cmb: 248, cmr: 267 },
	{ asb: 1.30, cxa: -679, cma: 130, cmb: 279, cmr: 272 },
	{ asb: 1.40, cxa: -709, cma: 132, cmb: 309, cmr: 275 },
	{ asb: 1.50, cxa: -738, cma: 133, cmb: 337, cmr: 271 },
	{ asb: 1.75, cxa: -790, cma: 119, cmb: 400, cmr: 262 },
	{ asb: 2.00, cxa: -830, cma:  88, cmb: 453, cmr: 248 }
	];

	var key = a / b;
	var data = tableLookup(asb, 'asb', ['cxa', 'cma', 'cmb', 'cmr'], key);

	var ret = {
		xa: data.cxa / 10000 * q * b * b,
		ma: data.cma / 10000 * q * b * b,
		mb: data.cmb / 10000 * q * b * b,
		mr: data.cmr / 10000 * q * b * b
	};

	checkLimits('a/b', key, data, ret);
	return ret;
}

function lajeTipo11(a, b, q) {
	// Laje tipo 11 = tabela 24 do Aderson
	var asb = [
	{ asb: null, cxb: -132, cma: 45, cmb:   9, cxb1: -227, cmr:  65 },
	{ asb: 0.30, cxb: -132, cma: 45, cmb:   9, cxb1: -227, cmr:  65 },
	{ asb: 0.35, cxb: -155, cma: 54, cmb:  15, cxb1: -232, cmr:  80 },
	{ asb: 0.40, cxb: -178, cma: 62, cmb:  24, cxb1: -238, cmr:  93 },
	{ asb: 0.45, cxb: -200, cma: 69, cmb:  36, cxb1: -236, cmr: 103 },
	{ asb: 0.50, cxb: -221, cma: 74, cmb:  48, cxb1: -229, cmr: 110 },
	{ asb: 0.55, cxb: -241, cma: 76, cmb:  59, cxb1: -219, cmr: 114 },
	{ asb: 0.60, cxb: -260, cma: 77, cmb:  70, cxb1: -207, cmr: 116 },
	{ asb: 0.65, cxb: -278, cma: 78, cmb:  80, cxb1: -196, cmr: 117 },
	{ asb: 0.70, cxb: -295, cma: 78, cmb:  90, cxb1: -185, cmr: 116 },
	{ asb: 0.75, cxb: -310, cma: 77, cmb: 100, cxb1: -174, cmr: 115 },
	{ asb: 0.80, cxb: -324, cma: 76, cmb: 109, cxb1: -163, cmr: 112 },
	{ asb: 0.85, cxb: -337, cma: 73, cmb: 118, cxb1: -152, cmr: 108 },
	{ asb: 0.90, cxb: -349, cma: 70, cmb: 127, cxb1: -142, cmr: 104 },
	{ asb: 0.95, cxb: -360, cma: 67, cmb: 136, cxb1: -132, cmr: 100 },
	{ asb: 1.00, cxb: -368, cma: 63, cmb: 145, cxb1: -122, cmr:  96 },
	{ asb: 1.10, cxb: -384, cma: 56, cmb: 159, cxb1: -105, cmr:  87 },
	{ asb: 1.20, cxb: -396, cma: 50, cmb: 171, cxb1:  -90, cmr:  79 },
	{ asb: 1.30, cxb: -405, cma: 43, cmb: 179, cxb1:  -80, cmr:  72 },
	{ asb: 1.40, cxb: -410, cma: 37, cmb: 185, cxb1:  -73, cmr:  66 },
	{ asb: 1.50, cxb: -413, cma: 31, cmb: 190, cxb1:  -65, cmr:  59 },
	{ asb: 1.75, cxb: -416, cma: 19, cmb: 200, cxb1:  -58, cmr:  52 },
	{ asb: 2.00, cxb: -417, cma:  9, cmb: 206, cxb1:  -52, cmr:  47 }
	];

	var key = a / b;
	var data = tableLookup(asb, 'asb', ['cxb', 'cma', 'cmb', 'cxb1', 'cmr'], key);

	var ret = {
		xb: data.cxb / 10000 * q * b * b,
		ma: data.cma / 10000 * q * b * b,
		mb: data.cmb / 10000 * q * b * b,
		xb1: data.cxb1 / 10000 * q * b * b,
		mr: data.cmr / 10000 * q * b * b
	};

	checkLimits('a/b', key, data, ret);
	return ret;
}

function lajeTipo12(a, b, q) {
	// Laje tipo 12 = tabela 25 do Aderson
	var asb = [
	{ asb: null, cxa: -120, cxb:  -48, cma:  2, cmb:   6, cxb1:  -89, cmr: 28 },
	{ asb: 0.30, cxa: -120, cxb:  -48, cma:  2, cmb:   6, cxb1:  -89, cmr: 28 },
	{ asb: 0.35, cxa: -148, cxb:  -66, cma:  9, cmb:  12, cxb1: -112, cmr: 35 },
	{ asb: 0.40, cxa: -172, cxb:  -84, cma: 16, cmb:  18, cxb1: -131, cmr: 44 },
	{ asb: 0.45, cxa: -193, cxb: -104, cma: 24, cmb:  26, cxb1: -149, cmr: 54 },
	{ asb: 0.50, cxa: -212, cxb: -124, cma: 32, cmb:  34, cxb1: -164, cmr: 64 },
	{ asb: 0.55, cxa: -229, cxb: -145, cma: 41, cmb:  42, cxb1: -165, cmr: 72 },
	{ asb: 0.60, cxa: -246, cxb: -166, cma: 50, cmb:  50, cxb1: -165, cmr: 79 },
	{ asb: 0.65, cxa: -262, cxb: -186, cma: 57, cmb:  58, cxb1: -164, cmr: 85 },
	{ asb: 0.70, cxa: -277, cxb: -205, cma: 62, cmb:  67, cxb1: -162, cmr: 90 },
	{ asb: 0.75, cxa: -291, cxb: -222, cma: 65, cmb:  76, cxb1: -159, cmr: 94 },
	{ asb: 0.80, cxa: -304, cxb: -238, cma: 67, cmb:  85, cxb1: -153, cmr: 96 },
	{ asb: 0.85, cxa: -317, cxb: -254, cma: 69, cmb:  94, cxb1: -144, cmr: 97 },
	{ asb: 0.90, cxa: -329, cxb: -269, cma: 71, cmb: 102, cxb1: -136, cmr: 96 },
	{ asb: 0.95, cxa: -340, cxb: -283, cma: 71, cmb: 110, cxb1: -128, cmr: 95 },
	{ asb: 1.00, cxa: -349, cxb: -297, cma: 70, cmb: 118, cxb1: -120, cmr: 91 },
	{ asb: 1.10, cxa: -358, cxb: -319, cma: 68, cmb: 126, cxb1: -103, cmr: 83 },
	{ asb: 1.20, cxa: -375, cxb: -338, cma: 64, cmb: 134, cxb1:  -88, cmr: 76 },
	{ asb: 1.30, cxa: -391, cxb: -354, cma: 57, cmb: 142, cxb1:  -78, cmr: 69 },
	{ asb: 1.40, cxa: -405, cxb: -367, cma: 49, cmb: 150, cxb1:  -71, cmr: 63 },
	{ asb: 1.50, cxa: -418, cxb: -378, cma: 41, cmb: 158, cxb1:  -64, cmr: 57 },
	{ asb: 1.75, cxa: -455, cxb: -399, cma: 27, cmb: 179, cxb1:  -57, cmr: 51 },
	{ asb: 2.00, cxa: -478, cxb: -413, cma: 16, cmb: 203, cxb1:  -51, cmr: 46 }
	];

	var key = a / b;
	var data = tableLookup(asb, 'asb', ['cxa', 'cxb', 'cma', 'cmb', 'cxb1', 'cmr'], key);

	var ret = {
		xa: data.cxa / 10000 * q * b * b,
		xb: data.cxb / 10000 * q * b * b,
		ma: data.cma / 10000 * q * b * b,
		mb: data.cmb / 10000 * q * b * b,
		xb1: data.cxb1 / 10000 * q * b * b,
		mr: data.cmr / 10000 * q * b * b
	};

	checkLimits('a/b', key, data, ret);
	return ret;
}
