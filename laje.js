/*jslint browser: true, devel: true, sloppy: true, white: true */

"use strict";


function lajeTipo1(a, b, q) {
	var asb = new Array(12);  // 0..11
	var bsa = new Array(12);  // 0..11
	var cma = new Array(12);  // 0..11
	var cmb = new Array(12);  // 0..11
	var cm01 = new Array(12);  // 0..11
	var cm02 = new Array(12);  // 0..11

	var asbmin = 0.5;  // a sobre b
	var bsamin = 0.5;  // b sobre a

	if (a <= b) {
		// Coeficientes da laje tipo 1 = tabela 14 do Aderson para a <= b
              ; cm01[0] = 377  ; cm02[0] = 284  ; cma[0] = 502  ; cmb[0] = 117;
asb[1] = .5   ; cm01[1] = 377  ; cm02[1] = 284  ; cma[1] = 502  ; cmb[1] = 117;
asb[2] = .55  ; cm01[2] = 371  ; cm02[2] = 277  ; cma[2] = 468  ; cmb[2] = 126;
asb[3] = .6   ; cm01[3] = 364  ; cm02[3] = 269  ; cma[3] = 435  ; cmb[3] = 135;
asb[4] = .65  ; cm01[4] = 356  ; cm02[4] = 261  ; cma[4] = 402  ; cmb[4] = 142;
asb[5] = .7   ; cm01[5] = 347  ; cm02[5] = 252  ; cma[5] = 369  ; cmb[5] = 149;
asb[6] = .75  ; cm01[6] = 337  ; cm02[6] = 242  ; cma[6] = 339  ; cmb[6] = 159;
asb[7] = .8   ; cm01[7] = 327  ; cm02[7] = 232  ; cma[7] = 311  ; cmb[7] = 167;
asb[8] = .85  ; cm01[8] = 315  ; cm02[8] = 221  ; cma[8] = 285  ; cmb[8] = 174;
asb[9] = .9   ; cm01[9] = 303  ; cm02[9] = 209  ; cma[9] = 260  ; cmb[9] = 180;
asb[10] = .95 ; cm01[10] = 291 ; cm02[10] = 197 ; cma[10] = 237 ; cmb[10] = 183;
asb[11] = 1   ; cm01[11] = 279 ; cm02[11] = 185 ; cma[11] = 216 ; cmb[11] = 184;

		// Cálculo dos esforços para a <= b
		// begin table lookup
		var cma_;
		if (a / b < asbmin) {
			cma_ = cma[0];
		} else {
			for (var i = 2; i < 12; i++) {
				if (asb[i] >= a / b) {
					// Linear interpolation between cma[] values based on asb[] values.
					cma_ = cma[i-1] + (cma[i] - cma[i-1]) * (a / b - asb[i-1]) / (asb[i] - asb[i-1]);
					break;
				}
			}
		}
		// end table lookup
		var ma = cma_ / 10000 * q * a * a;

IF A / B < ASBMIN THEN CMA = CMA(0): GOTO 30120
	FOR I = 2 TO 11
		IF ASB(I) < A / B THEN 30100
		CMA = CMA(I - 1) + (CMA(I) - CMA(I - 1)) * (A / B - ASB(I - 1)) / (ASB(I) - ASB(I - 1))
		GOTO 30120
	30100 NEXT I
30120 MA = CMA / 10000 * Q * A * A

IF A / B < ASBMIN THEN CMB = CMB(0): GOTO 30160
FOR I = 2 TO 11
IF ASB(I) < A / B THEN 30140
CMB = CMB(I - 1) + (CMB(I) - CMB(I - 1)) * (A / B - ASB(I - 1)) / (ASB(I) - ASB(I - 1))
GOTO 30160
30140 NEXT I
30160 MB = CMB / 10000 * Q * A * A

IF A / B < ASBMIN THEN CM01 = CM01(0): GOTO 30440
FOR I = 2 TO 11
IF ASB(I) < A / B THEN 30420
CM01 = CM01(I - 1) + (CM01(I) - CM01(I - 1)) * (A / B - ASB(I - 1)) / (ASB(I) - ASB(I - 1))
GOTO 30440
30420 NEXT I
30440 M01 = CM01 / 10000 * Q * A * A

IF A / B < ASBMIN THEN CM02 = CM02(0): GOTO 30480
FOR I = 2 TO 11
IF ASB(I) < A / B THEN 30460
CM02 = CM02(I - 1) + (CM02(I) - CM02(I - 1)) * (A / B - ASB(I - 1)) / (ASB(I) - ASB(I - 1))
GOTO 30480
30460 NEXT I
30480 M02 = CM02 / 10000 * Q * A * A

IF A / B < ASBMIN THEN 34020 ELSE 40000
34020 LOCATE 24, 3: PRINT "Obs: (a/b) ="; : PRINT USING A$; A / B
LOCATE 25, 8: PRINT "Os valores acima foram calculados para uma relacao (a/b) ="; : PRINT USING A$; ASBMIN; : PRINT ".": GOTO 40000



	} else {
		// Coeficientes da laje tipo 1 = tabela 14 do Aderson para a > b
              ; cm01[0] = 471  ; cm02[0] = 199  ; cma[0] = 208  ; cmb[0] = 514;
bsa[1] = .5   ; cm01[1] = 471  ; cm02[1] = 199  ; cma[1] = 208  ; cmb[1] = 514;
bsa[2] = .55  ; cm01[2] = 449  ; cm02[2] = 199  ; cma[2] = 218  ; cmb[2] = 470;
bsa[3] = .6   ; cm01[3] = 427  ; cm02[3] = 206  ; cma[3] = 225  ; cmb[3] = 425;
bsa[4] = .65  ; cm01[4] = 406  ; cm02[4] = 211  ; cma[4] = 230  ; cmb[4] = 384;
bsa[5] = .7   ; cm01[5] = 386  ; cm02[5] = 213  ; cma[5] = 233  ; cmb[5] = 345;
bsa[6] = .75  ; cm01[6] = 367  ; cm02[6] = 212  ; cma[6] = 233  ; cmb[6] = 311;
bsa[7] = .8   ; cm01[7] = 348  ; cm02[7] = 209  ; cma[7] = 232  ; cmb[7] = 280;
bsa[8] = .85  ; cm01[8] = 329  ; cm02[8] = 206  ; cma[8] = 230  ; cmb[8] = 253;
bsa[9] = .9   ; cm01[9] = 311  ; cm02[9] = 201  ; cma[9] = 288  ; cmb[9] = 228;
bsa[10] = .95 ; cm01[10] = 294 ; cm02[10] = 194 ; cma[10] = 223 ; cmb[10] = 205;
bsa[11] = 1   ; cm01[11] = 279 ; cm02[11] = 185 ; cma[11] = 216 ; cmb[11] = 184;
	}
}


// Returns a new copy of <svg class="fig-laje">.
// Optionally adds a class "fig-laje-<number>", if the number is positive.
function newFigLaje(number) {
	var model = document.getElementById('fig-laje-model');
	if (!model) {
		console.error('Cannot find #fig-laje-model');
		return;
	}
	var new_fig = model.cloneNode(true);  // deep = true
	new_fig.removeAttribute('id');
	if (number && number > 0) {
		new_fig.classList.add('fig-laje-' + number);
	}
	return new_fig;
}

// Given a <svg class="fig-laje"> and optionally a positive number, reset the
// "fig-laje-<number>".
function setFigLajeNumber(elem, number) {
	for (var i = 0; i < elem.classList.length; i++) {
		var s = elem.classList.item(i);
		if (/^fig-laje-[0-9]+/.test(s)) {
			elem.classList.remove(s);
			i--;
		}
	}
	if (number && number > 0) {
		elem.classList.add('fig-laje-' + number);
	}
}


function onLoadHandler() {
	var foo = document.querySelectorAll('fieldset.tipo-laje label');
	for (var i = 0; i < foo.length; i++) {
		var label = foo[i];
		var number = label.querySelector('input[type="radio"]').value;
		var fig = newFigLaje(number);
		label.appendChild(fig);
	}
}

window.addEventListener('load', onLoadHandler, false);
