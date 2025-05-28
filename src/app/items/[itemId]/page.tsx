"use client";
import { useAlert } from "@/app/hook/useAlert";
import { useTodoItemStore } from "@/app/store/checkListItemStore";
import { useLoading } from "@/app/store/loadingStore";
import CheckListItemDetail from "@/component/check-list-detail";
import Loading from "@/component/loading";
import axios from "axios";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ItemDetail() {
  const params = useParams();
  const router = useRouter();
  const itemId = typeof params.itemId === "string" ? params.itemId : Array.isArray(params.itemId) ? params.itemId[0] : undefined;
  const checkListItem = useTodoItemStore((state) => state.checkListData);
  const updateCheckListItem = useTodoItemStore((state) => state.updateCheckListItem);
  const alertBox = useAlert();

  // 메모와 이미지 상태
  const [memo, setMemo] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 로딩 상태
  const isLoading = useLoading((state) => state.isLoading);
  const setLoading = useLoading((state) => state.setLoading);

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  // 상세 정보 불러오기
  useEffect(() => {
    if (!itemId) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/items/${itemId}`)
      .then((response) => {
        updateCheckListItem(response.data);
        setMemo(response.data.memo || "");
        setImageUrl(response.data.imageUrl || null);
        setLoading(true);
      })
      .catch(() => {
        alertBox("목록을 불러오지 못했습니다");
        setLoading(true);
        router.push("/");
      });
  }, [itemId, updateCheckListItem, alertBox, router, setLoading]);

  // textarea 자동 높이 조절
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMemo(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // 이미지 업로드 핸들러
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 저장(수정완료) 버튼 클릭
  const handleSave = async () => {
    setLoading(false);
    try {
      let uploadedImageUrl = imageUrl;

      // 1. 이미지 파일이 새로 선택된 경우 파일 업로드 API 호출
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        // 이미지 업로드 API 호출
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/images/upload`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        uploadedImageUrl = res.data.url; // 업로드된 이미지 URL
      }

      // 2. name, memo, imageUrl, isCompleted PATCH API 호출
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/items/${itemId}`, {
        name: checkListItem.name, // 필요에 따라 입력값으로 변경
        memo: memo || "", // 메모가 없으면 빈 문자열로 설정
        imageUrl: uploadedImageUrl || checkListItem.imageUrl || "", // 이미지 URL이 없으면 기존 URL 사용
        isCompleted: checkListItem.isCompleted,
      });

      // 변경 성공 후 홈으로 리다이렉트
      alertBox("수정이 완료되었습니다");
      router.push("/");
    } catch (error) {
      console.error("Error updating item:", error);
      setLoading(true);
      alertBox("수정에 실패했습니다");
    }
  };

  //삭제 버튼 클릭
  function handleDelete() {
    setLoading(false);
    if (!itemId) return;
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/items/${itemId}`)
      .then(() => {
        // 삭제 후 홈으로 리다이렉트
        alertBox("삭제가 완료되었습니다");
        router.push("/");
      })
      .catch(() => {
        // 삭제 실패 시 에러 처리
        setLoading(true);
        alertBox("삭제에 실패했습니다");
      });
  }

  if (!isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-[1000px] grid grid-cols-[1.5fr_2fr] gap-4 p-4 overflow-hidden">
      <CheckListItemDetail />
      {/* 사진영역 */}
      <div className="col-span-2 lg:col-span-1 relative w-full h-[311px] bg-slate-100 flex justify-center items-center border-dashed border-slate-300 border-2 rounded-2xl">
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        <Image src={imageUrl || "/img/img.svg"} width={64} height={64} alt="imgUpload" className="object-contain cursor-pointer" onClick={handleImageClick} />
        <div className="absolute bottom-3 right-3 bg-slate-200 rounded-full p-5 cursor-pointer" onClick={handleImageClick}>
          <Image src="/icon/plus_dark.svg" width={24} height={24} alt="upLoadBtn" />
        </div>
      </div>
      {/* 메모 영역 */}
      <div onClick={() => textareaRef.current && textareaRef.current.focus()} className="col-span-2 lg:col-span-1 relative w-full h-[311px] rounded-2xl">
        <Image className="w-full h-[311px] object-cover" src="/img/memo.svg" width={288} height={311} alt="memo" />
        <span className="absolute top-6 left-1/2 -translate-x-1/2 text-amber-800 font-extrabold">Memo</span>
        <div className="absolute top-10 bottom-2 left-2 right-2 flex items-center justify-center">
          <textarea ref={textareaRef} rows={1} value={memo} onChange={handleInput} className="w-full resize-none overflow-scroll overflow-x-hidden max-h-50 p-2 text-center rounded" style={{ minHeight: "60px", maxHeight: "200px" }} />
        </div>
      </div>
      {/*수정완료, 삭제하기 버튼 */}
      <div className="flex justify-center lg:justify-end items-center gap-4 col-span-2">
        <button onClick={handleSave} className={"flex items-center gap-2 px-8 py-2 rounded-full shadow-custom border-solid border-2 border-black " + (checkListItem.isCompleted ? "bg-lime-300" : "bg-slate-200")}>
          <Image src="/icon/check.svg" width={16} height={16} alt="checkBtn" />
          <span className="font-bold text-nowrap">수정완료</span>
        </button>
        <button onClick={handleDelete} className="flex items-center gap-2 bg-rose-500 px-8 py-2 rounded-full shadow-custom border-solid border-2 border-black">
          <Image src="/icon/close.svg" width={16} height={16} alt="deleteBtn" />
          <span className="font-bold text-white text-nowrap">삭제하기</span>
        </button>
      </div>
    </div>
  );
}
