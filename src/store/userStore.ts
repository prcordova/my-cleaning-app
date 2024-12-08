// userStore.ts
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
  _id: string;
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  address: Address;
  workerDetails: Record<string, unknown>;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", // Nome do armazenamento no localStorage
    }
  )
);
