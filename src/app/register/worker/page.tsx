"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Grid,
} from "@mui/material";
import { z } from "zod";
import cep from "cep-promise";
import { validateCPF } from "@/utils/validateCPF";

// Schema de validação com Zod
const workerSchema = z
  .object({
    fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
    emailOrPhone: z
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
    cep: z.string().regex(/^\d{8}$/, "CEP deve conter exatamente 8 números."),
    street: z.string().nonempty("Rua é obrigatória."),
    city: z.string().nonempty("Cidade é obrigatória."),
    state: z.string().nonempty("Estado é obrigatório."),
    number: z.string().nonempty("Número é obrigatório."),
    complement: z.string().optional(),
    reference: z.string().optional(),
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

const RegisterWorker = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    emailOrPhone: "",
    cpf: "",
    birthDate: "",
    cep: "",
    street: "",
    city: "",
    state: "",
    number: "",
    complement: "",
    reference: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "cep" && value.length === 8) {
      try {
        const address = await cep(value);
        setFormData((prev) => ({
          ...prev,
          street: address.street || "",
          city: address.city || "",
          state: address.state || "",
        }));
        setErrors((prev) => ({ ...prev, cep: "" }));
      } catch {
        setErrors((prev) => ({
          ...prev,
          cep: "CEP inválido ou não encontrado.",
        }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    try {
      workerSchema.shape[name as keyof typeof workerSchema.shape].parse(value);
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        [name]: err.errors?.[0]?.message || "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setErrors({});
    console.log("Dados do formulário antes da validação:", formData);
    console.log("Erros de validação:", errors);

    try {
      // Atualize manualmente os valores no estado antes da validação
      const updatedFormData = {
        ...formData,
        street: formData.street || "", // Garante que "street" tenha valor
        city: formData.city || "", // Garante que "city" tenha valor
        state: formData.state || "", // Garante que "state" tenha valor
      };

      // Validação com Zod
      workerSchema.parse(updatedFormData);

      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao registrar.");
      }

      alert("Registro bem-sucedido!");
      window.location.href = "/login";
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error(err);
        alert(err.message || "Erro no servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          background: "#fff",
          padding: { xs: 2, sm: 4 },
          borderRadius: 2,
          boxShadow: 3,
          mt: 4,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          color="primary"
          textAlign="center"
        >
          Registrar Trabalhador
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="fullName"
              label="Nome Completo"
              variant="outlined"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="emailOrPhone"
              label="E-mail ou Telefone"
              variant="outlined"
              value={formData.emailOrPhone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.emailOrPhone}
              helperText={errors.emailOrPhone}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="cpf"
              label="CPF"
              variant="outlined"
              value={formData.cpf}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.cpf}
              helperText={errors.cpf}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="birthDate"
              type="date"
              label="Data de Nascimento"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              value={formData.birthDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.birthDate}
              helperText={errors.birthDate}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              name="cep"
              label="CEP"
              variant="outlined"
              value={formData.cep}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.cep}
              helperText={errors.cep}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              name="street"
              label="Rua"
              variant="outlined"
              value={formData.street}
              error={!!errors.street}
              helperText={errors.street}
              disabled // Mantém o campo como preenchido automaticamente
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              name="city"
              label="Cidade"
              variant="outlined"
              value={formData.city}
              error={!!errors.city}
              helperText={errors.city}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              name="state"
              label="Estado"
              variant="outlined"
              value={formData.state}
              error={!!errors.state}
              helperText={errors.state}
              disabled
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              name="number"
              label="Número"
              variant="outlined"
              value={formData.number}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.number}
              helperText={errors.number}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="complement"
              label="Complemento"
              variant="outlined"
              value={formData.complement}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="reference"
              label="Referência"
              variant="outlined"
              value={formData.reference}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="password"
              label="Senha"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="confirmPassword"
              label="Confirmar Senha"
              type="password"
              variant="outlined"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="button"
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={isLoading} // Desabilita o botão enquanto está carregando
            >
              {isLoading ? "Registrando..." : "Registrar"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default RegisterWorker;
