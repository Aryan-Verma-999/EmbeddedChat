import { create } from 'zustand';

interface InviteStoreState {
  showInvite: boolean;
  toggleInviteView: () => void;
}

const useInviteStore = create<InviteStoreState>((set) => ({
  showInvite: false,
  toggleInviteView: () => set((state) => ({ showInvite: !state.showInvite })),
}));

export default useInviteStore;
