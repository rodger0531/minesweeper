import { useState, useEffect } from "react";

export const Timer = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let timer = setTimeout(() => {
      setTime(time + 1);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  return (
    <div className="w-1/3 text-5xl font-medium font-digital text-red-600">
      <span className="w-12 flex justify-end">{time}</span>
    </div>
  );
};
