/*jslint browser: true, devel: true, sloppy: true, white: true */

"use strict";

// Returns a linear interpolation of y1,y2 based on x value between x1,x2.
function linearInterp(x, x1, x2, y1, y2) {
	return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
}

// Receives a table, a pair of Strings (key_name and value_name) and a Number
// (key). Looks up the key in the key_name column and returns a linear
// interpolation of values from value_name column.
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
function tableLookup(table, key_name, value_name, key) {
	if (key < table[1][key_name]) {
		return table[0][value_name];
	} else {
		// Looking up the key starting between elements 1 and 2.
		for (var i = 2; i < table.length; i++) {
			if (table[i][key_name] >= key) {
				return linearInterp(
						key,
						table[i - 1][key_name  ], table[i][key_name  ],
						table[i - 1][value_name], table[i][value_name]);
			}
		}
	}
	console.error(
			"tableLookup: looking up a key outside of the range of the table. key = ",
			key, " max key value = ", table[table.length - 1][key_name]);
	return table[table.length - 1][value_name];
}


function lajeTipo1(a, b, q) {
	// Coeficientes da laje tipo 1 = tabela 14 do Aderson para a <= b
	var asb = [
	{ asb: null , cm01: 377 , cm02: 284 , cma: 502 , cmb: 117 } ,
	{ asb: 0.5  , cm01: 377 , cm02: 284 , cma: 502 , cmb: 117 } ,
	{ asb: 0.55 , cm01: 371 , cm02: 277 , cma: 468 , cmb: 126 } ,
	{ asb: 0.6  , cm01: 364 , cm02: 269 , cma: 435 , cmb: 135 } ,
	{ asb: 0.65 , cm01: 356 , cm02: 261 , cma: 402 , cmb: 142 } ,
	{ asb: 0.7  , cm01: 347 , cm02: 252 , cma: 369 , cmb: 149 } ,
	{ asb: 0.75 , cm01: 337 , cm02: 242 , cma: 339 , cmb: 159 } ,
	{ asb: 0.8  , cm01: 327 , cm02: 232 , cma: 311 , cmb: 167 } ,
	{ asb: 0.85 , cm01: 315 , cm02: 221 , cma: 285 , cmb: 174 } ,
	{ asb: 0.9  , cm01: 303 , cm02: 209 , cma: 260 , cmb: 180 } ,
	{ asb: 0.95 , cm01: 291 , cm02: 197 , cma: 237 , cmb: 183 } ,
	{ asb: 1    , cm01: 279 , cm02: 185 , cma: 216 , cmb: 184 }
	];

	// Coeficientes da laje tipo 1 = tabela 14 do Aderson para a > b
	var bsa = [
	{ bsa: null , cm01: 471 , cm02: 199 , cma: 208 , cmb: 514 } ,
	{ bsa: 0.5  , cm01: 471 , cm02: 199 , cma: 208 , cmb: 514 } ,
	{ bsa: 0.55 , cm01: 449 , cm02: 199 , cma: 218 , cmb: 470 } ,
	{ bsa: 0.6  , cm01: 427 , cm02: 206 , cma: 225 , cmb: 425 } ,
	{ bsa: 0.65 , cm01: 406 , cm02: 211 , cma: 230 , cmb: 384 } ,
	{ bsa: 0.7  , cm01: 386 , cm02: 213 , cma: 233 , cmb: 345 } ,
	{ bsa: 0.75 , cm01: 367 , cm02: 212 , cma: 233 , cmb: 311 } ,
	{ bsa: 0.8  , cm01: 348 , cm02: 209 , cma: 232 , cmb: 280 } ,
	{ bsa: 0.85 , cm01: 329 , cm02: 206 , cma: 230 , cmb: 253 } ,
	{ bsa: 0.9  , cm01: 311 , cm02: 201 , cma: 288 , cmb: 228 } ,
	{ bsa: 0.95 , cm01: 294 , cm02: 194 , cma: 223 , cmb: 205 } ,
	{ bsa: 1    , cm01: 279 , cm02: 185 , cma: 216 , cmb: 184 }
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

	var cma  = tableLookup(table, key_name, 'cma' , key);
	var cmb  = tableLookup(table, key_name, 'cmb' , key);
	var cm01 = tableLookup(table, key_name, 'cm01', key);
	var cm02 = tableLookup(table, key_name, 'cm02', key);
	var ma  = cma  / 10000 * q * smallest_side * smallest_side;
	var mb  = cmb  / 10000 * q * smallest_side * smallest_side;
	var m01 = cm01 / 10000 * q * smallest_side * smallest_side;
	var m02 = cm02 / 10000 * q * smallest_side * smallest_side;

	var key_min = table[1][key_name]
	if (key < key_min) {
		// TODO: Show this to the user!
		var msg = '(' + relacao + ') = ' + key.toFixed(2) + '. Esforços calculados para uma relação (' + relacao + ') = ' + asbmin.toFixed(2) + '.';
		console.log(msg);
	}
	// TODO: return something.
}
