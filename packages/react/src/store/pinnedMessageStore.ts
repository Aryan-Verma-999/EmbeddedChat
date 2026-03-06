import { create } from 'zustand';

interface PinnedMessageStoreState {
  showPinned: boolean;
  setShowPinned: (showPinned: boolean) => void;
}

const usePinnedMessageStore = create<PinnedMessageStoreState>((set) => ({
  showPinned: false,
  setShowPinned: (showPinned) => set(() => ({ showPinned })),
}));

export default usePinnedMessageStore;
