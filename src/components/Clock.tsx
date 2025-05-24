"use client";

import { useEffect, useState, useRef } from "react";
import styles from "../app/page.module.css";

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
  ShowLoading?: (val: boolean) => void;
}

export default function Clock({ TimerData, IsRest, ShowLoading }: ClockProps) {
  const [isClient, setIsClient] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [countDown, setCountDown] = useState(0);
  const [quotes, setQuotes] = useState<APIRandomType>();
  const [openQuote, setOpenQuote] = useState(false);
  const [isInRest, setIsInRest] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

  const MAX_CYCLES = 4;
  const REST_TIME = useRef(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const quoteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef(false);

  const fetchMotiveQuote = () => {
    fetch("/api/quotes/random")
      .then((res) => res.json())
      .then(setQuotes);
  };

  const handlePause = () => {
    clearInterval(timerRef.current!);
    clearInterval(quoteTimerRef.current!);
    setIsRunning(false);
    setIsPaused(true);
    setOpenQuote(false);
    setTimeout(() => IsRest?.(true), 0);
  };

  const handleResume = () => {
    const min = Math.floor(countDown / 60);
    const sec = countDown % 60;
    handleStart(0, min, sec);
    setTimeout(() => IsRest?.(false), 0);
  };

  const handleReset = () => {
    clearInterval(timerRef.current!);
    clearInterval(quoteTimerRef.current!);
    setIsRunning(false);
    setIsPaused(false);
    setCountDown(0);
    setCycleCount(0);
    setIsInRest(false);
    setOpenQuote(false);
  };

  const handleStart = (timer: number, min: number, sec: number) => {
    const totalSeconds = timer > 0 ? timer * 60 : min * 60 + sec;
    if (!totalSeconds) return;
    setCountDown(totalSeconds);
    setIsRunning(true);
    setIsPaused(false);
    setOpenQuote(true);
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
          setOpenQuote(false);

          if (TimerData?.text !== "Custom") {
            if (!isInRest && REST_TIME.current > 0) {
              // Main countdown ended → start rest
              setIsInRest(true);
              setTimeout(() => IsRest?.(true), 0);
              handleStart(REST_TIME.current, 0, 0);
            } else if (isInRest) {
              const nextCycle = cycleCount + 1;
              if (nextCycle < MAX_CYCLES) {
                setCycleCount(nextCycle);
                setIsInRest(false);
                setTimeout(() => IsRest?.(false), 0);
                handleStart(TimerData?.val?.countDown ?? 0, 0, 0);
              } else {
                // All 4 cycles complete
                setIsInRest(false);
                setTimeout(() => IsRest?.(false), 0);
                console.log("✅ All 4 cycles completed.");
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

  useEffect(() => {
    setIsClient(true);
    return () => {
      clearInterval(timerRef.current!);
      clearInterval(quoteTimerRef.current!);
    };
  }, []);

  useEffect(() => {
    if (isClient && TimerData?.val?.restTime) {
      REST_TIME.current = TimerData.val.restTime * 60;
    }
  }, [isClient, TimerData]);

  useEffect(() => {
    if (TimerData?.val.countDown && TimerData.text !== "Custom") {
      setCycleCount(0);
      setIsInRest(false);
      handleStart(TimerData.val.countDown, 0, 0);
    }
  }, [TimerData]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!isClient || !TimerData) return null;

  return (
    <div className={styles.stressContainer}>
      {TimerData.text === "Custom" ? (
        <>
          <div className={styles.editableTimerBox}>
            {!isRunning ? (
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
                {countDown > 0 ? formatCountdown(countDown) : null}
              </span>
            )}
          </div>
          <div className={styles.buttonTimerGroup}>
            <button
              onClick={() => {
                if (isRunning) {
                  handlePause();
                } else if (isPaused) {
                  handleResume();
                } else {
                  handleStart(0, minutes, seconds);
                }
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
          <p className={styles.quoteText}>“{quotes.text}”</p>
          <p className={styles.quoteAuthor}>— {quotes.author}</p>
        </div>
      )}
    </div>
  );
}
