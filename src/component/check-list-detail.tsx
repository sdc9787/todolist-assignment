"use client";

import { useAlert } from "@/app/hook/useAlert";
import { useTodoItemStore } from "@/app/store/checkListItemStore";
import { useLoading } from "@/app/store/loadingStore";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef } from "react";
import Loading from "./loading";

export default function CheckListItemDetail() {
  const checkListItem = useTodoItemStore((state) => state.checkListData);
  const updateCheckListItem = useTodoItemStore((state) => state.updateCheckListItem);

  const alertBox = useAlert();

  const isLoading = useLoading((state) => state.isLoading);
  const setLoading = useLoading((state) => state.setLoading);

  const handleCheckListEdit = () => {
    setLoading(false);
    axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/items/${checkListItem.id}`, {
        name: checkListItem.name ? checkListItem.name : "",
        memo: checkListItem.memo ? checkListItem.memo : "",
        imageUrl: checkListItem.imageUrl ? checkListItem.imageUrl : "",
        isCompleted: !checkListItem.isCompleted,
      })
      .then(() => {
        // 성공적으로 업데이트된 후의 로직 (예: 알림, 상태 업데이트 등)
        updateCheckListItem({
          ...checkListItem,
          isCompleted: !checkListItem.isCompleted,
        });
        setLoading(true);
        alertBox("업데이트 되었습니다");
      })
      .catch((error) => {
        setLoading(true);
        alertBox("업데이트에 실패했습니다");
      });
  };

  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const newWidth = spanRef.current.offsetWidth + 2; // +2px 여유
      inputRef.current.style.width = `${newWidth}px`;
    }
  }, [checkListItem]);

  // checkListItem.name이 바뀌면 inputValue도 동기화
  useEffect(() => {
    updateCheckListItem({
      ...checkListItem,
      name: checkListItem.name || "",
    });
  }, [checkListItem.name]);

  //onclock으로 input focus
  const handleInputFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 로딩 중일때 Loading 컴포넌트 반환
  if (!isLoading) {
    return <Loading />;
  }

  return (
    <div onClick={handleInputFocus} className="col-span-2 w-full max-w-[1200px] flex lg:flex-row flex-col justify-start items-start gap-4">
      <div className={"w-full flex justify-center items-center gap-3 p-3 border-solid border-2 rounded-2xl " + (checkListItem.isCompleted ? "bg-violet-100" : "bg-white")}>
        {checkListItem.isCompleted ? (
          <Image className="cursor-pointer" onClick={handleCheckListEdit} src="/icon/checkbox_active.svg" width={32} height={32} alt="checked" />
        ) : (
          <Image className="cursor-pointer" onClick={handleCheckListEdit} src="/icon/checkbox_default.svg" width={32} height={32} alt="checked" />
        )}
        <div className="relative inline-block">
          {/* 실제 입력 input */}
          <input
            ref={inputRef}
            value={checkListItem.name}
            onChange={(e) =>
              updateCheckListItem({
                ...checkListItem,
                name: e.target.value,
              })
            }
            className="p-1 outline-none underline font-bold text-xl text-center"
            style={{ minWidth: "2ch" }}
          />
          {/* 숨겨진 텍스트 span: input과 동일한 스타일 유지해야 정확함 */}
          <span ref={spanRef} className="absolute top-0 left-0 invisible whitespace-pre p-1 font-bold underline text-xl">
            {checkListItem.name || " "}
          </span>
        </div>
      </div>
    </div>
  );
}
