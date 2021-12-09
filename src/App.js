import { useState } from "react";
import classNames from "classnames";
import generateMineField from "./utils/generateMineFIeld";

function App() {
  const [mineField, setMineField] = useState(generateMineField());
  const [depressed, setDepressed] = useState([]);

  const onClickBlock = (block, row, col) => {
    if (!block.revealed) {
      if (block.mine) {
        console.log("Boom!");
      } else {
        let tempMineField = [...mineField];
        if (tempMineField[row][col].minesNearby) {
          tempMineField[row][col].revealed = true;
        } else {
          tempMineField = revealAllValid(tempMineField, row, col);
        }
        setMineField(tempMineField);
      }
    }
  };

  const revealAllValid = (field, row, col) => {
    const dir = [-1, 0, 1];
    checkValid(row, col);
    return field;
    function checkValid(x, y) {
      if (x > -1 && y > -1 && x < 10 && y < 10 && !field[x][y].revealed) {
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
  };

  const rightClick = (e, block, row, col) => {
    e.preventDefault();
    if (!block.revealed) {
      const tempMineField = [...mineField];
      tempMineField[row][col].flagged = !tempMineField[row][col].flagged;
      setMineField([...tempMineField]);
    }
  };

  const mouseDownHandler = (e, block, row, col) => {
    if (e.button === 0 && block.revealed) {
      // Depress unflagged neighbouring blocks
      depressBlocks(row, col);
    }
  };

  const depressBlocks = (row, col) => {
    const blocks = [];

    const checkValidForDepressed = (row, col) => {
      if (
        row > -1 &&
        col > -1 &&
        row < 10 &&
        col < 10 &&
        !mineField[row][col].revealed
      ) {
        blocks.push([row, col]);
      }
    };

    const dir = [-1, 0, 1];

    for (let i = 0; i < dir.length; i++) {
      for (let j = 0; j < dir.length; j++) {
        checkValidForDepressed(row + dir[i], col + dir[j]);
      }
    }

    if (blocks.length > 0) {
      const tempMineField = [...mineField];
      blocks.forEach(([row, col]) => {
        if (!tempMineField[row][col].flagged) {
          tempMineField[row][col].depressed = true;
        }
      });
      setDepressed(blocks);
      setMineField(tempMineField);
    }
  };

  const mouseUpHandler = () => {
    if (depressed.length !== 0) {
      // if not (but correct) show depressed blocks
      // if wrong - lose
      let tempMineField = [...mineField];

      const wrongGuess = depressed.some(
        ([row, col]) =>
          tempMineField[row][col].flagged && !tempMineField[row][col].mine
      );
      const allSolved = depressed.every(
        ([row, col]) =>
          tempMineField[row][col].flagged === tempMineField[row][col].mine
      );

      if (wrongGuess) console.log("lose");

      depressed.forEach(([row, col]) => {
        if (allSolved && !tempMineField[row][col].mine) {
          if (tempMineField[row][col].minesNearby) {
            tempMineField[row][col].revealed = true;
          } else {
            tempMineField = revealAllValid(tempMineField, row, col);
          }
        }
        tempMineField[row][col].depressed = false;
      });
      setMineField(tempMineField);
      setDepressed([]);
    }
  };

  // Win condition
  if (mineField.flat().every((block) => !block.revealed === block.mine)) {
    console.log("Win!");
    const tempMineField = [...mineField];
    tempMineField.forEach((row, rowIdx) => {
      row.forEach((_, colIdx) => {
        if (tempMineField[rowIdx][colIdx].mine) {
          tempMineField[rowIdx][colIdx].flagged = true;
        }
      });
    });
  }

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
                  "shadow-inner text-gray-900 flex items-center justify-center"
                )}
                onClick={() => onClickBlock(block, rowIdx, colIdx)}
                onContextMenu={(e) => rightClick(e, block, rowIdx, colIdx)}
                onMouseDown={(e) => mouseDownHandler(e, block, rowIdx, colIdx)}
                onMouseUp={mouseUpHandler}
              >
                {block.revealed
                  ? block.minesNearby === 0
                    ? ""
                    : block.minesNearby
                  : block.flagged
                  ? "🚩"
                  : ""}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
