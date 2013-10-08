/*jslint browser: true, devel: true, sloppy: true, white: true */
/*global laje_functions */

"use strict";


//////////////////////////////////////////////////////////////////////
// Generic, reusable UI-related and HTML-related functions.


// Given a NodeList corresponding to a radio group, returns the checked radio
// element. Sample usage:
//
// var radio = getCheckedRadio(document.forms[0].radio_name_here);
//
// Based on http://stackoverflow.com/a/3869957/
function getCheckedRadio(radio_group) {
    for (var i = 0; i < radio_group.length; i++) {
        var radio = radio_group[i];
        if (radio.checked) {
            return radio;
        }
    }
    return undefined;
}


// Adds "func" as an event listener for both 'input' and 'change' events on a
// form. This is a useful way to detect any change in the form parameters by
// attaching a single listener.
//
// Some elements support the 'input' event, which fires as soon as the user
// changes the form text value (e.g. by typing, deleting, pasting text). Other
// elements do not support the 'input' event, requiring listening to 'change'
// event. Some extra logic is added to avoid running the listener twice (for
// both 'input' and 'change' events).
function addFormInputOrChangeEventListener(form, func) {
	// The "input" event applies for:
	//   most text-like <input> types
	//   textarea
	// The "input" event does not apply for:
	//   select
	//   checkbox
	//   radio
	//   file upload
	//   [hidden]
	//   [buttons] (including reset and submit)
	//
	// The "change" event applies to all form elements (except buttons and
	// hidden).
	//
	// http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#do-not-apply

	form.addEventListener('input', func, false);
	form.addEventListener('change', function(ev) {
		// Let's skip this event if the change has already been handled by the
		// 'input' event.
		var t = ev.target;
		if (t.tagName.toLowerCase() == 'textarea') return;
		if (t.tagName.toLowerCase() == 'input') {
			var type = t.type;
			if (type != 'checkbox' &&
				type != 'radio' &&
				type != 'file') return;
		}
		// Here, the event target one of:
		//   <select>
		//   <input> of type checkbox, radio or file
		//   an unknown, unexpected element.
		// Thus, we should call the event handler.
		func.call(this, ev);
	}, false);
}


//////////////////////////////////////////////////////////////////////
// Laje-related functions.


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
		// FIXME: poor WebKit SVG support.
		//new_fig.classList.add('fig-laje-' + number);
	}
	return new_fig;
}

// Given a <svg class="fig-laje"> and optionally a positive number, reset the
// "fig-laje-<number>".
function setFigLajeNumber(elem, number) {
	// FIXME: poor WebKit SVG support.
	return;
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


// Main function of this page. Reads all form input values, handles invalid
// values, calls the required backend function, shows the results to the user.
function recalculateValues(form) {
	var visible_outputs = {
		'xa' : false,
		'xa1': false,
		'xa2': false,
		'xb' : false,
		'xb1': false,
		'ma' : false,
		'mb' : false,
		'mr' : false,
		'm0' : false,
		'm01': false,
		'm02': false,
		'qaa': false,
		'qae': false,
		'qba': false,
		'qbe': false
	};

	var checked_radio = getCheckedRadio(form.tipo);
	var tipo = checked_radio && checked_radio.value;
	var msg;

	// Highlighting the <label> corresponding to the checked radio box.
	var tipo_laje_labels = form.querySelectorAll('.tipo-laje label');
	var checked_label = checked_radio && checked_radio.parentNode;
	for (var i = 0; i < tipo_laje_labels.length; i++) {
		if (tipo_laje_labels[i] != checked_label) {
			tipo_laje_labels[i].classList.remove('selected');
		}
	}
	if (checked_label) {
		checked_label.classList.add('selected');
	}

	if (laje_functions[tipo]) {
		// Updating the diagram.
		var diagrama = form.querySelector('.fig-diagrama');
		// FIXME: poor WebKit SVG support.
		//diagrama.classList.remove('hidden');
		setFigLajeNumber(diagrama, tipo);

		form.laje_desc.value = checked_label ? checked_label.title : '';

		// Note: Someday in future, we may use "form.a.valueAsNumber".
		var a = parseFloat(form.a.value);
		var b = parseFloat(form.b.value);
		var q = parseFloat(form.q.value);

		if (a > 0 && b > 0 && q > 0) {
			var ret = laje_functions[tipo](a, b, q);

			msg = ret.msg;
			delete ret.msg; // Deleting ret.msg because of the for..in loop below.

			for (var name in ret) {
				if (ret.hasOwnProperty(name)) {
					visible_outputs[name] = true;
					form[name].value = ret[name].toFixed(2);
				}
			}
		} else {
			// Invalid values.
			msg = 'Insira valores positivos.';
		}
	} else {
		// Invalid "tipo".
		msg = 'Selecione um tipo de laje.';

		form.laje_desc.value = '';

		var diagrama = form.querySelector('.fig-diagrama');
		// FIXME: poor WebKit SVG support.
		//diagrama.classList.add('hidden');
	}

	// Showing the message to the user.
	form.msg.value = msg || '';

	// Showing/hiding the appropriate fields.
	for (var name in visible_outputs) {
		if (visible_outputs.hasOwnProperty(name)) {
			var parent_label = form[name].parentNode;
			if (visible_outputs[name]) {
				parent_label.classList.remove('hidden');
			} else {
				parent_label.classList.add('hidden');
			}
		}
	}
}


//////////////////////////////////////////////////////////////////////
// Event handlers.

function formLajeChangeHandler(ev) {
	// this == the form element.
	recalculateValues(this);
}

function windowLoadHandler(ev) {
	// Creating copies of the SVG image.
	var foo = document.querySelectorAll('fieldset.tipo-laje label');
	for (var i = 0; i < foo.length; i++) {
		var label = foo[i];
		var number = label.querySelector('input[type="radio"]').value;
		var fig = newFigLaje(number);
		label.appendChild(fig);
	}

	// Adding the change handler.
	var form_laje = document.getElementById('laje');
	addFormInputOrChangeEventListener(form_laje, formLajeChangeHandler);

	// Initializing the page.
	recalculateValues(form_laje);
}

window.addEventListener('load', windowLoadHandler, false);
