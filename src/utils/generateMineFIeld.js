import { nanoid } from "nanoid";
import { generateRandomUniqueNumbers } from "./utils";

export default function generateMineField() {
  const mines = generateRandomUniqueNumbers(10, 100);

  let mineGrid = new Array(10).fill().map((_, row) =>
    new Array(10).fill().map((_, col) => {
      return {
        mine: mines.indexOf(+`${row}${col}`) > -1,
        minesNearby: 0,
        revealed: false,
        depressed: false,
        flagged: false,
        id: nanoid(),
      };
    })
  );

  const processPoint = (x, y) => {
    if (x > -1 && y > -1 && x < 10 && y < 10) {
      if (!mineGrid[x][y].mine) mineGrid[x][y].minesNearby++;
    }
  };

  mineGrid.forEach((row, rowIdx) => {
    row.forEach((col, colIdx) => {
      if (col.mine) {
        mineGrid[rowIdx][colIdx].minesNearby = null;
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

  return mineGrid;
}
