"use client";

import { useLoading } from "@/app/store/loadingStore";

export default function Loading() {
  // 로딩 상태를 zustand에서 가져옴
  const isLoading = useLoading((state) => state.isLoading);

  if (isLoading) {
    return null; // 로딩 상태가 아니면 아무것도 렌더링하지 않음
  }

  // 로딩 상태일 때 렌더링할 내용
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-50 w-full h-full flex justify-center items-center bg-black/20">
      <i className="xi-spinner-5 xi-spin xi-3x"></i>
    </div>
  );
}
