"use client";

import { useEffect, useState, useRef } from "react";
import styles from "../app/page.module.css";
import Loading from "./Loading";

interface APIRandomType {
  text: string;
  author: string;
}

interface TimerValue {
  countDown: number;
  restTime: number;
}

interface TimerType {
  text: string;
  val: TimerValue;
}

interface ClockProps {
  TimerData?: TimerType;
  IsRest?: (val: boolean) => void;
}

export default function Clock({ TimerData, IsRest }: ClockProps) {
  const [isClient, setIsClient] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [countDown, setCountDown] = useState(0);
  const [quotes, setQuotes] = useState<APIRandomType>();
  const [isInRest, setIsInRest] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

  const MAX_CYCLES = 4;
  const REST_TIME = useRef(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const quoteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(false);
  const customTimer = useRef<NodeJS.Timeout | null>(null);
  const fetchMotiveQuote = () => {
    fetch("/api/quotes/random")
      .then((res) => res.json())
      .then(setQuotes);
  };

  const startTimerFrom = (startingSeconds: number) => {
    setCountDown(startingSeconds);
    setIsRunning(true);
    setIsPaused(false);
    fetchMotiveQuote();

    if (timerRef.current) clearInterval(timerRef.current);
    if (quoteTimerRef.current) clearInterval(quoteTimerRef.current);

    timerRef.current = setInterval(() => {
      setCountDown((prev) => {
        if (!isRunningRef.current) return prev;

        if (prev <= 1) {
          clearInterval(timerRef.current!);
          clearInterval(quoteTimerRef.current!);
          setIsRunning(false);
          setIsPaused(false);

          if (TimerData?.text !== "Custom") {
            if (!isInRest && REST_TIME.current > 0) {
              setIsInRest(true);
              setTimeout(() => IsRest?.(true), 0);
              startTimerFrom(REST_TIME.current);
            } else if (isInRest) {
              const nextCycle = cycleCount + 1;
              if (nextCycle < MAX_CYCLES) {
                setCycleCount(nextCycle);
                setIsInRest(false);
                setTimeout(() => IsRest?.(false), 0);
                startTimerFrom((TimerData?.val?.countDown ?? 0) * 60);
              } else {
                setIsInRest(false);
                setTimeout(() => IsRest?.(false), 0);
              }
            }
          } else {
            setTimeout(() => IsRest?.(false), 0);
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    quoteTimerRef.current = setInterval(() => {
      fetchMotiveQuote();
    }, 10000);
  };

  const handleStart = (timer: number, min: number, sec: number) => {
    const totalSeconds = timer > 0 ? timer * 60 : min * 60 + sec;
    if (!totalSeconds) return;
    startTimerFrom(totalSeconds);
  };

  const toggleStartPauseResume = (total:number,min:number,sec:number) => {
    if (isRunning) {
      setIsPaused(true);
      setIsRunning(false);
      clearInterval(customTimer.current!);
      setTimeout(() => IsRest?.(true), 0);
      return;
    }
    if (isPaused) {
      // 🔹 Resume
      setIsPaused(false);
      setIsRunning(true);
      setTimeout(() => IsRest?.(false), 0);
      customTimer.current = setInterval(() => {
        setCountDown((prev) => {
          if (prev <= 1) {
            clearInterval(customTimer.current!);
            clearInterval(quoteTimerRef.current!);
            setIsRunning(false);
            setIsPaused(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Optional: resume quotes if needed
      quoteTimerRef.current = setInterval(() => {
        fetchMotiveQuote();
      }, 10000);
      return;
    }
    // 🔹 First Start
    setCountDown(total)
    setIsRunning(true);
    setIsPaused(false);
    customTimer.current = setInterval(() => {
      setCountDown((prev) => {
        if (prev <= 1) {
          clearInterval(customTimer.current!);
          clearInterval(quoteTimerRef.current!);
          setIsRunning(false);
          setIsPaused(false);
        }
        return prev - 1;
      });
    }, 1000);

    // Optional: start motivational quotes on first start
    quoteTimerRef.current = setInterval(() => {
      fetchMotiveQuote();
    }, 10000);
  };

  const handleReset = () => {
    clearInterval(timerRef.current!);
    clearInterval(quoteTimerRef.current!);
    setIsRunning(false);
    setIsPaused(false);
    setCountDown(0);
    setCycleCount(0);
    setIsInRest(false);
  };

  useEffect(() => {
    setIsClient(true);
    return () => {
      clearInterval(timerRef.current!);
      clearInterval(quoteTimerRef.current!);
      clearInterval(customTimer.current!); // ✅ Add this
    };
  }, []);

  useEffect(() => {
    if (isClient && TimerData?.val?.restTime) {
      REST_TIME.current = TimerData.val.restTime * 60;
    }
    if (TimerData?.text === "Custom") {
      setCountDown(0);
      setMinutes(0);
      setSeconds(0);
      setIsInRest(false);
      setIsPaused(false);
      setIsRunning(false);
      clearInterval(timerRef.current!);
      clearInterval(quoteTimerRef.current!);
      clearInterval(customTimer.current!);
    } else if (TimerData?.val?.countDown) {
      setCycleCount(0);
      setIsInRest(false);
      handleStart(TimerData.val.countDown, 0, 0);
    }
  }, [isClient, TimerData]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!isClient || !TimerData) return null;

  return (
    <div className={styles.stressContainer}>
      {TimerData.text === "Custom" ? (
        <>
          <div className={styles.editableTimerBox}>
            {!isRunning && !isPaused ? (
              <>
                <input
                  type="number"
                  value={String(minutes).padStart(2, "0")}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 0 && val <= 59) {
                      setMinutes(val);
                    }
                  }}
                  className={styles.studyTimer}
                />
                <div>:</div>
                <input
                  type="number"
                  value={String(seconds).padStart(2, "0")}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 0 && val <= 59) {
                      setSeconds(val);
                    }
                  }}
                  className={styles.studyTimer}
                />
              </>
            ) : (
              <span className={styles.studyText}>
                {formatCountdown(countDown)}
              </span>
            )}
          </div>
          <div className={styles.buttonTimerGroup}>
            <button
              onClick={() => {
                const total = minutes * 60 + seconds;
                if (total <= 0) return;
                toggleStartPauseResume(total,minutes,seconds);
              }}
            >
              {isRunning ? "Pause" : isPaused ? "Resume" : "Start"}
            </button>
            <button onClick={handleReset}>Reset</button>
          </div>
        </>
      ) : (
        <span className={styles.studyText}>
          {countDown > 0 ? formatCountdown(countDown) : null}
        </span>
      )}
      {quotes && isRunning && (
        <div className={styles.quoteBox}>
          {!Object.keys(quotes).length ? (
            <Loading />
          ) : (
            <>
              <p className={styles.quoteText}>“{quotes.text}”</p>
              <p className={styles.quoteAuthor}>— {quotes.author}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
