import { create } from 'zustand';

export const useUiStore = create((set) => ({
  landingCtaMode: 'register',
  setLandingCtaMode: (mode) => set({ landingCtaMode: mode }),
  isNavScrolled: false,
  setNavScrolled: (value) => set({ isNavScrolled: value }),
  successToastVisible: false,
  showSuccess: () => set({ successToastVisible: true }),
  hideSuccess: () => set({ successToastVisible: false }),
}));
