import { useEffect, useState } from "react";

type PlayerClockProps = {
  timeLeftInSeconds: number;
  running: boolean;
};

export const PlayerClock = ({ timeLeftInSeconds, running }: PlayerClockProps) => {
  const [timeLeft, setTimeLeft] = useState(timeLeftInSeconds);

  useEffect(() => {
    setTimeLeft(timeLeftInSeconds);

    if (!running) {
      return;
    }

    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      setTimeLeft(Math.max(0, timeLeftInSeconds - (Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [running, timeLeftInSeconds]);

  const total = Math.max(0, Math.round(timeLeft));
  const formatted = `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, "0")}`;

  return <time dateTime={formatted}>{formatted}</time>;
};
