import { nanoid } from "nanoid";
import { generateRandomUniqueNumbers } from "./";

export default function generateMineField() {
  const mineLocation = generateRandomUniqueNumbers(10, 100);

  let mineGrid = new Array(10).fill().map((_, row) =>
    new Array(10).fill().map((_, col) => {
      return {
        mine: mineLocation.indexOf(+`${row}${col}`) > -1,
        minesNearby: 0,
        revealed: false,
        depressed: false,
        flagged: false,
        id: nanoid(),
      };
    })
  );
  return generateDistanceMap(mineGrid);
}

function generateDistanceMap(arr) {
  let newArr = [...arr];

  const processPoint = (x, y) => {
    if (x > -1 && y > -1 && x < newArr.length && y < newArr[0].length) {
      if (!arr[x][y].mine) arr[x][y].minesNearby = arr[x][y].minesNearby + 1;
    }
  };

  arr.forEach((row, rowIdx) => {
    row.forEach((col, colIdx) => {
      if (col.mine) {
        arr[rowIdx][colIdx].minesNearby = null;
        processPoint(rowIdx - 1, colIdx - 1);
        processPoint(rowIdx - 1, colIdx);
        processPoint(rowIdx - 1, colIdx + 1);
        processPoint(rowIdx, colIdx - 1);
        processPoint(rowIdx, colIdx + 1);
        processPoint(rowIdx + 1, colIdx - 1);
        processPoint(rowIdx + 1, colIdx);
        processPoint(rowIdx + 1, colIdx + 1);
      }
    });
  });

  return newArr;
}
