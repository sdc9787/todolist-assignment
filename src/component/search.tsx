"use client";

import axios from "axios";
import Image from "next/image";
import { useRef } from "react";
import { useTodoStore } from "@/app/store/checkListStore";
import { useAlert } from "@/app/hook/useAlert";
import { useLoading } from "@/app/store/loadingStore";
import Loading from "./loading";

export default function Search() {
  const inputRef = useRef<HTMLInputElement>(null); // 입력 필드 참조
  const checkListData = useTodoStore((state) => state.checkListData); // 체크리스트 데이터
  const addCheckListItem = useTodoStore((state) => state.addCheckListItem); // 체크리스트 아이템 추가 함수

  // alertBox 훅 사용
  const alertBox = useAlert();

  // 로딩 상태 관리
  const isLoading = useLoading((state) => state.isLoading);
  const setLoading = useLoading((state) => state.setLoading);

  //todo가 없을때
  const checkListEmpty = checkListData.filter((item) => item.isCompleted == false).length;

  const addItem = () => {
    setLoading(false);
    const value = inputRef.current?.value.trim();
    if (!value) return;
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/items`, { name: value })
      .then((response) => {
        if (inputRef.current) inputRef.current.value = "";
        // 서버에서 받은 데이터로 zustand에 추가
        addCheckListItem(response.data);
        setLoading(true);
        alertBox("할 일이 추가되었습니다");
      })
      .catch((error) => {
        setLoading(true);
        alertBox("할 일을 추가하지 못했습니다");
      });
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addItem();
    }
  };

  // 로딩 중일 때는 로딩 컴포넌트 표시
  if (!isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full flex justify-center items-center gap-5 mb-10">
      <input ref={inputRef} type="text" className="h-12 border-slate-900 border-solid border-2 rounded-3xl shadow-custom w-full  p-4" placeholder="할 일을 입력해주세요" onKeyDown={handleSearch} />
      {checkListEmpty === 0 ? (
        <button className={"h-12 xs:w-[168px] border-slate-900 border-solid border-2 rounded-3xl shadow-custom bg-violet-600 text-white px-5 flex justify-center items-center gap-2 ml-2"} onClick={addItem}>
          <Image src="/icon/plus_light.svg" alt="plus" width={16} height={16} />
          <span className="font-bold hidden xs:block text-nowrap">추가하기</span>
        </button>
      ) : (
        <button className="h-12 xs:w-[168px] border-slate-900 border-solid border-2 rounded-3xl shadow-custom bg-slate-200 px-5 flex justify-center items-center gap-2 ml-2" onClick={addItem}>
          <Image src="/icon/plus_dark.svg" alt="plus" width={16} height={16} />
          <span className="font-bold hidden xs:block text-nowrap">추가하기</span>
        </button>
      )}
    </div>
  );
}
