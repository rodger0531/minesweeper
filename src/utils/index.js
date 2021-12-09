/**
 * @param  {number} n - Number of elements to return
 * @param  {number} maxRange - Range of element
 * @returns {Array} Sorted array of random numbers
 */
export function generateRandomUniqueNumbers(n, maxRange) {
  const nums = new Set();
  while (nums.size !== n) {
    nums.add(Math.floor(Math.random() * maxRange));
  }
  return [...nums].sort((a, b) => a - b);
}

/**
 * @param  {Array} field - Minefield
 * @param  {number} row
 * @param  {number} col
 * @returns {Array} Conditioned minefield array
 */
export function revealAllValid(field, row, col) {
  const dir = [-1, 0, 1];
  checkValid(row, col);
  return field;

  function checkValid(x, y) {
    if (
      x > -1 &&
      y > -1 &&
      x < field.length &&
      y < field[0].length &&
      !field[x][y].revealed
    ) {
      field[x][y].revealed = true;
      if (!field[x][y].minesNearby) {
        for (let i = 0; i < dir.length; i++) {
          for (let j = 0; j < dir.length; j++) {
            checkValid(x + dir[i], y + dir[j]);
          }
        }
      }
    }
  }
}
