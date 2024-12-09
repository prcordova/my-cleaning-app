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
          token: data.access_token, // 🔥 Armazena o access_token
          role: data.role, // 🔥 Armazena a role do usuário
          isLoggedIn: true, // 🔥 Marca o usuário como logado
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
      // 🔥 Aqui garantimos que o Zustand persiste o estado completo
      partialize: (state) => ({
        token: state.token,
        role: state.role,
        isLoggedIn: state.isLoggedIn,
        user: state.user, // 🔥 Agora o user será armazenado no localStorage
      }),
    }
  )
);
