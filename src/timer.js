import { useState, useEffect } from "react";

export const Timer = ({ isStart }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer1;
    if (isStart) {
      timer1 = setInterval(() => {
        setSeconds((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(timer1);
    }
    return () => clearInterval(timer1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStart]);

  return (
    <div className="w-1/3 text-5xl font-medium font-digital text-red-600">
      {seconds}
    </div>
  );
};
