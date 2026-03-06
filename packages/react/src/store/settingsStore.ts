import { create } from 'zustand';

interface SettingsStoreState {
  messageLimit: number;
  setMessageLimit: (messageLimit: number) => void;
}

const useSettingsStore = create<SettingsStoreState>((set) => ({
  messageLimit: 5000,
  setMessageLimit: (messageLimit) => set(() => ({ messageLimit })),
}));

export default useSettingsStore;
