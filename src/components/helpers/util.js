
// Compares 2 arrays
export const isEqual = (array, other) => {
  if (array.length !== other.length) {
    return false;
  }

  let index = -1;

  while (++index < array.length) {
    if (array[index] !== other[index]) return false;
  }

  return true;
}

// Finds the closest value in an array and returns the index
export const indexOFClosest = (array, value) => {
  return array.reduce((prev, curr) => {
    return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
  });
}
