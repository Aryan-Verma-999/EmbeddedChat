import { create } from 'zustand';

interface SidebarStoreState {
  showSidebar: boolean;
  setShowSidebar: (showSidebar: boolean) => void;
}

const useSidebarStore = create<SidebarStoreState>((set) => ({
  showSidebar: false,
  setShowSidebar: (showSidebar) => set(() => ({ showSidebar })),
}));

export default useSidebarStore;
