"use client";

import { useEffect } from "react";
import { useTodoStore } from "@/app/store/checkListStore";
import axios from "axios";
import Image from "next/image";
import { CheckListDetail } from "@/app/type/type";
import { useRouter } from "next/navigation";
import { useLoading } from "@/app/store/loadingStore";
import Loading from "./loading";
import Search from "./search";
import { useAlert } from "@/app/hook/useAlert";

interface CheckListProps {
  isCompleted: boolean;
  name: string;
  id: number;
}

interface CheckListItemProps extends CheckListProps {
  onClick?: () => void;
}

export default function CheckList() {
  const checkListData = useTodoStore((state) => state.checkListData); // 전체 체크리스트 데이터
  const setCheckListData = useTodoStore((state) => state.setCheckListData); // 체크리스트 데이터 설정 함수
  const updateCheckListItem = useTodoStore((state) => state.updateCheckListItem); // 체크리스트 데이터 업데이트 함수

  // alertBox 훅 사용
  const alertBox = useAlert();

  // 로딩 상태 관리
  const isLoading = useLoading((state) => state.isLoading);
  const setLoading = useLoading((state) => state.setLoading);

  // 데이터 최초 로드
  useEffect(() => {
    setLoading(false);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/items`)
      .then((response) => {
        setCheckListData(response.data);
        setLoading(true);
      })
      .catch(() => {
        alertBox("리스트를 불러오지 못했습니다");
        setLoading(true);
      });
  }, []);

  const todoList = checkListData.filter((item) => !item.isCompleted);
  const doneList = checkListData.filter((item) => item.isCompleted);

  // 체크리스트 true/false 토글 핸들러
  const handleCheckListComplete = (checkListItem: CheckListProps) => {
    setLoading(false);
    //전체 목록에는 image, memo 정보가 없어 detail get요청 후 post 전송
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/items/${checkListItem.id}`)
      .then((response: { data: CheckListDetail }) => {
        //체크리스트 아이템을 true/false 업데이트
        axios
          .patch(`${process.env.NEXT_PUBLIC_API_URL}/items/${checkListItem.id}`, {
            name: response.data.name ? response.data.name : "",
            memo: response.data.memo ? response.data.memo : "",
            imageUrl: response.data.imageUrl ? response.data.imageUrl : "",
            isCompleted: !checkListItem.isCompleted,
          })
          .then(() => {
            // true/false 상태 변경
            updateCheckListItem({ ...checkListItem, isCompleted: !checkListItem.isCompleted });
            setLoading(true);
            alertBox(checkListItem.isCompleted ? "TODO로 이동했습니다" : "DONE로 이동했습니다");
          })
          .catch(() => {
            //todo 업데이트 실패 modal 띄우기
            setLoading(true);
            alertBox("업데이트에 실패했습니다");
          });
      })
      .catch(() => {
        //todo 아이템 상세 정보 가져오기 실패 modal 띄우기
        setLoading(true);
        alertBox("Detail 정보를 가져오지 못했습니다");
      });
  };

  // 로딩 중일때 Loading 컴포넌트 반환
  if (!isLoading) {
    return <Loading />;
  }

  // 체크리스트 컴포넌트 반환
  return (
    <>
      <Search />
      <div className="w-full max-w-[1200px] flex lg:flex-row flex-col justify-start items-start gap-4">
        <div className="w-full flex flex-col justify-start items-start gap-4">
          <Image src="/img/todo.svg" width={101} height={36} alt="todo" />
          {todoList.length === 0 ? <EmptyItem isTodo={false} /> : todoList.map((item) => <CheckListItem onClick={() => handleCheckListComplete(item)} key={item.id} isCompleted={item.isCompleted} name={item.name} id={item.id} />)}
        </div>
        <div className="w-full flex flex-col justify-start items-start gap-4">
          <Image src="/img/done.svg" width={101} height={36} alt="done" />
          {doneList.length === 0 ? <EmptyItem isTodo={true} /> : doneList.map((item) => <CheckListItem onClick={() => handleCheckListComplete(item)} key={item.id} isCompleted={item.isCompleted} name={item.name} id={item.id} />)}
        </div>
      </div>
    </>
  );
}

/* 체크리스트 아이템 컴포넌트 */
function CheckListItem(props: CheckListItemProps) {
  const router = useRouter();

  // 이벤트 버블링 방지
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (props.onClick) props.onClick();
  };

  // 전체 div 클릭 시 상세 페이지로 이동
  const handleItemClick = () => {
    router.push(`/items/${props.id}`);
  };

  return (
    <div className={"w-full flex justify-start items-center gap-3 p-2 border-solid border-2 rounded-full cursor-pointer " + (props.isCompleted ? "bg-violet-100" : "bg-white")} onClick={handleItemClick}>
      {props.isCompleted ? <Image onClick={handleCheckboxClick} src="/icon/checkbox_active.svg" width={32} height={32} alt="checked" /> : <Image onClick={handleCheckboxClick} src="/icon/checkbox_default.svg" width={32} height={32} alt="checked" />}
      <span className={props.isCompleted ? "line-through" : ""}>{props.name}</span>
    </div>
  );
}

// 빈 체크리스트 컴포넌트 타입
interface EmptyItemProps {
  isTodo: boolean;
}

// 빈 체크리스트 컴포넌트
function EmptyItem(props: EmptyItemProps) {
  const todoContent = ["아직 다 한 일이 없어요", "해야 할 일을 체크해보세요!"];
  const doneContent = ["할 일이 없어요", "TODO를 새롭게 추가해주세요!"];

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4 p-4">
      <Image src={props.isTodo ? "/img/empty_done_large.svg" : "/img/empty_todo_large.svg"} width={240} height={240} alt="empty todo" />
      <div className="flex flex-col justify-center items-center ">
        {props.isTodo
          ? todoContent.map((content, index) => (
              <span key={index} className="text-slate-400">
                {content}
              </span>
            ))
          : doneContent.map((content, index) => (
              <span key={index} className="text-slate-400">
                {content}
              </span>
            ))}
      </div>
    </div>
  );
}
