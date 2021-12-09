import { useState, useEffect } from "react";
import classNames from "classnames";
import generateMineField from "./utils/generateMineFIeld";
import { revealAllValid } from "./utils";

const GAME_STATUS = { PLAYING: 0, WIN: 1, LOST: 2 };

// Todo:
// wrong flag - display cross with mine
// red background with clicked wrong mine
// add timer
// add flags placed display

function App() {
  const [mineField, setMineField] = useState(generateMineField());
  const [depressed, setDepressed] = useState([]);
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.PLAYING);
  const [clicking, setClicking] = useState(false);
  const [clickedMine, setClickedMine] = useState();

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

  // Win condition
  useEffect(() => {
    if (
      mineField
        .flat()
        .every((block) => block.revealed || (block.flagged && block.mine))
    ) {
      setGameStatus(GAME_STATUS.WIN);
    }
  }, [mineField]);

  const onClickBlock = (block, row, col) => {
    if (
      !block.revealed &&
      !block.flagged &&
      gameStatus === GAME_STATUS.PLAYING
    ) {
      if (block.mine) {
        setGameStatus(GAME_STATUS.LOST);
        setClickedMine({ row, col });
      } else {
        let tempMineField = [...mineField];
        tempMineField = revealNearby(tempMineField, row, col);
        setMineField(tempMineField);
      }
    }
  };

  const rightClick = (e, block, row, col) => {
    e.preventDefault();
    if (gameStatus === GAME_STATUS.PLAYING && !block.revealed) {
      const tempMineField = [...mineField];
      tempMineField[row][col].flagged = !tempMineField[row][col].flagged;
      setMineField([...tempMineField]);
    }
  };

  const mouseDownHandler = (e, block, row, col) => {
    if (gameStatus === GAME_STATUS.PLAYING) {
      setClicking(true);
      if (e.button === 0 && block.revealed) {
        depressBlocks(row, col);
      }
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
    if (gameStatus === GAME_STATUS.PLAYING) {
      setClicking(false);
      if (depressed.length !== 0) {
        let tempMineField = [...mineField];

        const wrongGuess = depressed.some(
          ([row, col]) =>
            tempMineField[row][col].flagged && !tempMineField[row][col].mine
        );

        if (wrongGuess) return setGameStatus(GAME_STATUS.LOST);
        const allSolved = depressed.every(
          ([row, col]) =>
            tempMineField[row][col].flagged === tempMineField[row][col].mine
        );

        depressed.forEach(([row, col]) => {
          if (allSolved && !tempMineField[row][col].mine) {
            tempMineField = revealNearby(tempMineField, row, col);
          }
          tempMineField[row][col].depressed = false;
        });
        setMineField(tempMineField);
        setDepressed([]);
      }
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

  const emojiConditionalDisplay = () => {
    if (clicking) return ":O";
    switch (gameStatus) {
      case GAME_STATUS.WIN:
        return ":◗";
      case GAME_STATUS.LOST:
        return "Xᗡ";
      case GAME_STATUS.PLAYING:
        return ": )";
      default:
        return;
    }
  };

  const blockConditionalFontColour = (block) => {
    switch (block.minesNearby) {
      case 1:
        return "text-blue-700";
      case 2:
        return "text-green-600";
      case 3:
        return "text-red-600";
      default:
        return "text-gray-800";
    }
  };
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-900">
      <div className="flex flex-col items-center justify-center bg-gray-100 p-12 rounded ">
        <div className="mb-8 transform rotate-90">
          <span className="align-middle text-3xl font-bold">
            {emojiConditionalDisplay()}
          </span>
        </div>
        <div className="grid grid-cols-10">
          {mineField.map((row, rowIdx) =>
            row.map((block, colIdx) => (
              <div
                key={block.id}
                className={classNames(
                  "h-10 w-10 border border-gray-500 shadow-inner relative",
                  block.flagged && gameStatus === GAME_STATUS.WIN
                    ? "bg-green-700"
                    : "bg-gray-400",
                  "text-xl font-minesweeper",
                  blockConditionalFontColour(block),
                  ((!block.revealed && !block.depressed) ||
                    (block.revealed && block.flagged)) &&
                    "block-border",
                  clickedMine &&
                    rowIdx === clickedMine.row &&
                    colIdx === clickedMine.col &&
                    "bg-red-600"
                )}
                onClick={() => onClickBlock(block, rowIdx, colIdx)}
                onContextMenu={(e) => rightClick(e, block, rowIdx, colIdx)}
                onMouseDown={(e) => mouseDownHandler(e, block, rowIdx, colIdx)}
                onMouseUp={mouseUpHandler}
              >
                {gameStatus === GAME_STATUS.LOST &&
                  block.flagged &&
                  !block.mine && (
                    <div className="w-full h-full absolute wrong-flag" />
                  )}
                <span
                  className={classNames(
                    "flex items-center justify-center w-full h-full",
                    block.flagged
                      ? "block-flag"
                      : block.mine && block.revealed && "block-mine"
                  )}
                >
                  {block.revealed && !block.mine && block.minesNearby !== 0
                    ? block.minesNearby
                    : ""}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
