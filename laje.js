/*jslint browser: true, devel: true, sloppy: true, white: true */

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

	var table;
	var key_name;
	var key;
	var smallest_side;
	var relacao;

	if (a <= b) {
		key = a / b;
		key_name = 'asb';
		table = asb;
		smallest_side = a;
		relacao = 'a/b';
	} else {
		key = b / a;
		key_name = 'bsa';
		table = bsa;
		smallest_side = b;
		relacao = 'b/a';
	}

	var data = tableLookup(table, key_name, ['cma', 'cmb', 'cm01', 'cm02'], key);

	var ret = {
		ma:  data.cma  / 10000 * q * smallest_side * smallest_side,
		mb:  data.cmb  / 10000 * q * smallest_side * smallest_side,
		m01: data.cm01 / 10000 * q * smallest_side * smallest_side,
		m02: data.cm02 / 10000 * q * smallest_side * smallest_side
	};

	if (data.underLimit) {
		var msg = '(' + relacao + ') = ' + key.toFixed(2) + '. Esforços calculados para uma relação (' + relacao + ') = ' + data.limit.toFixed(2) + '.';
		ret.msg = msg;
	}
	return ret;
}

function lajeTipo10(a, b, q) {
	// laje Tipo 10 = tabela 23 do Aderson
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

	if (data.underLimit || data.overLimit) {
		var msg = '(a/b) = ' + key.toFixed(2) + '. Os valores foram calculados para uma relacao (a/b) = ' + data.limit.toFixed(2) + '.';
		ret.msg = msg;
	}
	return ret;
}
