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
  _id: string; // 🔥 Agora _id é obrigatório
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  address: Address;
  workerDetails: Record<string, any>;
  hasAcceptedTerms: boolean;
  termsAcceptedDate: string;
  faceVerified: boolean;
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
          token: data.access_token, // 🔥 O access_token agora é armazenado
          role: data.role, // 🔥 A role agora está padronizada
          isLoggedIn: true, // 🔥 isLoggedIn é sempre true após login
          user: {
            _id: data._id, // 🔥 Agora _id é usado consistentemente
            fullName: data.fullName,
            email: data.email,
            cpf: data.cpf,
            phone: data.phone,
            birthDate: data.birthDate,
            address: data.address,
            workerDetails: data.workerDetails,
            termsAcceptedDate: data.termsAcceptedDate,
            hasAcceptedTerms: data.hasAcceptedTerms,
            faceVerified: data.faceVerified,
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
