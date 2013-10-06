/*jslint browser: true, devel: true, sloppy: true, white: true */

"use strict";

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
