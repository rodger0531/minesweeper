import { useState, useEffect } from "react";
import classNames from "classnames";
import generateMineField from "./utils/generateMineFIeld";
import { revealAllValid } from "./utils";
import { Timer } from "./timer";
import { GAME_STATUS } from "./utils/constants";
import { RestartButton } from "./restartButton";
import { BlockDisplay } from "./blockDisplay";

function App() {
  const [mineField, setMineField] = useState(generateMineField());
  const [depressed, setDepressed] = useState([]);
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.RESET);
  const [clicking, setClicking] = useState(false);
  const [clickedMine, setClickedMine] = useState();
  const [numberOfFlags, setNumberOfFlags] = useState(10);

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
    if (gameStatus === GAME_STATUS.RESET) setGameStatus(GAME_STATUS.PLAYING);

    if (
      !block.revealed &&
      !block.flagged &&
      (gameStatus === GAME_STATUS.PLAYING || gameStatus === GAME_STATUS.RESET)
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
    if (
      (gameStatus === GAME_STATUS.PLAYING ||
        gameStatus === GAME_STATUS.RESET) &&
      !block.revealed
    ) {
      const tempMineField = [...mineField];
      setNumberOfFlags((prev) => {
        tempMineField[row][col].flagged ? prev-- : prev++;
        return prev;
      });
      tempMineField[row][col].flagged = !tempMineField[row][col].flagged;
      setMineField([...tempMineField]);
    }
  };

  const mouseDownHandler = (e, block, row, col) => {
    if (
      gameStatus === GAME_STATUS.PLAYING ||
      gameStatus === GAME_STATUS.RESET
    ) {
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
    if (
      gameStatus === GAME_STATUS.PLAYING ||
      gameStatus === GAME_STATUS.RESET
    ) {
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

  const resetGame = () => {
    setMineField(generateMineField());
    setDepressed([]);
    setGameStatus(GAME_STATUS.RESET);
    setClickedMine();
    setNumberOfFlags(10);
  };

  const renderBlockClassName = (block, row, col) => {
    let name = "";
    name +=
      block.flagged && gameStatus === GAME_STATUS.WIN
        ? "bg-green-700"
        : "bg-gray-400";

    name += " " + blockConditionalFontColour(block);
    name +=
      (!block.revealed && !block.depressed) || (block.revealed && block.flagged)
        ? " block-border"
        : "";
    name +=
      clickedMine && row === clickedMine.row && col === clickedMine.col
        ? " bg-red-600"
        : "";

    return name;
  };

  const emojiConditionalDisplay = () => {
    if (clicking) return ":O";
    switch (gameStatus) {
      case GAME_STATUS.WIN:
        return ":◗";
      case GAME_STATUS.LOST:
        return "Xᗡ";
      case GAME_STATUS.PLAYING:
      case GAME_STATUS.RESET:
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
        <div className="flex w-full mb-8">
          <Timer gameStatus={gameStatus} />
          <div className="flex items-center justify-center w-1/3">
            <div className="transform rotate-90 align-middle text-3xl font-bold">
              {emojiConditionalDisplay()}
            </div>
          </div>
          <div className="w-1/3 flex justify-between">
            <RestartButton resetGame={resetGame} gameStatus={gameStatus} />
            <span className="text-5xl font-medium font-digital text-red-600">
              {numberOfFlags}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-10">
          {mineField.map((row, rowIdx) =>
            row.map((block, colIdx) => (
              <div
                key={block.id}
                className={classNames(
                  "h-10 w-10 border border-gray-500 shadow-inner relative text-xl font-minesweeper",
                  renderBlockClassName(block, rowIdx, colIdx)
                )}
                onClick={() => onClickBlock(block, rowIdx, colIdx)}
                onContextMenu={(e) => rightClick(e, block, rowIdx, colIdx)}
                onMouseDown={(e) => mouseDownHandler(e, block, rowIdx, colIdx)}
                onMouseUp={mouseUpHandler}
              >
                <BlockDisplay gameStatus={gameStatus} block={block} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
