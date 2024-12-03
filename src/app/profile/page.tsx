"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Alert,
  AlertTitle,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const { token, user: authUser, setAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push("/dashboard");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/users/${authUser.userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Erro ao buscar informações do usuário.");
        }

        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        console.error(err.message || "Erro ao buscar informações do usuário.");
      }
    };

    fetchUser();
  }, [authUser, token, router]);

  useEffect(() => {
    setUser(authUser);
  }, [authUser]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    const formData = new FormData();
    if (avatar) {
      formData.append("avatar", avatar);
    }
    formData.append("address", JSON.stringify(user.address));

    try {
      const res = await fetch(
        `http://localhost:3000/users/${authUser.userId}/update-profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Erro ao atualizar o perfil.");
      }

      const updatedUser = await res.json();
      setAuth({ ...authUser, ...updatedUser });
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err: any) {
      console.error(err.message || "Erro ao atualizar o perfil.");
    }
  };

  if (!user) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="container mx-auto mt-8">
      {!user.hasAcceptedTerms && (
        <Alert severity="warning" className="mb-4" icon={<WarningIcon />}>
          <AlertTitle>Atenção</AlertTitle>
          Você precisa aceitar os termos de uso para poder utilizar os serviços.
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/terms")}
            className="mt-2"
          >
            Ir para os Termos de Uso
          </Button>
        </Alert>
      )}

      <Card className="mb-4">
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Avatar
                alt={user.fullName}
                src={
                  user.avatar
                    ? `/uploads/${user?.avatar}`
                    : user.workerDetails?.idPhoto
                }
                sx={{ width: 100, height: 100 }}
              />
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h5" component="div">
                {user?.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CPF: {user?.cpf}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Telefone: {user?.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Data de Nascimento:{" "}
                {new Date(user?.birthDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {user?.status}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Role: {user?.role}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent>
          <Typography variant="h6" component="div" className="mb-2">
            Endereço
          </Typography>
          {isEditing ? (
            <>
              <TextField
                label="CEP"
                value={user?.address?.cep}
                onChange={(e) =>
                  setUser({
                    ...user,
                    address: { ...user.address, cep: e.target.value },
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Rua"
                value={user.address?.street}
                onChange={(e) =>
                  setUser({
                    ...user,
                    address: { ...user.address, street: e.target.value },
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Número"
                value={user.address?.number}
                onChange={(e) =>
                  setUser({
                    ...user,
                    address: { ...user.address, number: e.target.value },
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Cidade"
                value={user.address?.city}
                onChange={(e) =>
                  setUser({
                    ...user,
                    address: { ...user.address, city: e.target.value },
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Estado"
                value={user.address?.state}
                onChange={(e) =>
                  setUser({
                    ...user,
                    address: { ...user.address, state: e.target.value },
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Complemento"
                value={user.address?.complement}
                onChange={(e) =>
                  setUser({
                    ...user,
                    address: { ...user.address, complement: e.target.value },
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Referência"
                value={user.address.reference}
                onChange={(e) =>
                  setUser({
                    ...user,
                    address: { ...user.address, reference: e.target.value },
                  })
                }
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveProfile}
                className="mt-2"
              >
                Salvar
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary">
                CEP: {user.address?.cep}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rua: {user.address?.street}, Número: {user.address?.number}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cidade: {user.address?.city}, Estado: {user.address?.state}
              </Typography>
              {user.address?.complement && (
                <Typography variant="body2" color="text.secondary">
                  Complemento: {user.address?.complement}
                </Typography>
              )}
              {user.address?.reference && (
                <Typography variant="body2" color="text.secondary">
                  Referência: {user.address?.reference}
                </Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditProfile}
                className="mt-2"
              >
                Editar Perfil
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {user.role === "worker" && (
        <Card className="mb-4">
          <CardContent>
            <Typography variant="h6" component="div" className="mb-2">
              Detalhes do Trabalhador
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Data de Nascimento:{" "}
              {new Date(user?.birthDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Empresa Associada: {user?.companyId || "Não informada"}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Card className="mb-4">
        <CardContent>
          <Typography variant="h6" component="div" className="mb-2">
            Estatísticas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {/* Adicione aqui as estatísticas relevantes */}
            Trabalhos concluídos: 10
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Avaliação média: 4.5
          </Typography>
          <Button
            className="mt-2"
            variant="contained"
            color="primary"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent>
          <Typography variant="h6" component="div" className="mb-2">
            Responsabilidade
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aceitou os Termos de Uso:{" "}
            {user.hasAcceptedTerms ? "Sim" : "Pendente"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Data de Aceitação:{" "}
            {user.termsAcceptedDate
              ? new Date(user.termsAcceptedDate).toLocaleDateString()
              : "N/A"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/terms")}
            className="mt-2"
          >
            Ver Termos de Uso
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
