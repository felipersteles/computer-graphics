// ----------------------------------------------------------------
// Copyright (c) Teles and Celso 2024
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated
// documentation files (the "Software ")
//
// |-----------------------------------|
// | UNIVERSIDADE FEDERAL DO MARANHÃO  |
// |-----------------------------------|
//
// Segunda avaliação de Computação Gráfica
//      disciplina ministrada pelo prof. dr. Darlan
//
// ----------------------------------------------------------------

// ----------------------------------------------------------------
//              Select a object
// ----------------------------------------------------------------

// ----------------------------------------------------------------
//            Select Draw Mode
// ----------------------------------------------------------------

const startCreateAStar = () => {};

// ----------------------------------------------------------------
//            DRAW POINTS
// ----------------------------------------------------------------
var points = [];
var pointsIndex = 0;

// ----------------------------------------------------------------
//            DRAW LINES
// ----------------------------------------------------------------
var lines = [];
var linesIndex = 0;

// Receives event.clientX and event.clientY (pixels) and converts to canvas position.
function convertXY(x, y) {}

// Main function
window.onload = function init() {};

const clickOnCanvas = (event) => {};

function clear() {}

// ----------------------------------------------------------------
//          Draw objects
// ----------------------------------------------------------------
function draw(pos) {}

function addPoint(pos) {}

function addTriangle(pos) {}

function addPolygon(pos) {}

// ----------------------------------------------------------------
//          Move objects
// ----------------------------------------------------------------
function move(pos) {}

// ----------------------------------------------------------------
//          Move triangle
//  ---------------------------------------------------------------
function moveTriangle(pos) {}

// arrow function for events
const moveTriangleOnMouse = (e) => {};

// stop triangle move by clicking enter
const stopMoveTriangle = (e) => {};

// move the triangle object
function moveTriangleObj(x, y) {}

// ----------------------------------------------------------------
//          Move Squares
//  ---------------------------------------------------------------

function moveSquare(pos) {}

// arrow function for events
const moveSquareOnMouse = (e) => {};

// stop square move by clicking enter
const stopMoveSquare = (e) => {};

// move the square object
function moveSquareObj(selObj, x, y) {}

// ----------------------------------------------------------------
//          Rotate objects
// ----------------------------------------------------------------
function rotate(pos) {}

// ----------------------------------------------------------------
//          Rotate triangle
// ----------------------------------------------------------------
function rotateTriangle(pos) {}

const startTriangleRotation = () => {};

const rotateTriangleOnMouse = (e) => {};

const stopTriangleRotation = () => {};

function rotateTriangleObj(angle) {}

// ----------------------------------------------------------------
//          Rotate square
// ----------------------------------------------------------------
function rotateSquare(pos) {}

const startPolygonRotation = () => {};

const rotatePolygonOnMouse = (e) => {};

const stopPolygonRotation = () => {};

function render() {}

// ----------------------------------------------------------------
//           Triangle Utils
// ----------------------------------------------------------------

// Returns the clicked triangle
function getTriangle(pos) {}

// Highlight the triangle
function highlightTriangle(triangle) {}

// update the edges of triangle in array
function updateTriangleEdges(selObj, a, b, c) {}

// using the picked method learned on the graphic computer classe
// of prof. dr. Darlan url(???)
function pickTriangle(currentId, x, y) {}

// Highlight the triangle
function unHighlightTriangle() {}

// ----------------------------------------------------------------
//           Square Utils
// ----------------------------------------------------------------

// Returns the clicked square
function getSquare(pos) {}

function updateSquareEdges(selObj, a, b, c, d) {}

// using the picked method learned on the graphic computer classe
// of prof. dr. Darlan url(???)
function pickSquare(currentId, x, y) {}

function highlightObj(selObj) {}

// ----------------------------------------------------------------
//          Clear all
// ----------------------------------------------------------------

function clearAll() {}
