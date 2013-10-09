"use strict";

// Unit tests using QUnit.


var table = [
{key: null, a:  1, b:  2, c:  3},
{key:  1.0, a:  4, b:  5, c:  6},
{key:  2.0, a:  7, b:  8, c:  9},
{key:  3.0, a: 10, b: 11, c: 12},
{key:  5.0, a: 13, b: 14, c: 15}
];


module('linearInterp');

test('x1', function(){
	strictEqual(linearInterp(0, 0, 1, 10, 20), 10);
});

test('x2', function(){
	strictEqual(linearInterp(1, 0, 1, 10, 20), 20);
});

test('halfway', function(){
	strictEqual(linearInterp(0.5, 0, 1, 10, 20), 15);
});

test('increasing y', function(){
	strictEqual(linearInterp(0.75, 0, 1, 10, 20), 17.5);
});

test('decreasing y', function(){
	strictEqual(linearInterp(0.75, 0, 1, 20, 10), 12.5);
});

test('decreasing x', function(){
	strictEqual(linearInterp(0.75, 1, 0, 10, 20), 12.5);
});


module('tableLookup');

test('underLimit', function() {
	var data = tableLookup(table, 'key', ['a', 'b', 'c'], 0.5);
	deepEqual(data, {
		underLimit: true,
		overLimit: false,
		limit: 1.0,
		a: 1,
		b: 2,
		c: 3
	});
});

test('overLimit', function() {
	var data = tableLookup(table, 'key', ['a', 'b', 'c'], 10);
	deepEqual(data, {
		underLimit: false,
		overLimit: true,
		limit: 5.0,
		a: 13,
		b: 14,
		c: 15
	});
});

test('row 1', function() {
	var data = tableLookup(table, 'key', ['a', 'b', 'c'], 1.0);
	deepEqual(data, {
		underLimit: false,
		overLimit: false,
		a: 4,
		b: 5,
		c: 6
	});
});

test('row  2', function() {
	var data = tableLookup(table, 'key', ['a', 'b', 'c'], 2.0);
	deepEqual(data, {
		underLimit: false,
		overLimit: false,
		a: 7,
		b: 8,
		c: 9
	});
});

test('row 3', function() {
	var data = tableLookup(table, 'key', ['a', 'b', 'c'], 3.0);
	deepEqual(data, {
		underLimit: false,
		overLimit: false,
		a: 10,
		b: 11,
		c: 12
	});
});

test('row 4', function() {
	var data = tableLookup(table, 'key', ['a', 'b', 'c'], 5.0);
	deepEqual(data, {
		underLimit: false,
		overLimit: false,
		a: 13,
		b: 14,
		c: 15
	});
});

test('Between rows 1-2 0.5', function() {
	var data = tableLookup(table, 'key', ['a', 'b', 'c'], 1.5);
	deepEqual(data, {
		underLimit: false,
		overLimit: false,
		a: 5.5,
		b: 6.5,
		c: 7.5
	});
});

test('Between rows 2-3 0.75', function() {
	var data = tableLookup(table, 'key', ['a', 'b', 'c'], 2.75);
	deepEqual(data, {
		underLimit: false,
		overLimit: false,
		a: 9.25,
		b: 10.25,
		c: 11.25
	});
});

test('Between rows 3-4 0.5', function() {
	var data = tableLookup(table, 'key', ['a', 'b', 'c'], 4.0);
	deepEqual(data, {
		underLimit: false,
		overLimit: false,
		a: 11.5,
		b: 12.5,
		c: 13.5
	});
});

test('Between rows 3-4 0.25', function() {
	var data = tableLookup(table, 'key', ['a', 'b', 'c'], 3.5);
	deepEqual(data, {
		underLimit: false,
		overLimit: false,
		a: 10.75,
		b: 11.75,
		c: 12.75
	});
});

