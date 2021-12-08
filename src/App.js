import { useState } from "react";
import { nanoid } from "nanoid";
import classNames from "classnames";

const nums = new Set();
while (nums.size !== 10) {
  nums.add(Math.floor(Math.random() * 100));
}

let mines = [...nums].sort((a, b) => a - b);
mines = mines.map((num) => [Math.floor(num / 10), num % 10]);

const hasMine = (row, col) => {
  if (mines.length === 0) return false;
  if (mines[0][0] === row && mines[0][1] === col) {
    mines.shift();
    return true;
  } else return false;
};
let mineGrid = new Array(10).fill().map((_, row) =>
  new Array(10).fill().map((_, col) => {
    return {
      mine: hasMine(row, col),
      minesNearby: 0,
      revealed: false,
      depressed: false,
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

function App() {
  const [mineField, setMineField] = useState(mineGrid);
  const [depressed, setDepressed] = useState([]);

  const onClickBlock = (block, row, col) => {
    if (!block.revealed) {
      console.log("onclick");
      if (block.mine) {
        console.log("Boom!");
      } else {
        setMineField((prev) => {
          prev[row][col].revealed = true;
          return [...prev];
        });
      }
    }
  };

  const mouseDownHandler = (e, block) => {
    if (e.button === 0 && block.revealed) {
      console.log("left clicking");
    }
  };

  const mouseUpHandler = () => {
    if (depressed.length !== 0) {
      console.log("mouse up");
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-900">
      <div className="flex items-center justify-center bg-gray-100 p-12 rounded ">
        <div className="grid grid-cols-10">
          {mineField.map((row, rowIdx) =>
            row.map((block, colIdx) => (
              <div
                key={block.id}
                className={classNames(
                  "h-6 w-6 m-px",
                  block.depressed
                    ? "bg-gray-600"
                    : block.mine
                    ? "bg-red-400"
                    : block.revealed
                    ? "bg-gray-500"
                    : "bg-gray-400",
                  "shadow-inner text-gray-700 flex items-center justify-center"
                )}
                onClick={() => onClickBlock(block, rowIdx, colIdx)}
                onContextMenu={(e) => e.preventDefault()}
                onMouseDown={(e) => mouseDownHandler(e, block)}
                onMouseUp={mouseUpHandler}
              >
                {block.minesNearby}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
