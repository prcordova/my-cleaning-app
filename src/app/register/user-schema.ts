import { z } from "zod";
import { validateCPF } from "@/utils/validateCPF";

export const userSchema = z
  .object({
    fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
    email: z
      .string()
      .nonempty("E-mail ou telefone é obrigatório.")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^\d{10,11}$/,
        "Forneça um e-mail válido ou telefone no formato correto."
      ),
    cpf: z
      .string()
      .regex(/^\d{11}$/, "CPF deve conter apenas números.")
      .refine((cpf) => validateCPF(cpf), "CPF inválido."),
    birthDate: z.string().refine((date) => {
      const age = new Date().getFullYear() - new Date(date).getFullYear();
      return age >= 18;
    }, "Você precisa ter pelo menos 18 anos."),
    phone: z.string().nonempty("Telefone é obrigatório."),
    address: z.object({
      cep: z
        .string()
        .length(8, "CEP deve conter exatamente 8 números.")
        .regex(/^\d+$/, "CEP deve conter apenas números."),

      street: z.string().nonempty("Rua é obrigatória."),
      city: z.string().nonempty("Cidade é obrigatória."),
      state: z.string().nonempty("Estado é obrigatório."),
      number: z.string().nonempty("Número é obrigatório."),
      complement: z.string().optional(),
      reference: z.string().optional(),
    }),
    password: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres.")
      .max(32, "Senha deve ter no máximo 32 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });
