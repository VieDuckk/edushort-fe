import { create } from "zustand";

export type TAuthModalState = {
  isOpen: boolean;
  mode: "login" | "register";
  openModal: (mode?: "login" | "register") => void;
  closeModal: () => void;
  setMode: (mode: "login" | "register") => void;
};

export const useAuthModal = create<TAuthModalState>((set) => ({
  isOpen: false,
  mode: "login",
  openModal: (mode = "login") => set({ isOpen: true, mode }),
  closeModal: () => set({ isOpen: false }),
  setMode: (mode) => set({ mode }),
}));
