
const getSphere = (pos = [3, 2.5, 0], radius = 1.0, segments = 10, rings = 150) => {

    var i, j;

    // Vertices
    var vertices = [], normals = [];
    for (j = 0; j <= rings; j++) {

        const theta = j * Math.PI / rings;

        const sj = Math.sin(theta);
        const cj = Math.cos(theta);

        for (i = 0; i <= segments; i++) {
            const phi = (i / segments) * Math.PI * 2;

            const si = Math.sin(phi);
            const ci = Math.cos(phi);

            const x = si * sj * radius;
            const y = cj * radius;
            const z = (ci * sj) * radius

            vertices.push(vec4(x + pos[0], y + pos[1], z + pos[2], 1.0));
            normals.push(ci * sj, cj, si * sj);
        }
    }

    return { 
        vertices,
        normals
     };
}


const getDiamond = (pos = [3, 2.5, 0], radius = 1.0, segments = 10, rings = 150) => {

    var i, j;

    // Vertices
    var vertices = [], normals = [];
    for (j = 0; j <= rings; j++) {

        const theta = j * Math.PI / rings;

        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (i = 0; i <= segments; i++) {
            const phi = (i / segments) * Math.PI * 2;

            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const x = sinPhi * sinTheta * radius;
            const y = sinTheta * radius;
            const z = (cosPhi * sinTheta) * radius

            vertices.push(vec4(x + pos[0], y + pos[1], z + pos[2], 1.0));
            normals.push(cosPhi * sinTheta, cosTheta, sinPhi * sinTheta);
        }
    }

    return { 
        vertices,
        normals
     };
}