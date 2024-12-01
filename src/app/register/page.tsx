"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Grid,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { z } from "zod";
import { userSchema } from "./user-schema";
import toast from "react-hot-toast";

// Schema de validação com Zod

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cpf: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
    role: "client",
    address: {
      cep: "",
      street: "",
      city: "",
      state: "",
      number: "",
      complement: "",
      reference: "",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clientType, setClientType] = useState("client" as "client" | "worker");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Atualiza o estado do formulário primeiro
    if (
      [
        "cep",
        "street",
        "city",
        "state",
        "number",
        "complement",
        "reference",
      ].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "cep") {
      if (value.length === 8) {
        try {
          const response = await fetch(
            `https://viacep.com.br/ws/${value}/json/`
          );
          if (!response.ok) {
            throw new Error("CEP inválido ou não encontrado.");
          }
          const address = await response.json();
          if (address.erro) {
            throw new Error("CEP inválido ou não encontrado.");
          }
          setFormData((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              street: address.logradouro || "",
              city: address.localidade || "",
              state: address.uf || "",
              cep: value,
            },
          }));
          setErrors((prev) => ({ ...prev, cep: "" }));
        } catch (error) {
          setErrors((prev) => ({
            ...prev,
            cep: error.message,
          }));
        }
      } else {
        // Limpa os campos de endereço se o CEP não tiver 8 dígitos
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            cep: value,
            street: "",
            city: "",
            state: "",
          },
        }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    try {
      userSchema.shape[name as keyof typeof userSchema.shape].parse(value);
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        [name]: err.errors?.[0]?.message || "",
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});
    console.log("dados", formData);

    try {
      console.log("Validando dados...");
      const updatedFormData = {
        fullName: formData.fullName,
        email: formData.email,
        cpf: formData.cpf,
        phone: formData.phone,
        birthDate: formData.birthDate,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: clientType ? "client" : "worker",
        address: {
          cep: formData.address.cep,
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          number: formData.address.number,
          complement: formData.address.complement,
          reference: formData.address.reference,
        },
      };
      console.log("updatedFormData", updatedFormData);
      userSchema.parse(updatedFormData);

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

      toast.success("Registro bem-sucedido!");
      toast.success("Faça login para continuar.");
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
          className="mb-8"
          variant="h5"
          gutterBottom
          color="primary"
          textAlign="center"
        >
          Registrar Novo Usuário
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
              name="email"
              label="E-mail"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Tipo de usuário</FormLabel>
              <RadioGroup
                value={clientType ? "client" : "worker"}
                onChange={(e) => setClientType(e.target.value === "client")}
              >
                <FormControlLabel
                  value="client"
                  control={<Radio />}
                  label="Cliente"
                />
                <FormControlLabel
                  value="worker"
                  control={<Radio />}
                  label="Trabalhador"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="phone"
              label="Telefone"
              variant="outlined"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.phone}
              helperText={errors.phone}
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
              value={formData.address.cep}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!errors.cep}
              helperText={errors.cep}
              inputProps={{
                maxLength: 8,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }} // Garante que apenas números sejam aceitos
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              name="street"
              label="Rua"
              variant="outlined"
              value={formData.address.street}
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
              value={formData.address.city}
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
              value={formData.address.state}
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
              value={formData.address.number}
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
              value={formData.address.complement}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="reference"
              label="Referência"
              variant="outlined"
              value={formData.address.reference}
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
              type="submit"
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Registrar"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Register;
