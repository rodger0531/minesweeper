import React from "react";
import { GAME_STATUS } from "../utils/constants";

export const RestartButton = ({ resetGame, gameStatus }) => {
  return (
    <>
      <button onClick={resetGame} className="focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transition ${
            gameStatus === GAME_STATUS.WIN || gameStatus === GAME_STATUS.LOST
              ? "text-gray-700"
              : "text-gray-400"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </>
  );
};
