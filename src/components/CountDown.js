import React, { useState, useEffect } from "react";

import { Text } from "react-native";

function CountDown({ seconds, color, fontSize }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [timeLeft]);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const minutes = Math.floor(timeLeft / 60);
  const secondsRemaining = timeLeft % 60;

  return (
    <Text
      style={{
        fontSize: fontSize,
        fontWeight: "bold",
        color: color,
        textAlign: "center",
      }}
    >{`${formatTime(minutes)}:${formatTime(secondsRemaining)}`}</Text>
  );
}

export default CountDown;
