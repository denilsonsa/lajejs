/*jslint browser: true, devel: true, sloppy: true, white: true */

"use strict";


var fig_laje_element;

// Grabs the model <div> from the document, stores in a JS var, and removes it
// from the document.
function initFigLaje() {
	fig_laje_element = document.getElementById('fig-laje-model');
	if (!fig_laje_element) {
		console.error('Cannot find #fig-laje-model');
		return;
	}
	fig_laje_element.removeAttribute('id');
	var parent = fig_laje_element.parentNode;
	if (parent) {
		parent.removeChild(fig_laje_element);
	}
}

// Returns a new copy of <div class="fig-laje">.
// Optionally adds a class "fig-laje-<number>", if the number is positive.
function newFigLaje(number) {
	if (!fig_laje_element) {
		console.error('Fatal error: fig_laje_element is ', fig_laje_element);
		return;
	}
	var newFig = fig_laje_element.cloneNode(true);  // deep = true
	if (number && number > 0) {
		newFig.classList.add('fig-laje-' + number);
	}
	return newFig;
}

// Given a <div class="fig-laje"> and optionally a positive number, reset the
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
	initFigLaje();

	var foo = document.querySelectorAll('fieldset.tipo-laje label');
	for (var i = 0; i < foo.length; i++) {
		var label = foo[i];
		var number = label.querySelector('input[type="radio"]').value;
		var fig = newFigLaje(number);
		label.appendChild(fig);
	}
	var fig = newFigLaje();
	var diagrama = document.querySelector('form .diagrama');
	diagrama.appendChild(fig);
}

window.addEventListener('load', onLoadHandler, false);
