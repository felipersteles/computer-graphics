function subtractVectors(vec1, vec2) {
  // Assumes vec1 and vec2 have the same dimensions (e.g., both vec3)
  const result = [];
  for (let i = 0; i < vec1.length; i++) {
    result.push(vec1[i] - vec2[i]);
  }

  return result;
}

function addVectors(vec1, vec2) {
  // Assumes vec1 and vec2 have the same dimensions (e.g., both vec3)
  const result = [];
  for (let i = 0; i < vec1.length; i++) {
    result.push(vec1[i] + vec2[i]);
  }

  return result;
}

function scaleVector(vec, scale) {
  // Assumes vec is a vector and scale is a number
  const result = [];

  for (let i = 0; i < vec.length; i++) {
    result.push(vec[i] * scale);
  }

  return result;
}

function multiplyMatrixVector(matrix, array) {

  if (matrix[0].length != array.length) {
    console.log("error: matrix length is not equal to length of array");
    return;
  }

  var result = [];

  for (var i = 0; i < matrix.length; i++) {
    var sum = 0;
    for (var j = 0; j < array.length; j++) {
      sum += matrix[i][j] * array[j];
    }
    result.push(sum);
  }

  return result;
}

function lerp(start, end, amount) {
  // Linear interpolation function (assuming start and end are vec3)
  return addVectors(
    scaleVector(start, 1 - amount),
    scaleVector(end, amount)
  );
}