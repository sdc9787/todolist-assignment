"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  // 잘못된 경로로 접근했을 때 홈으로 리다이렉트
  useEffect(() => {
    router.replace("/");
  }, [router]);

  return null;
}
