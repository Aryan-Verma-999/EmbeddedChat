import { create } from 'zustand';

interface FileStoreState {
  showAllFiles: boolean;
  setShowAllFiles: (showAllFiles: boolean) => void;
}

const useFileStore = create<FileStoreState>((set) => ({
  showAllFiles: false,
  setShowAllFiles: (showAllFiles) => set(() => ({ showAllFiles })),
}));

export default useFileStore;
