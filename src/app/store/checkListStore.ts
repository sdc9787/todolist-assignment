import { create } from "zustand";
import { CheckItem, CheckListDetail } from "../type/type";

interface TodoStoreState {
  checkListData: CheckListDetail[];
  setCheckListData: (data: CheckListDetail[]) => void;
  addCheckListItem: (item: CheckItem) => void;
  updateCheckListItem: (updatedItem: CheckListDetail) => void;
}

export const useTodoStore = create<TodoStoreState>((set) => ({
  checkListData: [],
  setCheckListData: (data) => set({ checkListData: data }),
  addCheckListItem: (item) => set((state) => ({ checkListData: [item, ...state.checkListData] })),
  updateCheckListItem: (updatedItem) =>
    set((state) => ({
      checkListData: state.checkListData.map((item) => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item)),
    })),
}));
