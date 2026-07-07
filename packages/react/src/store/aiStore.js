import { create } from 'zustand';

const useAiStore = create((set) => ({
  isAiTyping: false,
  setIsAiTyping: (isAiTyping) => set(() => ({ isAiTyping })),

  threadSummary: '',
  showThreadSummary: false,
  setThreadSummary: (threadSummary) =>
    set(() => ({ threadSummary, showThreadSummary: true })),
  closeThreadSummary: () =>
    set(() => ({ showThreadSummary: false, threadSummary: '' })),

  generatedTheme: null,
  setGeneratedTheme: (generatedTheme) => set(() => ({ generatedTheme })),

  generatedDark: null,
  setGeneratedDark: (generatedDark) => set(() => ({ generatedDark })),

  clearGeneratedTheme: () =>
    set(() => ({ generatedTheme: null, generatedDark: null })),
}));

export default useAiStore;
