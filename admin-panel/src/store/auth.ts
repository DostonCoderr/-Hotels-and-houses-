import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, setToken, removeToken, getToken } from '@/lib/api';
import type { Admin, LoginResponse } from '@/types';

interface AuthState {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loadAdmin: () => Promise<void>;
  clearError: () => void;
  setAdmin: (admin: Admin | null) => void;  // ⚠️ YANGI
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post<LoginResponse>('/auth/admin/login', {
            email,
            password,
          });
          setToken(data.token);
          set({
            admin: data.admin,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: any) {
          set({
            isLoading: false,
            error: err.response?.data?.error || 'Kirishda xatolik',
          });
          return false;
        }
      },

      logout: () => {
        removeToken();
        set({ admin: null, isAuthenticated: false, error: null });
      },

      loadAdmin: async () => {
        const token = getToken();
        if (!token) {
          set({ isAuthenticated: false, admin: null });
          return;
        }
        set({ isLoading: true });
        try {
          const { data } = await api.get<Admin>('/auth/admin/me');
          set({ admin: data, isAuthenticated: true, isLoading: false });
        } catch {
          removeToken();
          set({ admin: null, isAuthenticated: false, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),

      // ⚠️ YANGI: setAdmin
      setAdmin: (admin) => set({ admin }),
    }),
    {
      name: 'etagi-auth',
      partialize: (state) => ({
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);