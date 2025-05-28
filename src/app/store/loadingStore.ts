import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void; // 추가
}

export const useLoading = create<LoadingState>((set) => ({
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
