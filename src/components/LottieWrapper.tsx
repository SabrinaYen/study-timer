// components/LottieWrapper.tsx
"use client";
import Lottie from "lottie-react";

type LottieWrapperProps = {
    animationData: any;
  };
  
export default function LottieWrapper({ animationData }: LottieWrapperProps) {
  return <Lottie animationData={animationData} loop={true} />;
}