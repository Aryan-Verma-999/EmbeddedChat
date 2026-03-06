import { create } from 'zustand';

interface ThreadsMessageStoreState {
  showAllThreads: boolean;
  setShowAllThreads: (showAllThreads: boolean) => void;
}

const useThreadsMessageStore = create<ThreadsMessageStoreState>((set) => ({
  showAllThreads: false,
  setShowAllThreads: (showAllThreads) => set(() => ({ showAllThreads })),
}));

export default useThreadsMessageStore;
