import { useState, useEffect } from "react";
import classNames from "classnames";
import generateMineField from "./utils/generateMineFIeld";
import { revealAllValid } from "./utils";

const GAME_STATUS = { PLAYING: 0, WIN: 1, LOST: 2 };

function App() {
  const [mineField, setMineField] = useState(generateMineField());
  const [depressed, setDepressed] = useState([]);
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.PLAYING);
  const [clicking, setClicking] = useState(false);

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
        const allSolved = depressed.every(
          ([row, col]) =>
            tempMineField[row][col].flagged === tempMineField[row][col].mine
        );

        if (wrongGuess) return setGameStatus(GAME_STATUS.LOST);

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

  const blockConditionalDisplay = (block) => {
    if (block.revealed) {
      if (block.mine && !block.flagged) return "💥";
      if (!block.mine && block.minesNearby !== 0) return block.minesNearby;
    }
    if (block.flagged) return "🚩";
    return "";
  };

  const blockConditionalBackgroundColor = (block) => {
    // For testing
    // if (block.mine) return "bg-red-600";

    if (gameStatus === GAME_STATUS.LOST) {
      if (block.flagged) {
        if (!block.revealed) return "bg-red-300";
      } else {
        if (block.mine) return "bg-red-600";
      }
    }

    if (block.depressed && gameStatus === GAME_STATUS.PLAYING)
      return "bg-gray-500";
    if (block.flagged)
      return gameStatus === GAME_STATUS.WIN ? "bg-green-700" : "bg-gray-400";
    if (block.revealed) return "bg-gray-500";
    else return "bg-gray-400";
  };

  const emojiConditionalDisplay = () => {
    if (clicking) return ": O";
    switch (gameStatus) {
      case GAME_STATUS.WIN:
        return ":D";
      case GAME_STATUS.LOST:
        return "Xᗡ";
      case GAME_STATUS.PLAYING:
        return ": )";
      default:
        return;
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-900">
      <div className="flex flex-col items-center justify-center bg-gray-100 p-12 rounded ">
        <div className="mb-8 transform rotate-90">
          <span className="text-center">{emojiConditionalDisplay()}</span>
        </div>
        <div className="grid grid-cols-10">
          {mineField.map((row, rowIdx) =>
            row.map((block, colIdx) => (
              <div
                key={block.id}
                className={classNames(
                  "h-8 w-8 m-px",
                  blockConditionalBackgroundColor(block),
                  "shadow-inner text-2xl text-gray-900 flex items-center justify-center"
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
