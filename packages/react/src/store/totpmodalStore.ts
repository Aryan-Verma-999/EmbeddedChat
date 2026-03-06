import { create } from 'zustand';

interface TotpModalStoreState {
  isTotpModalOpen: boolean;
  setIsTotpModalOpen: (isTotpModalOpen: boolean) => void;
}

const totpModalStore = create<TotpModalStoreState>((set) => ({
  isTotpModalOpen: false,
  setIsTotpModalOpen: (isTotpModalOpen) => set(() => ({ isTotpModalOpen })),
}));

export default totpModalStore;
