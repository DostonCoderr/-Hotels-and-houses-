'use client';

import { create } from 'zustand';

interface ToastStore {
  message: string;
  visible: boolean;
  show: (msg: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  message: '',
  visible: false,
  show: (msg) => {
    set({ message: msg, visible: true });
    setTimeout(() => set({ visible: false }), 2600);
  },
}));

export const toast = (msg: string) => useToastStore.getState().show(msg);

export function SiteToaster() {
  const { message, visible } = useToastStore();
  return (
    <div id="tt" className={visible ? 'on' : ''}>
      {message}
    </div>
  );
}