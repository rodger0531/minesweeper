import { useState, useEffect } from "react";
import classNames from "classnames";
import generateMineField from "./utils/generateMineFIeld";
import { revealAllValid } from "./utils";

const GAME_STATUS = { PLAYING: 0, WIN: 1, LOST: 2 };
const [mineLocations, initialMineField] = generateMineField();

function App() {
  const [mineField, setMineField] = useState(initialMineField);
  const [depressed, setDepressed] = useState([]);
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.PLAYING);

  useEffect(() => {
    if (gameStatus === GAME_STATUS.LOST) {
      let tempMineField = [...mineField];
      tempMineField.forEach((row, rowIdx) => {
        row.forEach((_, colIdx) => {
          if (tempMineField[rowIdx][colIdx].mine) {
            tempMineField[rowIdx][colIdx].revealed = true;
          }
        });
      });
      setMineField(tempMineField);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus]);

  const onClickBlock = (block, row, col) => {
    if (
      !block.revealed &&
      !block.flagged &&
      gameStatus === GAME_STATUS.PLAYING
    ) {
      if (block.mine) {
        setGameStatus(GAME_STATUS.LOST);
      } else {
        let tempMineField = [...mineField];
        tempMineField = revealNearby(tempMineField, row, col);
        setMineField(tempMineField);
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
    if (
      e.button === 0 &&
      block.revealed &&
      gameStatus === GAME_STATUS.PLAYING
    ) {
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
        row < mineField.length &&
        col < mineField[0].length &&
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
    if (depressed.length !== 0 && gameStatus === GAME_STATUS.PLAYING) {
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

      if (wrongGuess) setGameStatus(GAME_STATUS.LOST);

      depressed.forEach(([row, col]) => {
        if (allSolved && !tempMineField[row][col].mine) {
          tempMineField = revealNearby(tempMineField, row, col);
        }
        tempMineField[row][col].depressed = false;
      });
      setMineField(tempMineField);
      setDepressed([]);
    }
  };

  function revealNearby(tempMineField, row, col) {
    if (tempMineField[row][col].minesNearby) {
      tempMineField[row][col].revealed = true;
    } else {
      tempMineField = revealAllValid(tempMineField, row, col);
    }
    return tempMineField;
  }

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

  const blockConditionalDisplay = (block) => {
    if (block.revealed) {
      if (block.mine) {
        if (block.flagged) return "🚩";
        else return "💥";
      }
      if (block.minesNearby !== 0) return block.minesNearby;
    } else {
      if (block.flagged) return "🚩";
    }
    return "";
  };

  const blockConditionalBackgroundColor = (block) => {
    if (gameStatus === GAME_STATUS.LOST) {
      if (block.flagged) {
        if (!block.revealed) return "bg-red-300";
      } else {
        if (block.mine) return "bg-red-600";
      }
    }

    if (block.depressed) return "bg-gray-500";
    if (block.flagged) return "bg-gray-400";
    if (block.revealed) return "bg-gray-500";
    else return "bg-gray-400";
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
                  blockConditionalBackgroundColor(block),
                  "shadow-inner text-gray-900 flex items-center justify-center"
                )}
                onClick={() => onClickBlock(block, rowIdx, colIdx)}
                onContextMenu={(e) => rightClick(e, block, rowIdx, colIdx)}
                onMouseDown={(e) => mouseDownHandler(e, block, rowIdx, colIdx)}
                onMouseUp={mouseUpHandler}
              >
                {blockConditionalDisplay(block)}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
