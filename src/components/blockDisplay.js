import React from "react";
import classNames from "classnames";
import { GAME_STATUS } from "../utils/constants";

export const BlockDisplay = ({ block, gameStatus }) => {
  return (
    <>
      {gameStatus === GAME_STATUS.LOST && block.flagged && !block.mine && (
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
    </>
  );
};
