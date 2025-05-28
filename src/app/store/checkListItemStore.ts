import { create } from "zustand";
import { CheckListDetail } from "../type/type";

interface TodoItemStoreState {
  checkListData: CheckListDetail;
  updateCheckListItem: (updatedItem: CheckListDetail) => void;
}

export const useTodoItemStore = create<TodoItemStoreState>((set) => ({
  checkListData: { id: 0, name: "", memo: "", imageUrl: "", isCompleted: false },
  updateCheckListItem: (updatedItem) =>
    set(() => ({
      checkListData: { ...updatedItem },
    })),
}));
