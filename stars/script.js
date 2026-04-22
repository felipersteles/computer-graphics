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

var maxNumTriangles = 2000;
var maxNumVertices = 3 * maxNumTriangles;

var points = [], pointsIndex = 0;
var lines = [], linesIndex = 0;

const white = vec4(1.0, 1.0, 1.0, 1.0);
const green = vec4(0.0, 1.0, 0.0, 1.0);

var selectedStar = -1;
var activeConstellation = null;

// ----------------------------------------------------------------|
//          Entities                                               |
// ----------------------------------------------------------------|

class Position {
    x;
    y;

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
        this.canvasPosition = this.setNormalizedPosition(x, y);
    }

    getNormalizedPosition() {
        return this.canvasPosition;
    }

    setNormalizedPosition(x, y) {
        const normalizedX = x / (2 * mapScale);
        const normalizedY = y / (2 * mapScale);
        return new Position(normalizedX, normalizedY);
    }
}

class Constellation {
    starBufferOffset = 0;
    color;
    name;
    desc;
    stars = [];
    edges = [];

    constructor(name, desc, color) {
        this.name = name;
        this.desc = desc;
        this.color = color || vec4(1.0, 1.0, 0.0, 1.0);
    }

    addStar(star) {
        this.stars.push(star);
    }

    addEdge(edge) {
        const begin = this.stars.find(s => s.name === edge[0]);
        if (!begin) { console.warn(`Star "${edge[0]}" not found in ${this.name}.`); return; }
        const end = this.stars.find(s => s.name === edge[1]);
        if (!end) { console.warn(`Star "${edge[1]}" not found in ${this.name}.`); return; }
        this.edges.push([begin.canvasPosition, end.canvasPosition]);
    }

    getStarsPositionArray() {
        return this.stars.map(star => vec2(star.canvasPosition.x, star.canvasPosition.y));
    }

    getStarsName() {
        return this.stars.map(star => star.name);
    }

    drawStars() {
        this.starBufferOffset = pointsIndex;
        const starsPositions = this.getStarsPositionArray();
        starsPositions.forEach(pos => {
            points.push(pos);
            var i = pointsIndex;
            gl.useProgram(pointProgram);
            gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 8 * i, flatten(pos));
            gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * i, flatten(white));
            pointsIndex++;
        });
    }

    drawEdges() {
        this.edges.forEach(edge => {
            const pointA = vec2(edge[0].x, edge[0].y);
            const pointB = vec2(edge[1].x, edge[1].y);
            lines.push([pointA, pointB]);
            var i = linesIndex;
            gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 8 * i, flatten(pointA));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (i + 1), flatten(pointB));
            gl.bindBuffer(gl.ARRAY_BUFFER, lineColorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * i, flatten(this.color));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (i + 1), flatten(this.color));
            linesIndex += 2;
        });
    }

    hightlightStar(starName) {
        const star = this.stars.find(s => s.name === starName);
        if (!star) { alert(`${starName} not found.`); return; }
        const localIndex = this.stars.indexOf(star);
        const globalIndex = localIndex + this.starBufferOffset;
        document.getElementById('description').innerText = star.desc;
        gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
        if (selectedStar >= 0) gl.bufferSubData(gl.ARRAY_BUFFER, 16 * selectedStar, flatten(white));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * globalIndex, flatten(green));
        selectedStar = globalIndex;
    }
}

// ----------------------------------------------------------------|
//          Constellation Data                                     |
// ----------------------------------------------------------------|

// --- Aries ---
const ariesDesc = `Aries is a mid-size constellation in the northern sky. It is one of the 48 constellations described by the 2nd-century astronomer Ptolemy and remains one of the 88 modern constellations. Aries is a relatively faint constellation with only four stars above magnitude 4.0. The brightest star is Hamal (Alpha Arietis), a K-type giant. In ancient times, the First Point of Aries — the vernal equinox — lay within this constellation, marking the start of spring in the northern hemisphere.`;
const ariesConstellation = new Constellation('Aries', ariesDesc, vec4(1.0, 0.5, 0.0, 1.0));
ariesConstellation.addStar(new Star('Hamal', 'Hamal (α Ari) is the brightest star in Aries. It is an orange giant about 66 light-years away with a luminosity 91 times that of the Sun.', -212, 78));
ariesConstellation.addStar(new Star('Sheratan', 'Sheratan (β Ari) is a binary star 60 light-years from Earth. Its name comes from Arabic meaning "the two signs," referencing the vernal equinox.', -240, 90));
ariesConstellation.addStar(new Star('Mesarthim', 'Mesarthim (γ Ari) was one of the first binary stars discovered telescopically by Robert Hooke in 1664. It lies about 164 light-years away.', -250, 100));
ariesConstellation.addEdge(['Hamal', 'Sheratan']);
ariesConstellation.addEdge(['Sheratan', 'Mesarthim']);

// --- Taurus ---
const taurusDesc = `Taurus is a large and prominent constellation in the northern hemisphere winter sky. One of the oldest constellations, it has been observed since at least the Early Bronze Age. It contains two of the nearest open clusters to Earth: the Pleiades and the Hyades. The brightest star is the giant Aldebaran, which appears to be part of the Hyades but is actually a foreground object, about 65 light-years from Earth.`;
const taurusConstellation = new Constellation('Taurus', taurusDesc, vec4(1.0, 0.35, 0.1, 1.0));
taurusConstellation.addStar(new Star('Aldebaran', 'Aldebaran (α Tau) is an orange giant star, about 65 light-years away. It is the brightest star in Taurus and the 14th-brightest star in the night sky. Its name means "the follower" in Arabic, as it follows the Pleiades.', -130, 42));
taurusConstellation.addStar(new Star('Elnath', 'Elnath (β Tau) is the second-brightest star in Taurus and is shared with the constellation Auriga. It is a blue-white giant about 131 light-years from Earth.', -108, 90));
taurusConstellation.addStar(new Star('Alcyone', 'Alcyone (η Tau) is the brightest star in the Pleiades cluster, a famous open cluster in Taurus visible to the naked eye. It is about 440 light-years from Earth.', -188, 115));
taurusConstellation.addEdge(['Alcyone', 'Aldebaran']);
taurusConstellation.addEdge(['Aldebaran', 'Elnath']);

// --- Gemini ---
const geminiDesc = `Gemini is one of the constellations of the zodiac. Its name is Latin for "twins," and it is associated with the twins Castor and Pollux in Greek mythology. The two brightest stars in the constellation are named after these twins. Gemini lies between Taurus to the west and Cancer to the east. The Sun resides in the constellation from June 21 to July 20.`;
const geminiConstellation = new Constellation('Gemini', geminiDesc, vec4(0.2, 0.9, 1.0, 1.0));
geminiConstellation.addStar(new Star('Castor', 'Castor (α Gem) is actually a sextuple star system, about 51 light-years away. It appears as the second-brightest star in Gemini despite being Alpha. In mythology it represents one of the divine twins.', -57, 158));
geminiConstellation.addStar(new Star('Pollux', 'Pollux (β Gem) is an orange giant star and the brightest in Gemini at magnitude 1.14. It is about 34 light-years away and hosts a confirmed exoplanet, Pollux b.', -48, 138));
geminiConstellation.addStar(new Star('Alhena', 'Alhena (γ Gem) is a bright star at the feet of the Pollux twin, about 105 light-years from Earth. Its name means "the brand mark" in Arabic.', -28, 95));
geminiConstellation.addStar(new Star('Tejat', 'Tejat (μ Gem) is a red giant at one of the feet of the Castor twin. It is a variable star about 230 light-years away.', -82, 168));
geminiConstellation.addStar(new Star('Mebsuda', 'Mebsuda (ε Gem) is a yellow supergiant about 900 light-years from Earth. Its name means "the outstretched paw" in Arabic.', -68, 132));
geminiConstellation.addEdge(['Castor', 'Pollux']);
geminiConstellation.addEdge(['Castor', 'Tejat']);
geminiConstellation.addEdge(['Castor', 'Mebsuda']);
geminiConstellation.addEdge(['Pollux', 'Alhena']);
geminiConstellation.addEdge(['Mebsuda', 'Alhena']);

// --- Cancer ---
const cancerDesc = `Cancer is one of the twelve constellations of the zodiac and is located in the northern celestial hemisphere. It is the faintest of the zodiacal constellations. Its name is Latin for "crab." Cancer contains the well-known open cluster Messier 44, also known as the Beehive Cluster (Praesepe), which contains over 1000 stars and lies near Asellus Borealis and Asellus Australis.`;
const cancerConstellation = new Constellation('Cancer', cancerDesc, vec4(0.5, 0.75, 1.0, 1.0));
cancerConstellation.addStar(new Star('Acubens', 'Acubens (α Cnc) is a multiple star system about 174 light-years from Earth. Its name means "the claw" in Arabic. Despite being designated Alpha, it is not the brightest star in Cancer.', 55, 68));
cancerConstellation.addStar(new Star('Al Tarf', 'Al Tarf (β Cnc) is the brightest star in Cancer despite being designated Beta. It is an orange giant about 290 light-years away. Its name means "the end" or "the tip" in Arabic.', 108, 72));
cancerConstellation.addStar(new Star('Asellus Borealis', 'Asellus Borealis (γ Cnc) is the "northern donkey," one of two donkey stars (aselli) in Cancer. It is a white star about 181 light-years from Earth flanking the Beehive Cluster.', 75, 108));
cancerConstellation.addStar(new Star('Asellus Australis', 'Asellus Australis (δ Cnc) is the "southern donkey," an orange giant about 136 light-years away. Together with Asellus Borealis, it flanks the famous Beehive Cluster (M44).', 80, 85));
cancerConstellation.addEdge(['Acubens', 'Asellus Australis']);
cancerConstellation.addEdge(['Al Tarf', 'Asellus Australis']);
cancerConstellation.addEdge(['Asellus Australis', 'Asellus Borealis']);

// --- Leo ---
const leoDesc = `Leo contains many bright stars, many of which were individually identified by the ancients. There are nine bright stars that can be easily seen with the naked eye, four of the nine stars are either first or second magnitude. Six of the nine stars also form an asterism known as "The Sickle," which to modern observers may resemble a backwards "question mark." The sickle is marked by six stars: Epsilon Leonis, Mu Leonis, Zeta Leonis, Gamma Leonis, Eta Leonis, and Alpha Leonis. The rest of the three stars form an isosceles triangle; Beta Leonis (Denebola) marks the lion's tail.`;
const leoConstellation = new Constellation('Leo', leoDesc, vec4(1.0, 1.0, 0.0, 1.0));

const DenebolaDesc = `Denebola is the second-brightest star in Leo. It is an A-type main sequence star about 36 light-years away, 75% more massive than the Sun and 15 times more luminous. Its rapid spin of 128 km/s causes it to bulge at the equator.`;
const ZosmaDesc = `Zosma (δ Leo) marks the rump of the lion. It is a white main-sequence star 2.1 times larger than the Sun, about 58 light-years away, with a fast rotation of 180 km/s.`;
const ChertanDesc = `Chertan (θ Leo) is a chemically peculiar Am star with unusual abundances of strontium and europium. It lies about 165 light-years from Earth.`;

leoConstellation.addStar(new Star('Denebola', DenebolaDesc, 0, 0));
leoConstellation.addStar(new Star('Zosma', ZosmaDesc, 24, 13));
leoConstellation.addStar(new Star('Chertan', ChertanDesc, 17, -8));
leoConstellation.addStar(new Star('Regulos', 'Regulus (α Leo) is the brightest star in Leo and one of the brightest stars in the night sky. It is about 79 light-years away and spins so fast it is noticeably oblate.', 69, -22));
leoConstellation.addStar(new Star('Eta Leonis', 'Eta Leonis is a white supergiant about 2000 light-years away, part of the Sickle asterism that forms the head and mane of the lion.', 92, 0));
leoConstellation.addStar(new Star('Algieba', 'Algieba (γ Leo) is a famous binary system of two golden-yellow giant stars, about 130 light-years away. Their orbital period is about 510 years.', 93, 28));
leoConstellation.addStar(new Star('Adhafera', 'Adhafera (ζ Leo) is a giant star about 260 light-years from Earth, forming part of the Sickle asterism that traces the lion\'s mane.', 122, 37));
leoConstellation.addStar(new Star('Rasalas', 'Rasalas (μ Leo) is an orange giant about 133 light-years away. Its name comes from the Arabic for "the head of the lion" (northern star).', 150, 35));
leoConstellation.addStar(new Star('Algenubi', 'Algenubi (ε Leo) is a yellow giant and the northernmost bright star in Leo\'s Sickle, about 247 light-years from Earth.', 147, 17));

leoConstellation.addEdge(['Denebola', 'Zosma']);
leoConstellation.addEdge(['Denebola', 'Chertan']);
leoConstellation.addEdge(['Zosma', 'Chertan']);
leoConstellation.addEdge(['Chertan', 'Regulos']);
leoConstellation.addEdge(['Regulos', 'Eta Leonis']);
leoConstellation.addEdge(['Eta Leonis', 'Algieba']);
leoConstellation.addEdge(['Algieba', 'Adhafera']);
leoConstellation.addEdge(['Adhafera', 'Rasalas']);
leoConstellation.addEdge(['Rasalas', 'Algenubi']);

// --- Virgo ---
const virgoDesc = `Virgo is the largest constellation of the zodiac and the second-largest constellation overall. It lies between Leo to the west and Libra to the east. Its brightest star, Spica, is one of the brightest stars in the night sky. The constellation contains the Virgo Cluster, the nearest large galaxy cluster to Earth, containing more than 1300 galaxies. In mythology, Virgo is often identified with Demeter, goddess of the harvest.`;
const virgoConstellation = new Constellation('Virgo', virgoDesc, vec4(0.7, 0.3, 1.0, 1.0));
virgoConstellation.addStar(new Star('Spica', 'Spica (α Vir) is the brightest star in Virgo and the 15th-brightest in the night sky. It is a binary star about 250 light-years away; both components are hot blue giants. Its brightness helped ancient astronomers detect the precession of the equinoxes.', 202, -18));
virgoConstellation.addStar(new Star('Porrima', 'Porrima (γ Vir) is one of the most celebrated binary stars in the sky, with two nearly identical F-type stars orbiting each other with a period of 169 years. It is about 38 light-years from Earth.', 188, 28));
virgoConstellation.addStar(new Star('Vindemiatrix', 'Vindemiatrix (ε Vir) is a giant star about 102 light-years away. Its name means "the grape-gatherer" in Latin, as its heliacal rising historically signaled the grape harvest.', 178, 62));
virgoConstellation.addStar(new Star('Zavijava', 'Zavijava (β Vir) is an F-type main-sequence star about 36 light-years away, one of the closest naked-eye stars. Its Arabic name means "the corner of the kennel."', 158, 78));
virgoConstellation.addStar(new Star('Heze', 'Heze (ζ Vir) is an A-type main-sequence star about 74 light-years from Earth. It lies along the main body of the maiden in the constellation figure.', 222, 12));
virgoConstellation.addEdge(['Spica', 'Porrima']);
virgoConstellation.addEdge(['Porrima', 'Vindemiatrix']);
virgoConstellation.addEdge(['Vindemiatrix', 'Zavijava']);
virgoConstellation.addEdge(['Porrima', 'Heze']);

// --- Libra ---
const libraDesc = `Libra is a constellation of the zodiac and is located in the Southern celestial hemisphere. Its name is Latin for "weighing scales." It is fairly faint, with no first-magnitude stars. The brightest stars are Zubeneschamali and Zubenelgenubi, whose names derive from Arabic and literally mean "the northern claw" and "the southern claw," a remnant of when these stars were considered part of the scorpion's claws before Libra was separated as its own constellation.`;
const libraConstellation = new Constellation('Libra', libraDesc, vec4(0.0, 0.8, 0.7, 1.0));
libraConstellation.addStar(new Star('Zubenelgenubi', 'Zubenelgenubi (α Lib) is a wide binary star about 77 light-years away, resolvable with the naked eye. Its name means "the southern claw" in Arabic, from when it was part of Scorpius.', 258, -22));
libraConstellation.addStar(new Star('Zubeneschamali', 'Zubeneschamali (β Lib) is the brightest star in Libra. It is the only star visible to the naked eye that appears distinctly greenish in color. It lies about 160 light-years away.', 268, 22));
libraConstellation.addStar(new Star('Brachium', 'Brachium (σ Lib) is a red giant about 292 light-years away. Its name means "arm" in Latin and it was formerly known as Zuben Hakrabi.', 312, 32));
libraConstellation.addEdge(['Zubenelgenubi', 'Zubeneschamali']);
libraConstellation.addEdge(['Zubeneschamali', 'Brachium']);

// --- Scorpius ---
const scorpiusDesc = `Scorpius is a zodiac constellation located in the Southern celestial hemisphere. Its old name is Scorpio. It is a large constellation situated near the center of the Milky Way. The brightest star is Antares, a red supergiant. Due to its prominent position, Scorpius was important to many ancient cultures. The Sun passes through the constellation for only about a week near the end of November.`;
const scorpiusConstellation = new Constellation('Scorpius', scorpiusDesc, vec4(1.0, 0.2, 0.2, 1.0));
scorpiusConstellation.addStar(new Star('Antares', 'Antares (α Sco) is a red supergiant and one of the largest and most luminous stars visible to the naked eye. Its diameter is about 700 times that of the Sun. The name means "rival of Ares (Mars)" due to its reddish color, and it lies about 550 light-years away.', 228, -148));
scorpiusConstellation.addStar(new Star('Graffias', 'Graffias (β Sco) is a multiple star system forming the head of the scorpion, about 404 light-years away. The name likely comes from Arabic for "the claws."', 208, -118));
scorpiusConstellation.addStar(new Star('Dschubba', 'Dschubba (δ Sco) is a blue subgiant about 400 light-years away. It is a shell star that experienced a dramatic brightening in 2000, gaining nearly a full magnitude.', 222, -128));
scorpiusConstellation.addStar(new Star('Sargas', 'Sargas (θ Sco) is a bright yellow-white supergiant about 300 light-years away, located in the tail of the scorpion. The origin of the name is uncertain.', 272, -198));
scorpiusConstellation.addStar(new Star('Shaula', 'Shaula (λ Sco) is the second-brightest star in Scorpius and the 25th-brightest in the night sky. Its name means "the raised tail" in Arabic. It is a binary star about 700 light-years away.', 292, -232));
scorpiusConstellation.addStar(new Star('Lesath', 'Lesath (υ Sco) is a hot blue-white star about 520 light-years away, forming the stinger of the scorpion together with Shaula. Its name comes from Arabic meaning "bite of a venomous animal."', 302, -238));
scorpiusConstellation.addEdge(['Graffias', 'Dschubba']);
scorpiusConstellation.addEdge(['Dschubba', 'Antares']);
scorpiusConstellation.addEdge(['Antares', 'Sargas']);
scorpiusConstellation.addEdge(['Sargas', 'Shaula']);
scorpiusConstellation.addEdge(['Shaula', 'Lesath']);

// --- Sagittarius ---
const sagittariusDesc = `Sagittarius is a constellation of the zodiac. Its name is Latin for "archer," and its symbol is an arrow. It is one of the 48 constellations listed by Ptolemy and remains one of the 88 modern constellations. The center of the Milky Way lies in the direction of Sagittarius, making it the richest region of the night sky. The constellation is dominated by the "Teapot" asterism formed by its brightest stars.`;
const sagittariusConstellation = new Constellation('Sagittarius', sagittariusDesc, vec4(1.0, 0.8, 0.0, 1.0));
sagittariusConstellation.addStar(new Star('Kaus Australis', 'Kaus Australis (ε Sgr) is the brightest star in Sagittarius. It is a blue giant about 143 light-years away. The name means "southern bow" in a mix of Arabic and Latin.', 318, -198));
sagittariusConstellation.addStar(new Star('Kaus Media', 'Kaus Media (δ Sgr) is a giant star about 306 light-years away, forming the middle section of the archer\'s bow. It has the full designation of "middle of the bow" in Arabic.', 308, -168));
sagittariusConstellation.addStar(new Star('Kaus Borealis', 'Kaus Borealis (λ Sgr) is an orange giant about 77 light-years away, at the northern tip of the bow. Its cooler temperature gives it a distinctly orange color.', 292, -138));
sagittariusConstellation.addStar(new Star('Nunki', 'Nunki (σ Sgr) is the second-brightest star in Sagittarius and one of the hottest. It is a blue main-sequence star about 228 light-years from Earth and one of the oldest named stars, its name coming from ancient Babylonian astronomy.', 348, -152));
sagittariusConstellation.addStar(new Star('Ascella', 'Ascella (ζ Sgr) is a binary star system about 89 light-years away. Its name means "armpit" in Latin, reflecting its position in the archer figure.', 342, -182));
sagittariusConstellation.addEdge(['Kaus Australis', 'Kaus Media']);
sagittariusConstellation.addEdge(['Kaus Media', 'Kaus Borealis']);
sagittariusConstellation.addEdge(['Kaus Media', 'Ascella']);
sagittariusConstellation.addEdge(['Ascella', 'Nunki']);
sagittariusConstellation.addEdge(['Kaus Borealis', 'Nunki']);

// --- Capricornus ---
const capricornusDesc = `Capricornus is one of the constellations of the zodiac. Its name is Latin for "horned goat" or "goat horn," and it is commonly represented as a sea-goat (a goat with a fish's tail). It is one of the oldest recorded constellations, recognized by Babylonian astronomers. Capricornus is faint and contains no stars brighter than magnitude 3.0. The Sun is in Capricornus from approximately January 20 to February 16.`;
const capricornusConstellation = new Constellation('Capricornus', capricornusDesc, vec4(0.2, 0.9, 0.3, 1.0));
capricornusConstellation.addStar(new Star('Algedi', 'Algedi (α Cap) appears as a double star to the naked eye, but the two components are not a true binary — they are just aligned by chance. The brighter is about 100 light-years away; the fainter about 690 light-years. The name means "the kid" in Arabic.', 292, -82));
capricornusConstellation.addStar(new Star('Dabih', 'Dabih (β Cap) is a complex multiple star system about 340 light-years from Earth. Its name means "the lucky stars of the slaughterer" in Arabic, related to a traditional slaughter of animals marking the solstice.', 308, -88));
capricornusConstellation.addStar(new Star('Nashira', 'Nashira (γ Cap) is a white giant about 139 light-years away. Its name means "the fortunate one" or "bearer of good news" in Arabic.', 352, -108));
capricornusConstellation.addStar(new Star('Deneb Algedi', 'Deneb Algedi (δ Cap) is the brightest star in Capricornus despite being designated Delta. It is an eclipsing binary about 39 light-years away. Its name means "the tail of the goat" in Arabic.', 368, -118));
capricornusConstellation.addEdge(['Algedi', 'Dabih']);
capricornusConstellation.addEdge(['Dabih', 'Nashira']);
capricornusConstellation.addEdge(['Nashira', 'Deneb Algedi']);

// --- Aquarius ---
const aquariusDesc = `Aquarius is a constellation of the zodiac, situated between Capricornus and Pisces. Its name is Latin for "water-carrier" or "cup-carrier," and it is one of the oldest recognized constellations. The Aquarius stream — a line of stars representing the stream of water poured from the water-jug — is a distinctive feature. The Sun is in Aquarius from approximately February 16 to March 11.`;
const aquariusConstellation = new Constellation('Aquarius', aquariusDesc, vec4(0.2, 0.8, 0.8, 1.0));
aquariusConstellation.addStar(new Star('Sadalsuud', 'Sadalsuud (β Aqr) is the brightest star in Aquarius. It is a yellow supergiant about 610 light-years away. Its name means "the luckiest of the lucky" in Arabic, associated with the arrival of spring rains.', 268, -78));
aquariusConstellation.addStar(new Star('Sadalmelik', 'Sadalmelik (α Aqr) is a yellow giant about 520 light-years away. Despite being designated Alpha, it is slightly dimmer than Sadalsuud. Its name means "the lucky stars of the king" in Arabic.', 282, -58));
aquariusConstellation.addStar(new Star('Sadachbia', 'Sadachbia (γ Aqr) is a blue-white star about 158 light-years from Earth. Its name means "the lucky stars of the tents" in Arabic, traditionally associated with the arrival of spring.', 312, -68));
aquariusConstellation.addStar(new Star('Skat', 'Skat (δ Aqr) is a white main-sequence star about 113 light-years away. Its name is derived from the Arabic for "shin," referring to the leg of the water-carrier.', 325, -98));
aquariusConstellation.addEdge(['Sadalsuud', 'Sadalmelik']);
aquariusConstellation.addEdge(['Sadalmelik', 'Sadachbia']);
aquariusConstellation.addEdge(['Sadachbia', 'Skat']);
aquariusConstellation.addEdge(['Sadalsuud', 'Skat']);

// --- Pisces ---
const piscesDesc = `Pisces is a constellation of the zodiac. Its name is the Latin plural for "fish," and it is associated in mythology with the goddess Aphrodite and her son Eros, who transformed into fish to escape the monster Typhon. Despite being a large constellation, Pisces is faint and lacks bright stars. The vernal equinox (First Point of Aries) now actually lies within Pisces due to the precession of the equinoxes.`;
const piscesConstellation = new Constellation('Pisces', piscesDesc, vec4(0.85, 0.85, 1.0, 1.0));
piscesConstellation.addStar(new Star('Alrescha', 'Alrescha (α Psc) marks the knot of the cord joining the two fish. It is a binary star about 139 light-years away. The name means "the cord" or "the rope" in Arabic.', -295, 38));
piscesConstellation.addStar(new Star('Eta Piscium', 'Eta Piscium (η Psc) is the brightest star in Pisces, a yellow giant about 294 light-years away. It marks the tail of the southern fish.', -322, 55));
piscesConstellation.addStar(new Star('Omega Piscium', 'Omega Piscium (ω Psc) is an F-type main-sequence star about 106 light-years away, lying in the body of the northern fish.', -358, 88));
piscesConstellation.addEdge(['Alrescha', 'Eta Piscium']);
piscesConstellation.addEdge(['Eta Piscium', 'Omega Piscium']);

// --- Carina ---
const carinaDesc = `Carina is a constellation in the southern sky. Its name is Latin for "keel" (of a ship). Carina was once part of the larger constellation Argo Navis (the ship of the Argonauts), which was divided into three parts by Nicolas Louis de Lacaille in the 18th century. It contains Canopus, the second-brightest star in the entire night sky, and the famous Carina Nebula, one of the largest and brightest nebulae, containing the unstable hypergiant star Eta Carinae.`;
const carinaConstellation = new Constellation('Carina', carinaDesc, vec4(1.0, 1.0, 1.0, 1.0));
carinaConstellation.addStar(new Star('Canopus', 'Canopus (α Car) is the second-brightest star in the night sky with an apparent magnitude of -0.74. It is a white-yellow supergiant about 310 light-years away with a luminosity approximately 10,000 times that of the Sun. It is used as a reference star for spacecraft navigation.', -148, -198));
carinaConstellation.addStar(new Star('Miaplacidus', 'Miaplacidus (β Car) is the second-brightest star in Carina. It is a blue-white giant about 113 light-years away. The origin of its unusual name is uncertain — it may come from Arabic or be a corrupted form of a longer phrase.', -95, -278));
carinaConstellation.addStar(new Star('Avior', 'Avior (ε Car) is a binary star about 632 light-years away, consisting of a giant K-type star and a hot blue companion. Avior is used as a navigation star and is the fourth-brightest star in Carina.', -45, -252));
carinaConstellation.addStar(new Star('Aspidiske', 'Aspidiske (ι Car) is a white supergiant about 690 light-years from Earth. Its name means "small shield" in Greek. It is also known as Turais and is one of the brighter stars in the keel of the ancient ship Argo.', 32, -218));
carinaConstellation.addEdge(['Canopus', 'Miaplacidus']);
carinaConstellation.addEdge(['Miaplacidus', 'Avior']);
carinaConstellation.addEdge(['Avior', 'Aspidiske']);

// ----------------------------------------------------------------|
//          All constellations (zodiac order + Carina)             |
// ----------------------------------------------------------------|

const constellations = [
    ariesConstellation,
    taurusConstellation,
    geminiConstellation,
    cancerConstellation,
    leoConstellation,
    virgoConstellation,
    libraConstellation,
    scorpiusConstellation,
    sagittariusConstellation,
    capricornusConstellation,
    aquariusConstellation,
    piscesConstellation,
    carinaConstellation,
];

// ----------------------------------------------------------------|
//          Select constellation                                    |
// ----------------------------------------------------------------|

function selectConstellation(constellation) {
    // reset highlighted star to white
    if (selectedStar >= 0) {
        gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * selectedStar, flatten(white));
        selectedStar = -1;
    }

    activeConstellation = constellation;
    linesIndex = 0;
    lines = [];
    constellation.drawEdges();

    document.getElementById('stars-list').innerHTML = `
        <h4>${constellation.name}: </h4>
        <ul class="flex center" style="margin-left: 2px; gap: 5px; flex-wrap: wrap;">
            ${constellation.getStarsName().map(name => `<li>${name}</li>`).join('')}
        </ul>`;

    document.getElementById('info-constellation').innerText = constellation.name;
    document.getElementById('desc-constellation').innerText = constellation.desc;
    document.getElementById('description').innerText = '';

    document.querySelectorAll('.constellation-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.name === constellation.name);
    });
}

// ----------------------------------------------------------------|
//          Main                                                    |
// ----------------------------------------------------------------|

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

    pointProgram = initShaders(gl, "point-vertex-shader", "fragment-shader");
    lineProgram = initShaders(gl, "line-vertex-shader", "fragment-shader");

    // Points buffer
    pointBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    pointColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    // Lines buffer
    lineBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    lineColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    // Draw all stars (starfield)
    constellations.forEach(c => c.drawStars());

    // Build constellation selector buttons
    const selector = document.getElementById('constellation-selector');
    constellations.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'constellation-btn';
        btn.dataset.name = c.name;
        btn.textContent = c.name;
        btn.onclick = () => selectConstellation(c);
        selector.appendChild(btn);
    });

    // Highlight button
    const starName = document.getElementById('star-name');
    const highlightBtn = document.getElementById('highlight');
    highlightBtn.onclick = () => {
        if (!starName.value || !activeConstellation) return;
        activeConstellation.hightlightStar(starName.value);
    };

    // Default: select Leo
    selectConstellation(leoConstellation);

    render();
}

// ----------------------------------------------------------------|
//          Render loop                                            |
// ----------------------------------------------------------------|

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw all star points (starfield)
    if (pointsIndex > 0) {
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

    // Draw active constellation edges
    if (linesIndex > 0) {
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
