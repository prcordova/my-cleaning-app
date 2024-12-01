// authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Address {
  cep: string;
  street: string;
  city: string;
  state: string;
  number: string;
  complement: string;
  reference: string;
}

interface User {
  _id?: string;
  userId: string;
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  address: Address;
  workerDetails: Record<string, any>;
}

interface AuthState {
  token: string | null;
  role: string | null;
  isLoggedIn: boolean;
  user: User | null;
  setAuth: (data: any) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      isLoggedIn: false,
      user: null,
      setAuth: (data) =>
        set(() => ({
          token: data.access_token,
          role: data.role,
          isLoggedIn: true,
          user: {
            userId: data.userId,
            fullName: data.fullName,
            email: data.email,
            cpf: data.cpf,
            phone: data.phone,
            birthDate: data.birthDate,
            address: data.address,
            workerDetails: data.workerDetails,
          },
        })),
      clearAuth: () =>
        set(() => ({
          token: null,
          role: null,
          isLoggedIn: false,
          user: null,
        })),
    }),
    {
      name: "auth-storage", // Nome do armazenamento no localStorage
    }
  )
);
