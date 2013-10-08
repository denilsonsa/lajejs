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

function lajeTipo2(a, b, q) {
	// Coeficientes da laje tipo 2 = tabela 15 do Aderson para a <= b
	var asb = [
	{ asb: null, cxa: -560, cm0: 279, cma: 384, cmb:  70 },
	{ asb: 0.50, cxa: -560, cm0: 279, cma: 384, cmb:  70 },
	{ asb: 0.55, cxa: -546, cm0: 278, cma: 370, cmb:  76 },
	{ asb: 0.60, cxa: -529, cm0: 277, cma: 354, cmb:  82 },
	{ asb: 0.65, cxa: -509, cm0: 276, cma: 336, cmb:  90 },
	{ asb: 0.70, cxa: -489, cm0: 274, cma: 317, cmb:  98 },
	{ asb: 0.75, cxa: -468, cm0: 271, cma: 299, cmb: 106 },
	{ asb: 0.80, cxa: -446, cm0: 267, cma: 282, cmb: 113 },
	{ asb: 0.85, cxa: -424, cm0: 262, cma: 265, cmb: 120 },
	{ asb: 0.90, cxa: -401, cm0: 257, cma: 248, cmb: 126 },
	{ asb: 0.95, cxa: -377, cm0: 252, cma: 231, cmb: 133 },
	{ asb: 1.00, cxa: -352, cm0: 246, cma: 215, cmb: 138 }
	];

	// Coeficientes da laje tipo 2 = tabela 15 do Aderson para a > b
	var bsa = [
	{ bsa: null, cxa: -377, cm0: 466, cma: 212, cmb: 500 },
	{ bsa: 0.50, cxa: -377, cm0: 466, cma: 212, cmb: 500 },
	{ bsa: 0.55, cxa: -392, cm0: 443, cma: 223, cmb: 449 },
	{ bsa: 0.60, cxa: -403, cm0: 419, cma: 231, cmb: 401 },
	{ bsa: 0.65, cxa: -408, cm0: 396, cma: 237, cmb: 357 },
	{ bsa: 0.70, cxa: -409, cm0: 371, cma: 238, cmb: 313 },
	{ bsa: 0.75, cxa: -406, cm0: 346, cma: 238, cmb: 275 },
	{ bsa: 0.80, cxa: -399, cm0: 320, cma: 237, cmb: 240 },
	{ bsa: 0.85, cxa: -390, cm0: 298, cma: 233, cmb: 211 },
	{ bsa: 0.90, cxa: -377, cm0: 279, cma: 228, cmb: 183 },
	{ bsa: 0.95, cxa: -364, cm0: 262, cma: 222, cmb: 159 },
	{ bsa: 1.00, cxa: -352, cm0: 246, cma: 215, cmb: 138 }
	];

	var data = doubleTableLookup(asb, bsa, ['cxa', 'cma', 'cmb', 'cm0'], a, b);

	var ret = {
		xa: data.cxa / 10000 * q * data.smallest * data.smallest,
		ma: data.cma / 10000 * q * data.smallest * data.smallest,
		mb: data.cmb / 10000 * q * data.smallest * data.smallest,
		m0: data.cm0 / 10000 * q * data.smallest * data.smallest
	};

	checkLimits(data.relacao, data.key, data, ret);
	return ret;
}

function lajeTipo3(a, b, q) {
	// Coeficientes da laje tipo 3 = tabela 16 do Aderson para a <= b
	var asb = [
	{ asb: null, cxa: -654, cm0: 166, cma: 273, cmb:  51 },
	{ asb: 0.50, cxa: -654, cm0: 166, cma: 273, cmb:  51 },
	{ asb: 0.55, cxa: -642, cm0: 165, cma: 264, cmb:  59 },
	{ asb: 0.60, cxa: -630, cm0: 163, cma: 254, cmb:  67 },
	{ asb: 0.65, cxa: -617, cm0: 161, cma: 242, cmb:  76 },
	{ asb: 0.70, cxa: -600, cm0: 159, cma: 230, cmb:  84 },
	{ asb: 0.75, cxa: -582, cm0: 157, cma: 217, cmb:  89 },
	{ asb: 0.80, cxa: -562, cm0: 155, cma: 205, cmb:  93 },
	{ asb: 0.85, cxa: -541, cm0: 152, cma: 192, cmb:  97 },
	{ asb: 0.90, cxa: -521, cm0: 148, cma: 179, cmb: 102 },
	{ asb: 0.95, cxa: -503, cm0: 143, cma: 167, cmb: 107 },
	{ asb: 1.00, cxa: -487, cm0: 137, cma: 155, cmb: 111 }
	];

	// Coeficientes da laje tipo 3 = tabela 16 do Aderson para a > b
	var bsa = [
	{ bsa: null, cxa: -838, cm0: 182, cma: 169, cmb: 423 },
	{ bsa: 0.50, cxa: -838, cm0: 182, cma: 169, cmb: 423 },
	{ bsa: 0.55, cxa: -800, cm0: 185, cma: 171, cmb: 380 },
	{ bsa: 0.60, cxa: -762, cm0: 187, cma: 173, cmb: 338 },
	{ bsa: 0.65, cxa: -724, cm0: 186, cma: 175, cmb: 296 },
	{ bsa: 0.70, cxa: -687, cm0: 183, cma: 176, cmb: 259 },
	{ bsa: 0.75, cxa: -649, cm0: 177, cma: 174, cmb: 266 },
	{ bsa: 0.80, cxa: -612, cm0: 171, cma: 171, cmb: 197 },
	{ bsa: 0.85, cxa: -578, cm0: 164, cma: 167, cmb: 172 },
	{ bsa: 0.90, cxa: -547, cm0: 156, cma: 163, cmb: 149 },
	{ bsa: 0.95, cxa: -517, cm0: 147, cma: 160, cmb: 129 },
	{ bsa: 1.00, cxa: -487, cm0: 137, cma: 155, cmb: 111 }
	];

	var data = doubleTableLookup(asb, bsa, ['cxa', 'cma', 'cmb', 'cm0'], a, b);

	var ret = {
		xa: data.cxa / 10000 * q * data.smallest * data.smallest,
		ma: data.cma / 10000 * q * data.smallest * data.smallest,
		mb: data.cmb / 10000 * q * data.smallest * data.smallest,
		m0: data.cm0 / 10000 * q * data.smallest * data.smallest
	};

	checkLimits(data.relacao, data.key, data, ret);
	return ret;
}

function lajeTipo4(a, b, q) {
	// Coeficientes da laje tipo 4 = tabela 17 do Aderson para a <= b
	var asb = [
	{ asb: null, cxa1: -509, cxa2: -336, cma: 208, cmb: 37 },
	{ asb: 0.50, cxa1: -509, cxa2: -336, cma: 208, cmb: 37 },
	{ asb: 0.55, cxa1: -507, cxa2: -334, cma: 205, cmb: 42 },
	{ asb: 0.60, cxa1: -505, cxa2: -332, cma: 202, cmb: 48 },
	{ asb: 0.65, cxa1: -499, cxa2: -329, cma: 196, cmb: 54 },
	{ asb: 0.70, cxa1: -492, cxa2: -324, cma: 191, cmb: 60 },
	{ asb: 0.75, cxa1: -483, cxa2: -318, cma: 184, cmb: 65 },
	{ asb: 0.80, cxa1: -474, cxa2: -310, cma: 177, cmb: 69 },
	{ asb: 0.85, cxa1: -464, cxa2: -300, cma: 170, cmb: 72 },
	{ asb: 0.90, cxa1: -454, cxa2: -289, cma: 163, cmb: 75 },
	{ asb: 0.95, cxa1: -443, cxa2: -278, cma: 156, cmb: 77 },
	{ asb: 1.00, cxa1: -431, cxa2: -267, cma: 148, cmb: 79 }
	];

	// Coeficientes da laje tipo 4 = tabela 17 do Aderson para a > b
	var bsa = [
	{ bsa: null, cxa1: -818, cxa2: -374, cma: 168, cmb: 399 },
	{ bsa: 0.50, cxa1: -818, cxa2: -374, cma: 168, cmb: 399 },
	{ bsa: 0.55, cxa1: -786, cxa2: -367, cma: 172, cmb: 349 },
	{ bsa: 0.60, cxa1: -751, cxa2: -359, cma: 176, cmb: 302 },
	{ bsa: 0.65, cxa1: -714, cxa2: -350, cma: 180, cmb: 260 },
	{ bsa: 0.70, cxa1: -671, cxa2: -341, cma: 184, cmb: 221 },
	{ bsa: 0.75, cxa1: -624, cxa2: -331, cma: 181, cmb: 187 },
	{ bsa: 0.80, cxa1: -580, cxa2: -321, cma: 177, cmb: 158 },
	{ bsa: 0.85, cxa1: -538, cxa2: -309, cma: 171, cmb: 133 },
	{ bsa: 0.90, cxa1: -501, cxa2: -296, cma: 164, cmb: 112 },
	{ bsa: 0.95, cxa1: -465, cxa2: -282, cma: 156, cmb:  95 },
	{ bsa: 1.00, cxa1: -431, cxa2: -267, cma: 148, cmb:  79 }
	];

	var data = doubleTableLookup(asb, bsa, ['cma', 'cmb', 'cxa1', 'cxa2'], a, b);

	var ret = {
		ma:  data.cma  / 10000 * q * data.smallest * data.smallest,
		mb:  data.cmb  / 10000 * q * data.smallest * data.smallest,
		xa1: data.cxa1 / 10000 * q * data.smallest * data.smallest,
		xa2: data.cxa2 / 10000 * q * data.smallest * data.smallest
	};

	checkLimits(data.relacao, data.key, data, ret);
	return ret;
}

function lajeTipo5(a, b, q) {
	// Coeficientes da laje tipo 5 = tabela 18 do Aderson para a <= b
	var asb = [
	{ asb: null, cxb: -601, cma: 425, cmb: 117 },
	{ asb: 0.50, cxb: -601, cma: 425, cmb: 117 },
	{ asb: 0.55, cxb: -582, cma: 375, cmb: 133 },
	{ asb: 0.60, cxb: -562, cma: 330, cmb: 146 },
	{ asb: 0.65, cxb: -543, cma: 290, cmb: 155 },
	{ asb: 0.70, cxb: -522, cma: 254, cmb: 159 },
	{ asb: 0.75, cxb: -499, cma: 225, cmb: 160 },
	{ asb: 0.80, cxb: -475, cma: 202, cmb: 159 },
	{ asb: 0.85, cxb: -450, cma: 191, cmb: 157 },
	{ asb: 0.90, cxb: -424, cma: 163, cmb: 153 },
	{ asb: 0.95, cxb: -399, cma: 146, cmb: 149 },
	{ asb: 1.00, cxb: -375, cma: 130, cmb: 142 }
	];

	// Coeficientes da laje tipo 5 = tabela 18 do Aderson para a > b
	var bsa = [
	{ bsa: null, cxb: -572, cma:  76, cmb: 247 },
	{ bsa: 0.50, cxb: -572, cma:  76, cmb: 247 },
	{ bsa: 0.55, cxb: -546, cma:  89, cmb: 239 },
	{ bsa: 0.60, cxb: -521, cma:  99, cmb: 231 },
	{ bsa: 0.65, cxb: -496, cma: 108, cmb: 220 },
	{ bsa: 0.70, cxb: -473, cma: 115, cmb: 210 },
	{ bsa: 0.75, cxb: -451, cma: 121, cmb: 198 },
	{ bsa: 0.80, cxb: -433, cma: 125, cmb: 185 },
	{ bsa: 0.85, cxb: -417, cma: 129, cmb: 174 },
	{ bsa: 0.90, cxb: -403, cma: 131, cmb: 163 },
	{ bsa: 0.95, cxb: -389, cma: 131, cmb: 152 },
	{ bsa: 1.00, cxb: -375, cma: 130, cmb: 142 }
	];

	var data = doubleTableLookup(asb, bsa, ['cxb', 'cma', 'cmb'], a, b);

	var ret = {
		xb: data.cxb / 10000 * q * data.smallest * data.smallest,
		ma: data.cma / 10000 * q * data.smallest * data.smallest,
		mb: data.cmb / 10000 * q * data.smallest * data.smallest
	};

	checkLimits(data.relacao, data.key, data, ret);
	return ret;
}

function lajeTipo6(a, b, q) {
	// Coeficientes da laje tipo 6 = tabela 19 do Aderson para a <= b
	var asb = [
	{ asb: null, cxa: -519, cxb: -465, cma: 352, cmb:  65 },
	{ asb: 0.50, cxa: -519, cxb: -465, cma: 352, cmb:  65 },
	{ asb: 0.55, cxa: -498, cxb: -461, cma: 326, cmb:  76 },
	{ asb: 0.60, cxa: -467, cxb: -457, cma: 300, cmb:  87 },
	{ asb: 0.65, cxa: -429, cxb: -452, cma: 276, cmb:  98 },
	{ asb: 0.70, cxa: -392, cxb: -445, cma: 252, cmb: 111 },
	{ asb: 0.75, cxa: -357, cxb: -434, cma: 230, cmb: 120 },
	{ asb: 0.80, cxa: -323, cxb: -421, cma: 208, cmb: 126 },
	{ asb: 0.85, cxa: -290, cxb: -404, cma: 188, cmb: 129 },
	{ asb: 0.90, cxa: -260, cxb: -387, cma: 168, cmb: 130 },
	{ asb: 0.95, cxa: -232, cxb: -373, cma: 151, cmb: 130 },
	{ asb: 1.00, cxa: -207, cxb: -361, cma: 136, cmb: 129 }
	];

	// Coeficientes da laje tipo 6 = tabela 19 do Aderson para a > b
	var bsa = [
	{ bsa: null, cxa: -112, cxb: -591, cma:  98, cmb: 248 },
	{ bsa: 0.50, cxa: -112, cxb: -591, cma:  98, cmb: 248 },
	{ bsa: 0.55, cxa: -124, cxb: -560, cma: 104, cmb: 239 },
	{ bsa: 0.60, cxa: -136, cxb: -533, cma: 110, cmb: 229 },
	{ bsa: 0.65, cxa: -148, cxb: -507, cma: 116, cmb: 218 },
	{ bsa: 0.70, cxa: -160, cxb: -483, cma: 122, cmb: 205 },
	{ bsa: 0.75, cxa: -171, cxb: -460, cma: 126, cmb: 192 },
	{ bsa: 0.80, cxa: -181, cxb: -439, cma: 130, cmb: 179 },
	{ bsa: 0.85, cxa: -187, cxb: -418, cma: 135, cmb: 166 },
	{ bsa: 0.90, cxa: -193, cxb: -397, cma: 137, cmb: 153 },
	{ bsa: 0.95, cxa: -200, cxb: -378, cma: 137, cmb: 141 },
	{ bsa: 1.00, cxa: -207, cxb: -361, cma: 136, cmb: 129 }
	];

	var data = doubleTableLookup(asb, bsa, ['cxa', 'cxb', 'cma', 'cmb'], a, b);

	var ret = {
		xa: data.cxa / 10000 * q * data.smallest * data.smallest,
		xb: data.cxb / 10000 * q * data.smallest * data.smallest,
		ma: data.cma / 10000 * q * data.smallest * data.smallest,
		mb: data.cmb / 10000 * q * data.smallest * data.smallest
	};

	checkLimits(data.relacao, data.key, data, ret);
	return ret;
}

function lajeTipo7(a, b, q) {
	// Coeficientes da laje tipo 7 = tabela 20 do Aderson para a <= b
	var asb = [
	{ asb: null, cxa: -621, cxb: -362, cma: 251, cmb:  58 },
	{ asb: 0.50, cxa: -621, cxb: -362, cma: 251, cmb:  58 },
	{ asb: 0.55, cxa: -603, cxb: -360, cma: 235, cmb:  62 },
	{ asb: 0.60, cxa: -578, cxb: -356, cma: 217, cmb:  68 },
	{ asb: 0.65, cxa: -548, cxb: -352, cma: 198, cmb:  79 },
	{ asb: 0.70, cxa: -516, cxb: -346, cma: 179, cmb:  89 },
	{ asb: 0.75, cxa: -482, cxb: -338, cma: 161, cmb:  96 },
	{ asb: 0.80, cxa: -450, cxb: -329, cma: 143, cmb: 101 },
	{ asb: 0.85, cxa: -422, cxb: -319, cma: 128, cmb: 105 },
	{ asb: 0.90, cxa: -395, cxb: -307, cma: 117, cmb: 107 },
	{ asb: 0.95, cxa: -370, cxb: -296, cma: 104, cmb: 106 },
	{ asb: 1.00, cxa: -345, cxb: -285, cma:  95, cmb: 105 }
	];

	// Coeficientes da laje tipo 7 = tabela 20 do Aderson para a > b
	var bsa = [
	{ bsa: null, cxa: -451, cxb: -499, cma: 92, cmb: 230 },
	{ bsa: 0.50, cxa: -451, cxb: -499, cma: 92, cmb: 230 },
	{ bsa: 0.55, cxa: -441, cxb: -480, cma: 92, cmb: 211 },
	{ bsa: 0.60, cxa: -431, cxb: -460, cma: 92, cmb: 196 },
	{ bsa: 0.65, cxa: -421, cxb: -439, cma: 93, cmb: 182 },
	{ bsa: 0.70, cxa: -410, cxb: -416, cma: 93, cmb: 170 },
	{ bsa: 0.75, cxa: -399, cxb: -395, cma: 94, cmb: 159 },
	{ bsa: 0.80, cxa: -387, cxb: -373, cma: 94, cmb: 148 },
	{ bsa: 0.85, cxa: -376, cxb: -352, cma: 95, cmb: 138 },
	{ bsa: 0.90, cxa: -365, cxb: -330, cma: 96, cmb: 127 },
	{ bsa: 0.95, cxa: -355, cxb: -307, cma: 96, cmb: 116 },
	{ bsa: 1.00, cxa: -345, cxb: -285, cma: 95, cmb: 105 }
	];

	var data = doubleTableLookup(asb, bsa, ['cxa', 'cxb', 'cma', 'cmb'], a, b);

	var ret = {
		xa: data.cxa / 10000 * q * data.smallest * data.smallest,
		xb: data.cxb / 10000 * q * data.smallest * data.smallest,
		ma: data.cma / 10000 * q * data.smallest * data.smallest,
		mb: data.cmb / 10000 * q * data.smallest * data.smallest
	};

	checkLimits(data.relacao, data.key, data, ret);
	return ret;
}

function lajeTipo8(a, b, q) {
	// Coeficientes da laje tipo 8 = tabela 21 do Aderson para a <= b
	var asb = [
	{ asb: null, cxa1: -469, cxa2: -327, cma: 200, cmb: 50, cxb: -294 },
	{ asb: 0.50, cxa1: -469, cxa2: -327, cma: 200, cmb: 50, cxb: -294 },
	{ asb: 0.55, cxa1: -487, cxa2: -319, cma: 192, cmb: 51, cxb: -296 },
	{ asb: 0.60, cxa1: -475, cxa2: -309, cma: 183, cmb: 52, cxb: -297 },
	{ asb: 0.65, cxa1: -463, cxa2: -297, cma: 173, cmb: 55, cxb: -298 },
	{ asb: 0.70, cxa1: -449, cxa2: -282, cma: 161, cmb: 58, cxb: -298 },
	{ asb: 0.75, cxa1: -431, cxa2: -266, cma: 152, cmb: 66, cxb: -296 },
	{ asb: 0.80, cxa1: -412, cxa2: -249, cma: 142, cmb: 72, cxb: -293 },
	{ asb: 0.85, cxa1: -391, cxa2: -230, cma: 132, cmb: 78, cxb: -290 },
	{ asb: 0.90, cxa1: -370, cxa2: -211, cma: 122, cmb: 83, cxb: -285 },
	{ asb: 0.95, cxa1: -351, cxa2: -194, cma: 112, cmb: 86, cxb: -279 },
	{ asb: 1.00, cxa1: -333, cxa2: -178, cma: 101, cmb: 88, cxb: -270 }
	];

	// Coeficientes da laje tipo 8 = tabela 21 do Aderson para a > b
	var bsa = [
	{ bsa: null, cxa1: -449, cxa2: -111, cma:  92, cmb: 223, cxb: -500 },
	{ bsa: 0.50, cxa1: -449, cxa2: -111, cma:  92, cmb: 223, cxb: -500 },
	{ bsa: 0.55, cxa1: -434, cxa2: -123, cma:  92, cmb: 210, cxb: -482 },
	{ bsa: 0.60, cxa1: -427, cxa2: -135, cma:  92, cmb: 196, cxb: -461 },
	{ bsa: 0.65, cxa1: -419, cxa2: -147, cma:  92, cmb: 180, cxb: -438 },
	{ bsa: 0.70, cxa1: -410, cxa2: -158, cma:  93, cmb: 164, cxb: -414 },
	{ bsa: 0.75, cxa1: -399, cxa2: -166, cma:  97, cmb: 150, cxb: -387 },
	{ bsa: 0.80, cxa1: -387, cxa2: -171, cma: 101, cmb: 136, cxb: -360 },
	{ bsa: 0.85, cxa1: -375, cxa2: -175, cma: 103, cmb: 123, cxb: -336 },
	{ bsa: 0.90, cxa1: -362, cxa2: -177, cma: 104, cmb: 111, cxb: -313 },
	{ bsa: 0.95, cxa1: -348, cxa2: -178, cma: 103, cmb:  99, cxb: -291 },
	{ bsa: 1.00, cxa1: -333, cxa2: -178, cma: 101, cmb:  88, cxb: -270 }
	];

	var data = doubleTableLookup(asb, bsa, ['cxb', 'cma', 'cmb', 'cxa1', 'cxa2'], a, b);

	var ret = {
		xb:  data.cxb  / 10000 * q * data.smallest * data.smallest,
		ma:  data.cma  / 10000 * q * data.smallest * data.smallest,
		mb:  data.cmb  / 10000 * q * data.smallest * data.smallest,
		xa1: data.cxa1 / 10000 * q * data.smallest * data.smallest,
		xa2: data.cxa2 / 10000 * q * data.smallest * data.smallest
	};

	checkLimits(data.relacao, data.key, data, ret);
	return ret;
}

function lajeTipo9(a, b, q) {
	// Laje tipo 9 = tabela 22 do Aderson
	var asb = [
	{ asb: null, cma:  51, cmb:  40, cmr:  73 },
	{ asb: 0.30, cma:  51, cmb:  40, cmr:  73 },
	{ asb: 0.35, cma:  65, cmb:  58, cmr:  97 },
	{ asb: 0.40, cma:  79, cmb:  67, cmr: 121 },
	{ asb: 0.45, cma:  92, cmb:  86, cmr: 146 },
	{ asb: 0.50, cma: 104, cmb: 105, cmr: 171 },
	{ asb: 0.55, cma: 114, cmb: 125, cmr: 194 },
	{ asb: 0.60, cma: 122, cmb: 145, cmr: 215 },
	{ asb: 0.65, cma: 128, cmb: 165, cmr: 234 },
	{ asb: 0.70, cma: 133, cmb: 184, cmr: 251 },
	{ asb: 0.75, cma: 137, cmb: 203, cmr: 266 },
	{ asb: 0.80, cma: 139, cmb: 222, cmr: 278 },
	{ asb: 0.85, cma: 140, cmb: 241, cmr: 288 },
	{ asb: 0.90, cma: 141, cmb: 259, cmr: 297 },
	{ asb: 0.95, cma: 140, cmb: 276, cmr: 304 },
	{ asb: 1.00, cma: 139, cmb: 292, cmr: 310 },
	{ asb: 1.10, cma: 135, cmb: 323, cmr: 315 },
	{ asb: 1.20, cma: 129, cmb: 352, cmr: 317 },
	{ asb: 1.30, cma: 123, cmb: 379, cmr: 314 },
	{ asb: 1.40, cma: 116, cmb: 404, cmr: 310 },
	{ asb: 1.50, cma: 108, cmb: 427, cmr: 304 },
	{ asb: 1.75, cma:  90, cmb: 474, cmr: 282 },
	{ asb: 2.00, cma:  70, cmb: 511, cmr: 256 }
	];

	var key = a / b;
	var data = tableLookup(asb, 'asb', ['cma', 'cmb', 'cmr'], key);

	var ret = {
		ma: data.cma / 10000 * q * b * b,
		mb: data.cmb / 10000 * q * b * b,
		mr: data.cmr / 10000 * q * b * b
	};

	checkLimits('a/b', key, data, ret);
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
		xb:  data.cxb  / 10000 * q * b * b,
		ma:  data.cma  / 10000 * q * b * b,
		mb:  data.cmb  / 10000 * q * b * b,
		xb1: data.cxb1 / 10000 * q * b * b,
		mr:  data.cmr  / 10000 * q * b * b
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
		xa:  data.cxa  / 10000 * q * b * b,
		xb:  data.cxb  / 10000 * q * b * b,
		ma:  data.cma  / 10000 * q * b * b,
		mb:  data.cmb  / 10000 * q * b * b,
		xb1: data.cxb1 / 10000 * q * b * b,
		mr:  data.cmr  / 10000 * q * b * b
	};

	checkLimits('a/b', key, data, ret);
	return ret;
}

function lajeTipo13(a, b, q) {
	// Laje tipo 13 = tabela tipo 1 de Kalmanock para a <= b
	var asb = [
	{ asb: null, cma: 1250, cmb: 250, cqaa: 0.50, cqba: 0.27 },
	{ asb: 0.50, cma:  965, cmb: 174, cqaa: 0.37, cqba: 0.27 },
	{ asb: 0.55, cma:  892, cmb: 210, cqaa: 0.35, cqba: 0.27 },
	{ asb: 0.60, cma:  820, cmb: 243, cqaa: 0.34, cqba: 0.27 },
	{ asb: 0.65, cma:  750, cmb: 273, cqaa: 0.33, cqba: 0.27 },
	{ asb: 0.70, cma:  683, cmb: 298, cqaa: 0.32, cqba: 0.26 },
	{ asb: 0.75, cma:  619, cmb: 318, cqaa: 0.30, cqba: 0.26 },
	{ asb: 0.80, cma:  560, cmb: 334, cqaa: 0.29, cqba: 0.26 },
	{ asb: 0.85, cma:  506, cmb: 348, cqaa: 0.28, cqba: 0.26 },
	{ asb: 0.90, cma:  456, cmb: 359, cqaa: 0.27, cqba: 0.26 },
	{ asb: 0.95, cma:  410, cmb: 365, cqaa: 0.26, cqba: 0.25 },
	{ asb: 1.00, cma:  368, cmb: 368, cqaa: 0.25, cqba: 0.25 }
	];

	// Laje tipo 13 = tabela tipo 1 de Kalmanock para a > b
	var bsa = [
	{ asb: null, cmb: 1250, cma: 250, cqba: 0.50, cqaa: 0.27 },
	{ bsa: 0.50, cmb:  965, cma: 174, cqba: 0.37, cqaa: 0.27 },
	{ bsa: 0.55, cmb:  892, cma: 210, cqba: 0.35, cqaa: 0.27 },
	{ bsa: 0.60, cmb:  820, cma: 243, cqba: 0.34, cqaa: 0.27 },
	{ bsa: 0.65, cmb:  750, cma: 273, cqba: 0.33, cqaa: 0.27 },
	{ bsa: 0.70, cmb:  683, cma: 298, cqba: 0.32, cqaa: 0.26 },
	{ bsa: 0.75, cmb:  619, cma: 318, cqba: 0.30, cqaa: 0.26 },
	{ bsa: 0.80, cmb:  560, cma: 334, cqba: 0.29, cqaa: 0.26 },
	{ bsa: 0.85, cmb:  506, cma: 348, cqba: 0.28, cqaa: 0.26 },
	{ bsa: 0.90, cmb:  456, cma: 359, cqba: 0.27, cqaa: 0.26 },
	{ bsa: 0.95, cmb:  410, cma: 365, cqba: 0.26, cqaa: 0.25 },
	{ bsa: 1.00, cmb:  368, cma: 368, cqba: 0.25, cqaa: 0.25 }
	];

	var data = doubleTableLookup(asb, bsa, ['cma', 'cmb', 'cqaa', 'cqba'], a, b);

	var ret = {
		ma:  data.cma  / 10000 * q * data.smallest * data.smallest,
		mb:  data.cmb  / 10000 * q * data.smallest * data.smallest,
		qaa: data.cqaa * q * data.smallest,
		qba: data.cqba * q * data.smallest
	};

	checkLimits(data.relacao, data.key, data, ret);
	return ret;
}

function lajeTipo14(a, b, q) {
	// Laje tipo 14 = tabela tipo 2a de Kalmanock para a <= b
	var asb = [
	{ asb: null, cxa: -1250, cma: 625, cmb: 125, cqaa: 0.38, cqae: 0.62, cqba: 0.18 },
	{ asb: 0.50, cxa: -1214, cma: 584, cmb:  73, cqaa: 0.31, cqae: 0.52, cqba: 0.17 },
	{ asb: 0.55, cxa: -1188, cma: 562, cmb:  83, cqaa: 0.30, cqae: 0.52, cqba: 0.17 },
	{ asb: 0.60, cxa: -1159, cma: 538, cmb: 105, cqaa: 0.29, cqae: 0.51, cqba: 0.17 },
	{ asb: 0.65, cxa: -1126, cma: 512, cmb: 127, cqaa: 0.28, cqae: 0.50, cqba: 0.17 },
	{ asb: 0.70, cxa: -1089, cma: 485, cmb: 149, cqaa: 0.28, cqae: 0.49, cqba: 0.17 },
	{ asb: 0.75, cxa: -1050, cma: 457, cmb: 168, cqaa: 0.27, cqae: 0.48, cqba: 0.17 },
	{ asb: 0.80, cxa: -1008, cma: 428, cmb: 187, cqaa: 0.26, cqae: 0.47, cqba: 0.17 },
	{ asb: 0.85, cxa:  -965, cma: 400, cmb: 205, cqaa: 0.26, cqae: 0.46, cqba: 0.17 },
	{ asb: 0.90, cxa:  -922, cma: 372, cmb: 221, cqaa: 0.25, cqae: 0.45, cqba: 0.17 },
	{ asb: 0.95, cxa:  -880, cma: 345, cmb: 234, cqaa: 0.24, cqae: 0.44, cqba: 0.17 },
	{ asb: 1.00, cxa:  -839, cma: 318, cmb: 243, cqaa: 0.24, cqae: 0.43, cqba: 0.17 }
	];

	// Laje tipo 14 = tabela tipo 2 de Kalmanock para a > b
	var bsa = [
	{ bsa: null, cxa: -1250, cma: 250, cmb: 1250, cqaa: 0.27, cqae: 0.43, cqba:  0.5 },
	{ bsa: 0.50, cxa: -1215, cma: 204, cmb:  880, cqaa: 0.27, cqae: 0.52, cqba: 0.31 },
	{ bsa: 0.55, cxa: -1192, cma: 240, cmb:  792, cqaa: 0.27, cqae: 0.51, cqba: 0.29 },
	{ bsa: 0.60, cxa: -1165, cma: 269, cmb:  707, cqaa: 0.26, cqae: 0.51, cqba: 0.27 },
	{ bsa: 0.65, cxa: -1133, cma: 292, cmb:  627, cqaa: 0.26, cqae: 0.50, cqba: 0.25 },
	{ bsa: 0.70, cxa: -1096, cma: 309, cmb:  553, cqaa: 0.26, cqae: 0.49, cqba: 0.24 },
	{ bsa: 0.75, cxa: -1055, cma: 319, cmb:  485, cqaa: 0.26, cqae: 0.48, cqba: 0.22 },
	{ bsa: 0.80, cxa: -1011, cma: 324, cmb:  423, cqaa: 0.25, cqae: 0.47, cqba: 0.21 },
	{ bsa: 0.85, cxa:  -967, cma: 328, cmb:  369, cqaa: 0.27, cqae: 0.46, cqba:  0.2 },
	{ bsa: 0.90, cxa:  -924, cma: 330, cmb:  323, cqaa: 0.24, cqae: 0.45, cqba: 0.19 },
	{ bsa: 0.95, cxa:  -881, cma: 327, cmb:  282, cqaa: 0.24, cqae: 0.44, cqba: 0.18 },
	{ bsa: 1.00, cxa:  -839, cma: 318, cmb:  243, cqaa: 0.24, cqae: 0.43, cqba: 0.17 }
	];

	var data = doubleTableLookup(asb, bsa, ['cxa', 'cma', 'cmb', 'cqaa', 'cqae', 'cqba'], a, b);

	var ret = {
		xa:  data.cxa  / 10000 * q * data.smallest * data.smallest,
		ma:  data.cma  / 10000 * q * data.smallest * data.smallest,
		mb:  data.cmb  / 10000 * q * data.smallest * data.smallest,
		qaa: data.cqaa * q * data.smallest,
		qae: data.cqae * q * data.smallest,
		qba: data.cqba * q * data.smallest
	};

	checkLimits(data.relacao, data.key, data, ret);
	return ret;
}

function lajeTipo15(a, b, q) {
	// Laje tipo 15 = tabela tipo 3 de Kalmanock para a <= b
	var asb = [
	{ asb: null, cxa: -1250, cxb: -783, cma: 625, cmb: 125, cqaa: 0.38, cqae: 0.82, cqba: 0.18, cqbe: 0.32 },
	{ asb: 0.50, cxa: -1177, cxb: -782, cma: 560, cmb:  79, cqaa: 0.26, cqae: 0.48, cqba: 0.16, cqbe: 0.35 },
	{ asb: 0.55, cxa: -1136, cxb: -779, cma: 529, cmb: 105, cqaa: 0.25, cqae: 0.47, cqba: 0.16, cqbe: 0.35 },
	{ asb: 0.60, cxa: -1093, cxb: -776, cma: 496, cmb: 130, cqaa: 0.24, cqae: 0.45, cqba: 0.16, cqbe: 0.35 },
	{ asb: 0.65, cxa: -1047, cxb: -773, cma: 462, cmb: 153, cqaa: 0.23, cqae: 0.44, cqba: 0.16, cqbe: 0.35 },
	{ asb: 0.70, cxa:  -996, cxb: -768, cma: 426, cmb: 171, cqaa: 0.22, cqae: 0.42, cqba: 0.16, cqbe: 0.35 },
	{ asb: 0.75, cxa:  -940, cxb: -759, cma: 390, cmb: 188, cqaa: 0.21, cqae: 0.41, cqba: 0.16, cqbe: 0.35 },
	{ asb: 0.80, cxa:  -882, cxb: -746, cma: 355, cmb: 203, cqaa: 0.20, cqae: 0.39, cqba: 0.16, cqbe: 0.35 },
	{ asb: 0.85, cxa:  -825, cxb: -731, cma: 322, cmb: 216, cqaa: 0.19, cqae: 0.38, cqba: 0.16, cqbe: 0.35 },
	{ asb: 0.90, cxa:  -773, cxb: -714, cma: 291, cmb: 226, cqaa: 0.18, cqae: 0.37, cqba: 0.16, cqbe: 0.34 },
	{ asb: 0.95, cxa:  -724, cxb: -696, cma: 262, cmb: 232, cqaa: 0.17, cqae: 0.35, cqba: 0.16, cqbe: 0.34 },
	{ asb: 1.00, cxa:  -677, cxb: -677, cma: 234, cmb: 234, cqaa: 0.16, cqae: 0.34, cqba: 0.16, cqbe: 0.34 }
	];

	// Laje tipo 15 = tabela tipo 3 de Kalmanock para a > b
	var bsa = [
	{ bsa: null, cxb: -1250, cxa: -783, cmb: 625, cma: 125, cqba: 0.38, cqbe: 0.82, cqaa: 0.18, cqae: 0.32 },
	{ bsa: 0.50, cxb: -1177, cxa: -782, cmb: 560, cma:  79, cqba: 0.26, cqbe: 0.48, cqaa: 0.16, cqae: 0.35 },
	{ bsa: 0.55, cxb: -1136, cxa: -779, cmb: 529, cma: 105, cqba: 0.25, cqbe: 0.47, cqaa: 0.16, cqae: 0.35 },
	{ bsa: 0.60, cxb: -1093, cxa: -776, cmb: 496, cma: 130, cqba: 0.24, cqbe: 0.45, cqaa: 0.16, cqae: 0.35 },
	{ bsa: 0.65, cxb: -1047, cxa: -773, cmb: 462, cma: 153, cqba: 0.23, cqbe: 0.44, cqaa: 0.16, cqae: 0.35 },
	{ bsa: 0.70, cxb:  -996, cxa: -768, cmb: 426, cma: 171, cqba: 0.22, cqbe: 0.42, cqaa: 0.16, cqae: 0.35 },
	{ bsa: 0.75, cxb:  -940, cxa: -759, cmb: 390, cma: 188, cqba: 0.21, cqbe: 0.41, cqaa: 0.16, cqae: 0.35 },
	{ bsa: 0.80, cxb:  -882, cxa: -746, cmb: 355, cma: 203, cqba: 0.20, cqbe: 0.39, cqaa: 0.16, cqae: 0.35 },
	{ bsa: 0.85, cxb:  -825, cxa: -731, cmb: 322, cma: 216, cqba: 0.19, cqbe: 0.38, cqaa: 0.16, cqae: 0.35 },
	{ bsa: 0.90, cxb:  -773, cxa: -714, cmb: 291, cma: 226, cqba: 0.18, cqbe: 0.37, cqaa: 0.16, cqae: 0.34 },
	{ bsa: 0.95, cxb:  -724, cxa: -696, cmb: 262, cma: 232, cqba: 0.17, cqbe: 0.35, cqaa: 0.16, cqae: 0.34 },
	{ bsa: 1.00, cxb:  -677, cxa: -677, cmb: 234, cma: 234, cqba: 0.16, cqbe: 0.34, cqaa: 0.16, cqae: 0.34 }
	];

	var data = doubleTableLookup(asb, bsa, ['cxa', 'cxb', 'cma', 'cmb', 'cqaa', 'cqae', 'cqba', 'cqae'], a, b);

	var ret = {
		xa:  data.cxa  / 10000 * q * data.smallest * data.smallest,
		xb:  data.cxb  / 10000 * q * data.smallest * data.smallest,
		ma:  data.cma  / 10000 * q * data.smallest * data.smallest,
		mb:  data.cmb  / 10000 * q * data.smallest * data.smallest,
		qaa: data.cqaa * q * data.smallest,
		qae: data.cqae * q * data.smallest,
		qba: data.cqba * q * data.smallest,
		qbe: data.cqbe * q * data.smallest
	};

	checkLimits(data.relacao, data.key, data, ret);
	return ret;
}

function lajeTipo16(a, b, q) {
	// Laje tipo 16 = tabela tipo 4a de Kalmanock para a <= b
	var asb = [
	{ asb: null, cxa: -833, cma: 417, cmb: 83.4, cqae: 0.50, cqba: 0.15 },
	{ asb: 0.50, cxa: -845, cma: 414, cmb:   52, cqae: 0.45, cqba:  0.1 },
	{ asb: 0.55, cxa: -843, cma: 408, cmb:   51, cqae: 0.45, cqba:  0.1 },
	{ asb: 0.60, cxa: -837, cma: 400, cmb:   50, cqae: 0.44, cqba:  0.1 },
	{ asb: 0.65, cxa: -828, cma: 391, cmb:   58, cqae: 0.44, cqba:  0.1 },
	{ asb: 0.70, cxa: -816, cma: 380, cmb:   73, cqae: 0.43, cqba:  0.1 },
	{ asb: 0.75, cxa: -801, cma: 366, cmb:   88, cqae: 0.43, cqba:  0.1 },
	{ asb: 0.80, cxa: -784, cma: 350, cmb:  103, cqae: 0.42, cqba:  0.1 },
	{ asb: 0.85, cxa: -765, cma: 335, cmb:  119, cqae: 0.42, cqba:  0.1 },
	{ asb: 0.90, cxa: -744, cma: 319, cmb:  134, cqae: 0.41, cqba:  0.1 },
	{ asb: 0.95, cxa: -722, cma: 302, cmb:  147, cqae: 0.41, cqba:  0.1 },
	{ asb: 1.00, cxa: -698, cma: 285, cmb:  158, cqae: 0.40, cqba:  0.1 }
	];

	// Laje tipo 16 = tabela tipo 4 de Kalmanock para a > b
	var bsa = [
	{ bsa: null, cxa: -1250, cma: 250, cmb: 1250, cqae: 0.53, cqba:  0.5 },
	{ bsa: 0.50, cxa: -1191, cma: 234, cmb:  799, cqae: 0.53, cqba: 0.23 },
	{ bsa: 0.55, cxa: -1154, cma: 266, cmb:  697, cqae: 0.52, cqba: 0.22 },
	{ bsa: 0.60, cxa: -1111, cma: 292, cmb:  604, cqae: 0.51, cqba:  0.2 },
	{ bsa: 0.65, cxa: -1063, cma: 310, cmb:  519, cqae: 0.50, cqba: 0.18 },
	{ bsa: 0.70, cxa: -1011, cma: 319, cmb:  442, cqae: 0.48, cqba: 0.18 },
	{ bsa: 0.75, cxa:  -957, cma: 320, cmb:  374, cqae: 0.47, cqba: 0.15 },
	{ bsa: 0.80, cxa:  -902, cma: 318, cmb:  316, cqae: 0.46, cqba: 0.14 },
	{ bsa: 0.85, cxa:  -849, cma: 314, cmb:  267, cqae: 0.44, cqba: 0.13 },
	{ bsa: 0.90, cxa:  -796, cma: 307, cmb:  225, cqae: 0.43, cqba: 0.12 },
	{ bsa: 0.95, cxa:  -745, cma: 297, cmb:  189, cqae: 0.41, cqba: 0.11 },
	{ bsa: 1.00, cxa:  -698, cma: 285, cmb:  158, cqae: 0.40, cqba:  0.1 }
	];

	var data = doubleTableLookup(asb, bsa, ['cxa', 'cma', 'cmb', 'cqae', 'cqba'], a, b);

	var ret = {
		xa:  data.cxa  / 10000 * q * data.smallest * data.smallest,
		ma:  data.cma  / 10000 * q * data.smallest * data.smallest,
		mb:  data.cmb  / 10000 * q * data.smallest * data.smallest,
		qae: data.cqae * q * data.smallest,
		qba: data.cqba * q * data.smallest
	};

	checkLimits(data.relacao, data.key, data, ret);
	return ret;
}

function lajeTipo17(a, b, q) {
	// Laje tipo 17 = tabela tipo 5 de Kalmanock para a <= b
	var asb = [
	{ asb: null, cxa: -1250, cxb: -783, cma: 625, cmb: 125, cqaa: 0.38, cqae: 0.62, cqbe: 0.32 },
	{ asb: 0.50, cxa: -1140, cxb: -782, cma: 535, cmb:  98, cqaa: 0.22, cqae: 0.43, cqbe: 0.34 },
	{ asb: 0.55, cxa: -1101, cxb: -774, cma: 492, cmb: 127, cqaa: 0.21, cqae: 0.41, cqbe: 0.34 },
	{ asb: 0.60, cxa: -1046, cxb: -765, cma: 452, cmb: 153, cqaa: 0.19, cqae: 0.40, cqbe: 0.34 },
	{ asb: 0.65, cxa:  -978, cxb: -755, cma: 411, cmb: 177, cqaa: 0.18, cqae: 0.38, cqbe: 0.34 },
	{ asb: 0.70, cxa:  -907, cxb: -743, cma: 368, cmb: 198, cqaa: 0.17, cqae: 0.38, cqbe: 0.34 },
	{ asb: 0.75, cxa:  -839, cxb: -727, cma: 327, cmb: 214, cqaa: 0.15, cqae: 0.34, cqbe: 0.34 },
	{ asb: 0.80, cxa:  -773, cxb: -706, cma: 289, cmb: 224, cqaa: 0.14, cqae: 0.32, cqbe: 0.33 },
	{ asb: 0.85, cxa:  -710, cxb: -682, cma: 254, cmb: 229, cqaa: 0.13, cqae: 0.31, cqbe: 0.33 },
	{ asb: 0.90, cxa:  -652, cxb: -655, cma: 222, cmb: 231, cqaa: 0.12, cqae: 0.29, cqbe: 0.33 },
	{ asb: 0.95, cxa:  -599, cxb: -626, cma: 193, cmb: 230, cqaa: 0.11, cqae: 0.28, cqbe: 0.32 },
	{ asb: 1.00, cxa:  -551, cxb: -596, cma: 167, cmb: 228, cqaa: 0.11, cqae: 0.27, cqbe: 0.32 }
	];

	// Laje tipo 17 = tabela tipo 5a de Kalmanock para a > b
	var bsa = [
	{ bsa: null, cxa: -556, cxb: -833, cma: 83.4, cmb: 417, cqaa: 0.15, cqae: 0.27, cqbe: 0.41 },
	{ bsa: 0.50, cxa: -563, cxb: -836, cma:   51, cmb: 409, cqaa: 0.10, cqae: 0.25, cqbe: 0.41 },
	{ bsa: 0.55, cxa: -564, cxb: -826, cma:   50, cmb: 398, cqaa: 0.10, cqae: 0.25, cqbe:  0.4 },
	{ bsa: 0.60, cxa: -566, cxb: -813, cma:   59, cmb: 385, cqaa: 0.10, cqae: 0.25, cqbe: 0.39 },
	{ bsa: 0.65, cxa: -569, cxb: -796, cma:   75, cmb: 370, cqaa: 0.10, cqae: 0.26, cqbe: 0.38 },
	{ bsa: 0.70, cxa: -572, cxb: -774, cma:   91, cmb: 352, cqaa: 0.10, cqae: 0.26, cqbe: 0.38 },
	{ bsa: 0.75, cxa: -571, cxb: -748, cma:  107, cmb: 333, cqaa: 0.10, cqae: 0.26, cqbe: 0.37 },
	{ bsa: 0.80, cxa: -568, cxb: -720, cma:  123, cmb: 313, cqaa: 0.10, cqae: 0.26, cqbe: 0.36 },
	{ bsa: 0.85, cxa: -564, cxb: -691, cma:  138, cmb: 292, cqaa: 0.10, cqae: 0.26, cqbe: 0.35 },
	{ bsa: 0.90, cxa: -560, cxb: -660, cma:  151, cmb: 270, cqaa: 0.10, cqae: 0.26, cqbe: 0.34 },
	{ bsa: 0.95, cxa: -556, cxb: -628, cma:  161, cmb: 249, cqaa: 0.10, cqae: 0.26, cqbe: 0.33 },
	{ bsa: 1.00, cxa: -551, cxb: -596, cma:  167, cmb: 228, cqaa: 0.11, cqae: 0.27, cqbe: 0.32 }
	];

	var data = doubleTableLookup(asb, bsa, ['cxa', 'cxb', 'cma', 'cmb', 'cqaa', 'cqae', 'cqbe'], a, b);

	var ret = {
		xa:  data.cxa  / 10000 * q * data.smallest * data.smallest,
		xb:  data.cxb  / 10000 * q * data.smallest * data.smallest,
		ma:  data.cma  / 10000 * q * data.smallest * data.smallest,
		mb:  data.cmb  / 10000 * q * data.smallest * data.smallest,
		qaa: data.cqaa * q * data.smallest,
		qae: data.cqae * q * data.smallest,
		qba: data.cqbe * q * data.smallest
	};

	checkLimits(data.relacao, data.key, data, ret);
	return ret;
}

function lajeTipo18(a, b, q) {
	// Laje tipo 18 = tabela tipo 6 de Kalmanock para a <= b
	var asb = [
	{ asb: null, cxa: -833, cxb: -556, cma: 415, cmb:  83, cqae: 0.50, cqbe: 0.27 },
	{ asb: 0.50, cxa: -826, cxb: -560, cma: 401, cmb:  51, cqae: 0.30, cqbe: 0.24 },
	{ asb: 0.55, cxa: -806, cxb: -561, cma: 385, cmb:  55, cqae: 0.37, cqbe: 0.24 },
	{ asb: 0.60, cxa: -784, cxb: -562, cma: 367, cmb:  76, cqae: 0.35, cqbe: 0.25 },
	{ asb: 0.65, cxa: -759, cxb: -565, cma: 346, cmb:  96, cqae: 0.34, cqbe: 0.25 },
	{ asb: 0.70, cxa: -731, cxb: -568, cma: 322, cmb: 114, cqae: 0.33, cqbe: 0.25 },
	{ asb: 0.75, cxa: -698, cxb: -564, cma: 297, cmb: 129, cqae: 0.31, cqbe: 0.25 },
	{ asb: 0.80, cxa: -661, cxb: -558, cma: 271, cmb: 143, cqae: 0.30, cqbe: 0.25 },
	{ asb: 0.85, cxa: -620, cxb: -550, cma: 246, cmb: 156, cqae: 0.29, cqbe: 0.25 },
	{ asb: 0.90, cxa: -580, cxb: -540, cma: 222, cmb: 167, cqae: 0.28, cqbe: 0.25 },
	{ asb: 0.95, cxa: -543, cxb: -527, cma: 198, cmb: 173, cqae: 0.26, cqbe: 0.25 },
	{ asb: 1.00, cxa: -511, cxb: -511, cma: 176, cmb: 176, cqae: 0.25, cqbe: 0.25 }
	];

	// Laje tipo 18 = tabela tipo 6 de Kalmanock para a > b
	var bsa = [
	{ bsa: null, cxb: -833, cxa: -556, cmb: 415, cma:  83, cqbe: 0.50, cqae: 0.27 },
	{ bsa: 0.50, cxb: -826, cxa: -560, cmb: 401, cma:  51, cqbe: 0.30, cqae: 0.24 },
	{ bsa: 0.55, cxb: -806, cxa: -561, cmb: 385, cma:  55, cqbe: 0.37, cqae: 0.24 },
	{ bsa: 0.60, cxb: -784, cxa: -562, cmb: 367, cma:  76, cqbe: 0.35, cqae: 0.25 },
	{ bsa: 0.65, cxb: -759, cxa: -565, cmb: 346, cma:  96, cqbe: 0.34, cqae: 0.25 },
	{ bsa: 0.70, cxb: -731, cxa: -568, cmb: 322, cma: 114, cqbe: 0.33, cqae: 0.25 },
	{ bsa: 0.75, cxb: -698, cxa: -564, cmb: 297, cma: 129, cqbe: 0.31, cqae: 0.25 },
	{ bsa: 0.80, cxb: -661, cxa: -558, cmb: 271, cma: 143, cqbe: 0.30, cqae: 0.25 },
	{ bsa: 0.85, cxb: -620, cxa: -550, cmb: 246, cma: 156, cqbe: 0.29, cqae: 0.25 },
	{ bsa: 0.90, cxb: -580, cxa: -540, cmb: 222, cma: 167, cqbe: 0.28, cqae: 0.25 },
	{ bsa: 0.95, cxb: -543, cxa: -527, cmb: 198, cma: 173, cqbe: 0.26, cqae: 0.25 },
	{ bsa: 1.00, cxb: -511, cxa: -511, cmb: 176, cma: 176, cqbe: 0.25, cqae: 0.25 }
	];

	var data = doubleTableLookup(asb, bsa, ['cxa', 'cxb', 'cma', 'cmb', 'cqae', 'cqbe'], a, b);

	var ret = {
		xa:  data.cxa  / 10000 * q * data.smallest * data.smallest,
		xb:  data.cxb  / 10000 * q * data.smallest * data.smallest,
		ma:  data.cma  / 10000 * q * data.smallest * data.smallest,
		mb:  data.cmb  / 10000 * q * data.smallest * data.smallest,
		qae: data.cqae * q * data.smallest,
		qba: data.cqbe * q * data.smallest
	};

	checkLimits(data.relacao, data.key, data, ret);
	return ret;
}

function lajeTipo19(a, b, q) {
	// Laje tipo 19 = tabela 25A do Aderson
	var asb = [
	{ asb: null, cma: 100, cmb:  114, cmr:  218 },
	{ asb: 0.30, cma: 100, cmb:  114, cmr:  218 },
	{ asb: 0.35, cma: 126, cmb:  150, cmr:  290 },
	{ asb: 0.40, cma: 151, cmb:  194, cmr:  363 },
	{ asb: 0.45, cma: 174, cmb:  243, cmr:  436 },
	{ asb: 0.50, cma: 192, cmb:  295, cmr:  510 },
	{ asb: 0.55, cma: 206, cmb:  346, cmr:  583 },
	{ asb: 0.60, cma: 217, cmb:  396, cmr:  651 },
	{ asb: 0.65, cma: 224, cmb:  446, cmr:  716 },
	{ asb: 0.70, cma: 228, cmb:  493, cmr:  774 },
	{ asb: 0.75, cma: 230, cmb:  538, cmr:  828 },
	{ asb: 0.80, cma: 231, cmb:  581, cmr:  875 },
	{ asb: 0.85, cma: 230, cmb:  622, cmr:  917 },
	{ asb: 0.90, cma: 228, cmb:  661, cmr:  955 },
	{ asb: 0.95, cma: 223, cmb:  698, cmr:  992 },
	{ asb: 1.00, cma: 216, cmb:  733, cmr: 1026 },
	{ asb: 1.10, cma: 204, cmb:  797, cmr: 1076 },
	{ asb: 1.20, cma: 189, cmb:  853, cmr: 1119 },
	{ asb: 1.30, cma: 175, cmb:  902, cmr: 1148 },
	{ asb: 1.40, cma: 161, cmb:  944, cmr: 1172 },
	{ asb: 1.50, cma: 148, cmb:  979, cmr: 1191 },
	{ asb: 1.75, cma: 116, cmb: 1051, cmr: 1213 },
	{ asb: 2.00, cma:  88, cmb: 1106, cmr: 1232 }
	];

	var key = a / b;
	var data = tableLookup(asb, 'asb', ['cma', 'cmb', 'cmr'], key);

	var ret = {
		ma: data.cma / 10000 * q * b * b,
		mb: data.cmb / 10000 * q * b * b,
		mr: data.cmr / 10000 * q * b * b
	};

	checkLimits('a/b', key, data, ret);
	return ret;
}

function lajeTipo20(a, b, q) {
	// Laje tipo 20 = tabela 25B do Aderson
	var asb = [
	{ asb: null, cxa:  -372, cma:   -53, cmb:   15, cmr:   50 },
	{ asb: 0.30, cxa:  -372, cma:   -53, cmb:   15, cmr:   50 },
	{ asb: 0.35, cxa:  -468, cma:   -41, cmb:   26, cmr:   88 },
	{ asb: 0.40, cxa:  -560, cma:   -29, cmb:   44, cmr:  133 },
	{ asb: 0.45, cxa:  -649, cma:   -16, cmb:   72, cmr:  189 },
	{ asb: 0.50, cxa:  -734, cma: 0.001, cmb:  104, cmr:  255 },
	{ asb: 0.55, cxa:  -811, cma:    20, cmb:  138, cmr:  325 },
	{ asb: 0.60, cxa:  -878, cma:    43, cmb:  174, cmr:  395 },
	{ asb: 0.65, cxa:  -935, cma:    66, cmb:  214, cmr:  465 },
	{ asb: 0.70, cxa:  -992, cma:    87, cmb:  256, cmr:  535 },
	{ asb: 0.75, cxa: -1036, cma:   105, cmb:  300, cmr:  606 },
	{ asb: 0.80, cxa: -1077, cma:   121, cmb:  345, cmr:  676 },
	{ asb: 0.85, cxa: -1111, cma:   135, cmb:  388, cmr:  736 },
	{ asb: 0.90, cxa: -1138, cma:   148, cmb:  429, cmr:  787 },
	{ asb: 0.95, cxa: -1160, cma:   159, cmb:  470, cmr:  835 },
	{ asb: 1.00, cxa: -1177, cma:   169, cmb:  510, cmr:  881 },
	{ asb: 1.10, cxa: -1201, cma:   177, cmb:  584, cmr:  959 },
	{ asb: 1.20, cxa: -1219, cma:   183, cmb:  652, cmr: 1024 },
	{ asb: 1.30, cxa: -1229, cma:   182, cmb:  715, cmr: 1074 },
	{ asb: 1.40, cxa: -1236, cma:   179, cmb:  774, cmr: 1117 },
	{ asb: 1.50, cxa: -1242, cma:   172, cmb:  828, cmr: 1149 },
	{ asb: 1.75, cxa: -1248, cma:   149, cmb:  940, cmr: 1192 },
	{ asb: 2.00, cxa: -1250, cma:   120, cmb: 1018, cmr: 1222 }
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

function lajeTipo21(a, b, q) {
	// Laje tipo 21 = tabela 25C do Aderson
	var asb = [
	{ asb: null, cxb: -355, cma:  81, cmb: 103, cxb1: -726, cmr: 190 },
	{ asb: 0.30, cxb: -355, cma:  81, cmb: 103, cxb1: -726, cmr: 190 },
	{ asb: 0.35, cxb: -405, cma:  93, cmb: 131, cxb1: -785, cmr: 240 },
	{ asb: 0.40, cxb: -451, cma: 102, cmb: 158, cxb1: -834, cmr: 281 },
	{ asb: 0.45, cxb: -494, cma: 109, cmb: 185, cxb1: -874, cmr: 315 },
	{ asb: 0.50, cxb: -534, cma: 114, cmb: 210, cxb1: -895, cmr: 342 },
	{ asb: 0.55, cxb: -571, cma: 119, cmb: 232, cxb1: -990, cmr: 364 },
	{ asb: 0.60, cxb: -605, cma: 122, cmb: 253, cxb1: -901, cmr: 382 },
	{ asb: 0.65, cxb: -635, cma: 120, cmb: 271, cxb1: -900, cmr: 396 },
	{ asb: 0.70, cxb: -662, cma: 115, cmb: 286, cxb1: -897, cmr: 406 },
	{ asb: 0.75, cxb: -686, cma: 109, cmb: 300, cxb1: -892, cmr: 412 },
	{ asb: 0.80, cxb: -706, cma: 103, cmb: 314, cxb1: -885, cmr: 415 },
	{ asb: 0.85, cxb: -724, cma:  98, cmb: 326, cxb1: -872, cmr: 416 },
	{ asb: 0.90, cxb: -740, cma:  94, cmb: 336, cxb1: -860, cmr: 417 },
	{ asb: 0.95, cxb: -754, cma:  90, cmb: 344, cxb1: -848, cmr: 418 },
	{ asb: 1.00, cxb: -767, cma:  85, cmb: 351, cxb1: -843, cmr: 419 },
	{ asb: 1.10, cxb: -789, cma:  74, cmb: 359, cxb1: -840, cmr: 419 },
	{ asb: 1.20, cxb: -806, cma:  61, cmb: 365, cxb1: -838, cmr: 418 },
	{ asb: 1.30, cxb: -817, cma:  47, cmb: 371, cxb1: -836, cmr: 418 },
	{ asb: 1.40, cxb: -823, cma:  35, cmb: 377, cxb1: -835, cmr: 417 },
	{ asb: 1.50, cxb: -826, cma:  25, cmb: 383, cxb1: -834, cmr: 417 },
	{ asb: 1.75, cxb: -830, cma:  15, cmb: 400, cxb1: -833, cmr: 417 },
	{ asb: 2.00, cxb: -833, cma:   8, cmb: 417, cxb1: -833, cmr: 417 }
	];

	var key = a / b;
	var data = tableLookup(asb, 'asb', ['cxb', 'cma', 'cmb', 'cxb1', 'cmr'], key);

	var ret = {
		xb:  data.cxb  / 10000 * q * b * b,
		ma:  data.cma  / 10000 * q * b * b,
		mb:  data.cmb  / 10000 * q * b * b,
		xb1: data.cxb1 / 10000 * q * b * b,
		mr:  data.cmr  / 10000 * q * b * b
	};

	checkLimits('a/b', key, data, ret);
	return ret;
}

function lajeTipo22(a, b, q) {
	// Laje tipo 22 = tabela 25D do Aderson
	var asb = [
	{ asb: null, cxa: -327, cxb: -133, cma: -38, cmb:  26, cxb1: -379, cmr:  77 },
	{ asb: 0.30, cxa: -327, cxb: -133, cma: -38, cmb:  26, cxb1: -379, cmr:  77 },
	{ asb: 0.35, cxa: -396, cxb: -165, cma: -23, cmb:  47, cxb1: -471, cmr: 126 },
	{ asb: 0.40, cxa: -453, cxb: -206, cma:  -6, cmb:  67, cxb1: -563, cmr: 171 },
	{ asb: 0.45, cxa: -486, cxb: -262, cma:  12, cmb:  87, cxb1: -655, cmr: 210 },
	{ asb: 0.50, cxa: -511, cxb: -319, cma:  29, cmb: 108, cxb1: -742, cmr: 246 },
	{ asb: 0.55, cxa: -526, cxb: -369, cma:  44, cmb: 131, cxb1: -783, cmr: 279 },
	{ asb: 0.60, cxa: -538, cxb: -415, cma:  56, cmb: 154, cxb1: -815, cmr: 309 },
	{ asb: 0.65, cxa: -548, cxb: -460, cma:  66, cmb: 175, cxb1: -830, cmr: 335 },
	{ asb: 0.70, cxa: -556, cxb: -496, cma:  74, cmb: 194, cxb1: -858, cmr: 356 },
	{ asb: 0.75, cxa: -560, cxb: -528, cma:  81, cmb: 212, cxb1: -869, cmr: 372 },
	{ asb: 0.80, cxa: -562, cxb: -559, cma:  87, cmb: 229, cxb1: -872, cmr: 385 },
	{ asb: 0.85, cxa: -563, cxb: -589, cma:  91, cmb: 244, cxb1: -873, cmr: 395 },
	{ asb: 0.90, cxa: -562, cxb: -618, cma:  92, cmb: 258, cxb1: -872, cmr: 402 },
	{ asb: 0.95, cxa: -561, cxb: -647, cma:  91, cmb: 271, cxb1: -870, cmr: 408 },
	{ asb: 1.00, cxa: -560, cxb: -675, cma:  90, cmb: 283, cxb1: -866, cmr: 413 },
	{ asb: 1.10, cxa: -559, cxb: -703, cma:  85, cmb: 303, cxb1: -858, cmr: 415 },
	{ asb: 1.20, cxa: -558, cxb: -731, cma:  77, cmb: 321, cxb1: -849, cmr: 416 },
	{ asb: 1.30, cxa: -557, cxb: -759, cma:  67, cmb: 337, cxb1: -842, cmr: 417 },
	{ asb: 1.40, cxa: -556, cxb: -785, cma:  59, cmb: 351, cxb1: -838, cmr: 417 },
	{ asb: 1.50, cxa: -556, cxb: -805, cma:  52, cmb: 362, cxb1: -836, cmr: 417 },
	{ asb: 1.75, cxa: -556, cxb: -823, cma:  30, cmb: 381, cxb1: -834, cmr: 417 },
	{ asb: 2.00, cxa: -556, cxb: -833, cma:  15, cmb: 395, cxb1: -833, cmr: 417 }
	];

	var key = a / b;
	var data = tableLookup(asb, 'asb', ['cxa', 'cxb', 'cma', 'cmb', 'cxb1', 'cmr'], key);

	var ret = {
		xa:  data.cxa  / 10000 * q * b * b,
		xb:  data.cxb  / 10000 * q * b * b,
		ma:  data.cma  / 10000 * q * b * b,
		mb:  data.cmb  / 10000 * q * b * b,
		xb1: data.cxb1 / 10000 * q * b * b,
		mr:  data.cmr  / 10000 * q * b * b
	};

	checkLimits('a/b', key, data, ret);
	return ret;
}

var laje_functions = {
	'1': lajeTipo1,
	'2': lajeTipo2,
	'3': lajeTipo3,
	'4': lajeTipo4,
	'5': lajeTipo5,
	'6': lajeTipo6,
	'7': lajeTipo7,
	'8': lajeTipo8,
	'9': lajeTipo9,
	'10': lajeTipo10,
	'11': lajeTipo11,
	'12': lajeTipo12,
	'13': lajeTipo13,
	'14': lajeTipo14,
	'15': lajeTipo15,
	'16': lajeTipo16,
	'17': lajeTipo17,
	'18': lajeTipo18,
	'19': lajeTipo19,
	'20': lajeTipo20,
	'21': lajeTipo21,
	'22': lajeTipo22
};
