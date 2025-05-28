"use client";

import { useRef } from "react";
import { useAlertBox } from "../store/alertBox";

// useAlert 함수 (Zustand 버전)
export const useAlert = () => {
  const alertOn = useAlertBox((state) => state.alertOn);
  const alertOff = useAlertBox((state) => state.alertOff);
  const timerRef = useRef<number | null>(null);

  // 알림을 트리거하는 함수
  const triggerAlert = (text: string) => {
    alertOn(text);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      alertOff();
    }, 3000);
  };

  return triggerAlert;
};

// AlertText 컴포넌트 (Zustand 버전)
export function AlertText() {
  const state = useAlertBox((state) => state.state);
  const text = useAlertBox((state) => state.text);

  return (
    <div
      className={`bg-slate-50 border-2 border-solid font-bold fixed top-24 left-1/2 transform -translate-x-1/2 transition-all ease-in-out duration-1000 px-5 py-2.5 whitespace-nowrap
      ${state ? "translate-y-2 z-50 opacity-100" : "-z-10 opacity-0"}
       border-slate-300 text-slate-700 shadow-md rounded-lg`}>
      {text}
    </div>
  );
}
