import { create } from 'zustand';

interface MentionsStoreState {
  showMentions: boolean;
  setShowMentions: (showMentions: boolean) => void;
}

const useMentionsStore = create<MentionsStoreState>((set) => ({
  showMentions: false,
  setShowMentions: (showMentions) => set(() => ({ showMentions })),
}));

export default useMentionsStore;
