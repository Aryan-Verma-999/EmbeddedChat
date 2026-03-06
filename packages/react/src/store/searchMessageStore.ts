import { create } from 'zustand';

interface SearchMessageStoreState {
  showSearch: boolean;
  setShowSearch: (showSearch: boolean) => void;
}

const useSearchMessageStore = create<SearchMessageStoreState>((set) => ({
  showSearch: false,
  setShowSearch: (showSearch) => set(() => ({ showSearch })),
}));

export default useSearchMessageStore;
