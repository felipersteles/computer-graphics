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

const mapScale = 200;

var canvas, gl;
var pointProgram, lineProgram;
var pointBuffer, lineBuffer;
var pointColorBuffer, lineColorBuffer;

var maxNumTriangles = 200;
var maxNumVertices = 3 * maxNumTriangles;
var colorArray = [];

var points = [], pointsIndex = 0;
var lines = [], linesIndex = 0;

const white = vec4(1.0, 1.0, 1.0, 1.0);
const green = vec4(0.0, 1.0, 0.0, 1.0);
const yellow = vec4(0.0, 1.0, 1.0, 1.0)

var selectedStar;

// ----------------------------------------------------------------|
//          Entities                                               |
// ----------------------------------------------------------------|


class Position {
    x; // number
    y; // number

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Star {
    name;
    position;
    canvasPosition;
    desc;

    constructor(name, desc, x, y) {
        this.name = name;
        this.position = new Position(x, y);
        this.desc = desc;

        this.canvasPosition = this.setNormalizedPosition(x, y)
    }

    addDesc(desc) {
        this.desc = desc;
    }

    getNormalizedPosition() {
        return this.canvasPosition;
    }

    setNormalizedPosition(x, y) {

        const normalizedX = x / (2 * mapScale)
        const normalizedY = y / (2 * mapScale)

        return new Position(normalizedX, normalizedY);
    }
}

class Constellation {
    name; // string
    desc;
    stars = []; // stars
    edges = [];

    constructor(name, desc) {
        this.name = name;
        this.desc = desc
    };

    addStar(star) {
        this.stars.push(star);
    }

    addEdge(edge) {
        const begin = this.stars.filter((star) => star.name === edge[0])[0];
        if (!begin) alert("Please select a valid star.")

        const end = this.stars.filter((star) => star.name === edge[1])[0];
        if (!end) alert("Please select a valid star.")

        this.edges.push([begin.canvasPosition, end.canvasPosition]);
    }

    editStar(starName) {
        const starPosition = this.stars.filter((star, index) => {
            if (star.name === starName) return index;
        });

        this.stars[starPosition] = starName;
    }

    getStarPosition(query, isName = true) {

        const starPosition = this.stars.indexOf(query);
        if (!star) alert("Please provida a real star");

        const star = this.stars[starPosition];

        return star.position
    }

    getStarsPositionArray() {
        const starsPositions = this.stars.map(star => vec2(star.canvasPosition.x, star.canvasPosition.y));

        return starsPositions;
    }

    drawStars() {
        const starsPositions = this.getStarsPositionArray()

        starsPositions.map(pos => {

            points.push(pos);

            var i = pointsIndex;
            gl.useProgram(pointProgram)
            gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 8 * i, flatten(pos));
            gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i), flatten(white));

            pointsIndex++;
        })
    }

    drawEdges() {
        this.edges.map(edge => {

            const pointA = vec2(edge[0].x, edge[0].y);
            const pointB = vec2(edge[1].x, edge[1].y);

            const pos = vec2(pointA, pointB)

            lines.push(pos);

            var i = linesIndex;
            gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 8 * i, flatten(pointA));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (i + 1), flatten(pointB));
            gl.bindBuffer(gl.ARRAY_BUFFER, lineColorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * i, flatten(yellow));
            linesIndex += 2;
        })
    }

    hightlightStar(starName) {


        const star = this.stars.filter(star => star.name === starName)[0];

        if (!star) {
            alert(`${starName} not found.`)
            return
        }

        const index = this.stars.indexOf(star);
        const starDesc = document.getElementById(`description`)
        starDesc.innerText = `${star.desc}`
        if (!selectedStar) this.drawEdges();

        // console.log(`paint`, index);
        // clear last star selected

        gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
        if (selectedStar >= 0) gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (selectedStar), flatten(white));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index), flatten(green));
        selectedStar = index;
    }
}


const leoDesc = `Leo contains many bright stars, many of which were individually identified by the ancients. There are nine bright stars that can be easily seen with the naked eye,  four of the nine stars are either first or second magnitude. which render this constellation especially prominent.  Six of the nine stars also form an asterism known as "The Sickle," which to modern observers may resemble a backwards "question mark",  The sickle is marked by six stars: Epsilon Leonis, Mu Leonis, Zeta Leonis, Gamma Leonis, Eta Leonis, and Alpha Leonis. The rest of the three stars form a isosceles triangle, Beta Leonis (Denebola) marks the lion's tail and the rest of his body is delineated by Delta Leonis and Theta Leonis.`
const leoConstellation = new Constellation('Leo', leoDesc);

const DenebolaDesc = `Denebola is the second-brightest individual star in the constellation Leo, the Lion.  
It's the easternmost of the bright stars in Leo and is easily visible to the naked eye. Denebola is an A-type main sequence star, which means it is hotter and more massive than our Sun. 
In fact, Denebola is about 75% more massive than the Sun and 15 times more luminous.  
It's also a fast rotator, spinning at a rate of 128 kilometers per second.  This rapid spin causes the star to bulge at the equator and flatten at the poles.`

const ZosmaDesc = `Zosma is the brightest star in the constellation Leo, the Lion. 
It marks the rump of the lion in the constellation. Zosma is a white main sequence dwarf star, 
which means it is hotter and more massive than our Sun.  In fact, Zosma is  2.1 times larger than the Sun and 15 times more luminous. 
It's also a much faster rotator than our sun, with a projected rotational velocity of 180 kilometers per second compared to the Sun's leisurely 2 kilometers per second. 
This rapid spin causes Zosma to bulge at the equator and flatten at the poles.`

const ChertanDesc = `Chertan, also known as Theta Leonis (θ Leonis), is a bright star residing in the constellation Leo, the Lion. While Chertan shares some similarities with typical A-type main sequence stars, 
its enhanced metal content makes it a bit of an oddball, classified as a chemically peculiar Am star. 
This means its spectrum shows an unusual abundance of certain elements heavier than hydrogen and helium, like strontium, neodymium, and europium. 
The reason for this enrichment is not fully understood, but theories suggest it could be due to processes happening at the star's surface or past interactions with a companion star.`;



leoConstellation.addStar(new Star('Denebola', DenebolaDesc, 0, 0));
leoConstellation.addStar(new Star('Zosma', ZosmaDesc, 24, 13));
leoConstellation.addStar(new Star('Chertan', ChertanDesc, 17, -8));
leoConstellation.addStar(new Star('Regulos', '', 69, -22));
leoConstellation.addStar(new Star('Eta Leonis', '', 92, 0));
leoConstellation.addStar(new Star('Algieba', '', 93, 28));
leoConstellation.addStar(new Star('Adhafera', '', 122, 37));
leoConstellation.addStar(new Star('Rasalas', '', 150, 35));
leoConstellation.addStar(new Star('Algenubi', '', 147, 17));

leoConstellation.addEdge(['Denebola', 'Zosma']);
leoConstellation.addEdge(['Denebola', 'Chertan']);
leoConstellation.addEdge(['Zosma', 'Chertan']);
leoConstellation.addEdge(['Chertan', 'Regulos']);
leoConstellation.addEdge(['Regulos', 'Eta Leonis']);
leoConstellation.addEdge(['Eta Leonis', 'Algieba']);
leoConstellation.addEdge(['Algieba', 'Adhafera']);
leoConstellation.addEdge(['Adhafera', 'Rasalas']);
leoConstellation.addEdge(['Rasalas', 'Algenubi']);

// Main function
window.onload = main;

function main() {
    canvas = document.getElementById('canvas');

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert('WebGL isn\'t available');
        return;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // ----------------------------------------------------------------
    //  Load shaders and initialize attribute buffers
    //       -> Separate Shaders
    // ----------------------------------------------------------------

    pointProgram = initShaders(gl, "point-vertex-shader", "fragment-shader");
    lineProgram = initShaders(gl, "line-vertex-shader", "fragment-shader");

    // ----------------------------------------------------------------
    //  Load shaders and initialize attribute buffers
    //       -> Points
    // ----------------------------------------------------------------

    pointBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    pointColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    // ----------------------------------------------------------------
    //  Load shaders and initialize attribute buffers
    //       -> Line
    // ----------------------------------------------------------------

    lineBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    lineColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    // ----------------------------------------------------------------
    //         Set values
    // ----------------------------------------------------------------

    leoConstellation.drawStars();

    const starName = document.getElementById('star-name');
    const highlightBtn = document.getElementById('highlight');
    const infoConstellation = document.getElementById('info-constellation');
    const descConstellation = document.getElementById('desc-constellation');

    highlightBtn.onclick = () => {
        if (!starName.value) return;

        const name = starName.value;

        infoConstellation.innerText = `${leoConstellation.name}`;
        descConstellation.innerText = `${leoConstellation.desc}`;
        leoConstellation.hightlightStar(name);
    }

    // ----------------------------------------------------------------
    //         Draw
    // ----------------------------------------------------------------

    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw points
    if (points.length > 0) {
        gl.useProgram(pointProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
        var vPosition = gl.getAttribLocation(pointProgram, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
        var vColor = gl.getAttribLocation(pointProgram, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);
        gl.drawArrays(gl.POINTS, 0, pointsIndex);
    }

    // Draw lines
    if (lines.length > 0) {
        gl.useProgram(lineProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
        var vPosition = gl.getAttribLocation(lineProgram, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        gl.bindBuffer(gl.ARRAY_BUFFER, lineColorBuffer);
        var vColor = gl.getAttribLocation(lineProgram, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);
        gl.drawArrays(gl.LINES, 0, linesIndex);
    }

    window.requestAnimationFrame(render);
}