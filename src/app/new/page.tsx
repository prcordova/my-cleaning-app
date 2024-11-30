"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
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

const priceTable = {
  typesOfGarbage: {
    "restos de obra": 50,
    "lixo doméstico": 30,
    "lixo eletrônico": 40,
  },
  workerMultiplier: 1.0, // 100% increase per worker
  sizeMultiplier: 100, // Price per square meter or per kilogram
  cleaningTypes: {
    "limpeza básica": 20,
    "limpeza pesada": 50,
  },
};

const CreateJob = () => {
  const [title, setTitle] = useState("Limpeza de calçada");
  const [description, setDescription] = useState(
    "Remover entulhos e restos de obra"
  );
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
  const router = useRouter();
  const { token } = useAuthStore();
  const { user } = useUserStore();

  useEffect(() => {
    const calculatePrice = () => {
      let basePrice = 0;

      if (typeOfGarbage) {
        basePrice += priceTable.typesOfGarbage[typeOfGarbage] || 0;
      }

      basePrice += sizeGarbage * priceTable.sizeMultiplier;

      if (cleaningType) {
        basePrice += priceTable.cleaningTypes[cleaningType] || 0;
      }

      basePrice *= workerQuantity * priceTable.workerMultiplier;

      setPrice(basePrice);
    };

    calculatePrice();
  }, [typeOfGarbage, workerQuantity, sizeGarbage, cleaningType]);

  useEffect(() => {
    if (sizeGarbage > 5 * workerQuantity) {
      setWorkerQuantity(Math.ceil(sizeGarbage / 5));
      toast.info(
        "A quantidade de trabalhadores foi ajustada para atender ao tamanho do lixo."
      );
    }
  }, [sizeGarbage]);

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3000/jobs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          workerQuantity,
          price,
          sizeGarbage,
          typeOfGarbage,
          cleaningType,
          measurementUnit,
          location: useDefaultAddress ? user.address : location,
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao criar trabalho.");
      }

      const data = await res.json();
      console.log("data", data);
      toast.success("Trabalho criado com sucesso!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar trabalho.");
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardContent>
          <Typography variant="h5" component="div" className="mb-4">
            Criar Pedido
          </Typography>
          <Grid container spacing={2}>
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
            <Grid item xs={12}>
              <Typography variant="h6" component="div" className="mb-2">
                Preço Estimado: R$ {price.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
              >
                Criar Pedido
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJob;
