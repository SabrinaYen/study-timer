"use client";

import styles from "./page.module.css";
import StressStudyAfter from "../../public/assets/study-after.gif";
import StressStudy from "../../public/assets/study-before.gif";
import ResponsiveRedirect from "../components/resizeComponent";
import Clock from "../components/Clock";
import { useState } from "react";

interface TimerValue {
  countDown: number;
  restTime: number;
}

interface TimerType {
  text: string;
  val: TimerValue;
}

export default function Home() {
  const [selection, setSelection] = useState<TimerType>();
  const [isRest, setIsRest] = useState<Boolean>(false);
  const [showClock, setShowClock] = useState<Boolean>(false);
  const timerGroup = [
    {
      text: "25 mins x 5 mins",
      val: {
        countDown: 25,
        restTime: 5,
      },
    },
    {
      text: "25 mins x 10 mins",
      val: {
        countDown: 25,
        restTime: 10,
      },
    },
    {
      text: "25 mins x 15 mins",
      val: {
        countDown: 25,
        restTime: 15,
      },
    },
    {
      text: "Custom",
      val: {
        countDown: 0,
        restTime: 0,
      },
    },
  ];

  const handleTimer = (ind: number) => {
    setSelection(timerGroup[ind]);
    setShowClock(true);
  };
  const handleRest = (val: boolean) => {
    setIsRest(val);
  };
  return (
    <>
      <ResponsiveRedirect />
      <div className={styles.page}>
        <div className={styles.overlayPage}>
          <h1>StudyTimer do you prefer:</h1>
          <div className={styles.buttonGrp}>
            {timerGroup.map((i: TimerType, ind: number) => (
              <button onClick={() => handleTimer(ind)} key={ind}>
                {i.text}
              </button>
            ))}
          </div>
          <div className={styles.groupContainer}>
            {showClock ? (
              <>
                <Clock TimerData={selection} IsRest={handleRest} />
                <div>
                  {isRest ? (
                    <img
                      className={styles.StressStudyAfter}
                      src={StressStudyAfter.src}
                      alt="stress-study"
                    />
                  ) : (
                    <img src={StressStudy.src} alt="stress-study" />
                  )}
                </div>
              </>
            ) : (
              <img src={StressStudy.src} alt="stress-study" />
            )}
          </div>
          <div className={styles.playerContainer}>
            <iframe
              className={styles.player}
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
