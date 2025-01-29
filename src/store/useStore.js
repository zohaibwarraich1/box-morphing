import { create } from "zustand";

const useTalhaStore = create((set) => ({
  isLoading: true,
  setIsLoading: (state) => set({ isLoading: state }),
}));

export default useTalhaStore;
