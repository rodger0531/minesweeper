/**
 * @param  {number} n - number of elements to return
 * @param  {number} maxRange - range of element
 * @returns {Array} sorted array of random numbers
 */
export function generateRandomUniqueNumbers(n, maxRange) {
  const nums = new Set();
  while (nums.size !== n) {
    nums.add(Math.floor(Math.random() * maxRange));
  }
  return [...nums].sort((a, b) => a - b);
}
