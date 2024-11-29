import { create } from "zustand";

type AuthState = {
  token: string | null;
  role: string | null;
  isLoggedIn: boolean;
  setAuth: (token: string, role: string) => void;
  clearAuth: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  isLoggedIn: false,
  setAuth: (token, role) =>
    set(() => ({
      token,
      role,
      isLoggedIn: true,
    })),
  clearAuth: () =>
    set(() => ({
      token: null,
      role: null,
      isLoggedIn: false,
    })),
}));

export default useAuthStore;
