"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

import {
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import toast from "react-hot-toast";

import { baseUrl } from "@/services/api";

// Tabela de preços
const priceTable = {
  pricePerMeter: 100,
  pricePerKilogram: 10,
  typesOfGarbage: {
    "restos de obra": 150,
    "lixo doméstico": 30,
    "lixo eletrônico": 40,
  },
  workerMultiplier: 0.5,
  sizeMultiplier: 100,
  cleaningTypes: {
    "limpeza básica": 20,
    "limpeza pesada": 50,
  },
};

export default function CreateJob() {
  const [title, setTitle] = useState("Limpeza de calçada");
  const [description, setDescription] = useState("Remover lixos e entulhos.");
  const [workerQuantity, setWorkerQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [sizeGarbage, setSizeGarbage] = useState(1);
  const [typeOfGarbage, setTypeOfGarbage] = useState("restos de obra");
  const [cleaningType, setCleaningType] = useState("limpeza básica");
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [measurementUnit, setMeasurementUnit] = useState("m²");
  const [location, setLocation] = useState({
    cep: "",
    street: "",
    city: "",
    state: "",
    number: "",
    complement: "",
    reference: "",
  });

  const { token, user } = useAuthStore();

  // ---------------------------
  // Cálculo de preço automático
  // ---------------------------
  useEffect(() => {
    const calculatePrice = () => {
      let basePrice = 0;

      // Tipo de lixo
      basePrice += priceTable.typesOfGarbage[typeOfGarbage] || 0;

      // Tamanho (m² ou kg)
      basePrice += sizeGarbage * priceTable.sizeMultiplier;

      // Limpeza básica/pesada
      basePrice += priceTable.cleaningTypes[cleaningType] || 0;

      // Multiplica pela quantidade de trabalhadores
      basePrice *= workerQuantity * priceTable.workerMultiplier;

      setPrice(basePrice);
    };

    calculatePrice();
  }, [typeOfGarbage, workerQuantity, sizeGarbage, cleaningType]);

  // Ajusta worker se tamanho for grande
  useEffect(() => {
    if (sizeGarbage > 5 * workerQuantity) {
      setWorkerQuantity(Math.ceil(sizeGarbage / 5));
      toast.success(
        "A quantidade de trabalhadores foi ajustada para atender ao tamanho do lixo."
      );
    }
  }, [sizeGarbage, workerQuantity]);

  // Exemplo de função no front-end para criar a sessão de checkout
  const handleCheckout = async () => {
    try {
      // Validações antes de enviar
      if (
        !price ||
        !title ||
        !description ||
        !workerQuantity ||
        !sizeGarbage ||
        !typeOfGarbage ||
        !cleaningType ||
        !measurementUnit ||
        (!useDefaultAddress && !location.cep) // Verifique os campos de localização
      ) {
        toast.error("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      // Logando os dados que serão enviados
      console.log("Enviando dados para createCheckoutSession:", {
        amount: price,
        title,
        description,
        workerQuantity,
        price,
        sizeGarbage,
        typeOfGarbage,
        cleaningType,
        measurementUnit,
        location: useDefaultAddress ? user?.address : location,
        useDefaultAddress,
      });

      // Cria Checkout Session no back-end
      const resp = await fetch(`${baseUrl}/payments/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Envie todos os valores necessários
        body: JSON.stringify({
          amount: price,
          title,
          description,
          workerQuantity,
          price,
          sizeGarbage,
          typeOfGarbage,
          cleaningType,
          measurementUnit,
          location: useDefaultAddress ? user?.address : location,
          useDefaultAddress,
        }),
      });

      // Verificação da resposta
      if (!resp.ok) {
        const errorData = await resp.json();
        console.error("Erro na resposta do servidor:", errorData);
        throw new Error("Erro ao criar sessão de checkout no Stripe.");
      }

      const { url } = await resp.json();
      if (!url) {
        throw new Error("Checkout session não retornou URL.");
      }

      console.log("Redirecionando para a sessão de checkout:", url);

      // Redireciona para a página do Stripe
      window.location.href = url;
    } catch (err) {
      console.error("Erro ao iniciar Stripe Checkout:", err);
      toast.error(err.message || "Erro ao iniciar pagamento.");
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <Typography variant="h5" component="div" className="mb-8">
          Criar Pedido
        </Typography>
        <CardContent>
          <Grid container spacing={2}>
            {/* ---- Campos do Job ---- */}
            <Grid item xs={12}>
              <TextField
                label="Título"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Descrição"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantidade de Trabalhadores"
                type="number"
                fullWidth
                value={workerQuantity}
                onChange={(e) => setWorkerQuantity(Number(e.target.value))}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Unidade de Medida</InputLabel>
                <Select
                  value={measurementUnit}
                  onChange={(e) => setMeasurementUnit(e.target.value)}
                >
                  <MenuItem value="m²">Metros Quadrados (m²)</MenuItem>
                  <MenuItem value="kg">Quilogramas (kg)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label={`Tamanho do Lixo (${measurementUnit})`}
                type="number"
                fullWidth
                value={sizeGarbage}
                onChange={(e) => setSizeGarbage(Number(e.target.value))}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Lixo</InputLabel>
                <Select
                  value={typeOfGarbage}
                  onChange={(e) => setTypeOfGarbage(e.target.value)}
                >
                  <MenuItem value="restos de obra">Restos de Obra</MenuItem>
                  <MenuItem value="lixo doméstico">Lixo Doméstico</MenuItem>
                  <MenuItem value="lixo eletrônico">Lixo Eletrônico</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Limpeza</InputLabel>
                <Select
                  value={cleaningType}
                  onChange={(e) => setCleaningType(e.target.value)}
                >
                  <MenuItem value="limpeza básica">Limpeza Básica</MenuItem>
                  <MenuItem value="limpeza pesada">Limpeza Pesada</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Endereço */}
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Endereço</FormLabel>
                <RadioGroup
                  value={useDefaultAddress ? "default" : "custom"}
                  onChange={(e) =>
                    setUseDefaultAddress(e.target.value === "default")
                  }
                >
                  <FormControlLabel
                    value="default"
                    control={<Radio />}
                    label="Usar endereço padrão"
                  />
                  <FormControlLabel
                    value="custom"
                    control={<Radio />}
                    label="Usar outro endereço"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {!useDefaultAddress && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CEP"
                    fullWidth
                    value={location.cep}
                    onChange={(e) =>
                      setLocation({ ...location, cep: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Rua"
                    fullWidth
                    value={location.street}
                    onChange={(e) =>
                      setLocation({ ...location, street: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Cidade"
                    fullWidth
                    value={location.city}
                    onChange={(e) =>
                      setLocation({ ...location, city: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Estado"
                    fullWidth
                    value={location.state}
                    onChange={(e) =>
                      setLocation({ ...location, state: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Número"
                    fullWidth
                    value={location.number}
                    onChange={(e) =>
                      setLocation({ ...location, number: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Complemento"
                    fullWidth
                    value={location.complement}
                    onChange={(e) =>
                      setLocation({ ...location, complement: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Referência"
                    fullWidth
                    value={location.reference}
                    onChange={(e) =>
                      setLocation({ ...location, reference: e.target.value })
                    }
                  />
                </Grid>
              </>
            )}

            {/* Valor */}
            <Grid item xs={12}>
              <Typography variant="h6" component="div" className="mb-2">
                Preço Estimado: R$ {price.toFixed(2)}
              </Typography>
            </Grid>

            {/* Botão final: Cria Sessão de Checkout */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleCheckout}
              >
                Pagar e Criar Pedido
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
