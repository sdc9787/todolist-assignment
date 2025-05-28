import { create } from "zustand";

interface AlertBoxState {
  state: boolean;
  text: string;
  alertOn: (text: string) => void;
  alertOff: () => void;
}

export const useAlertBox = create<AlertBoxState>((set) => ({
  state: false,
  text: "",
  alertOn: (text: string) => set({ state: true, text }),
  alertOff: () => set({ state: false }),
}));
