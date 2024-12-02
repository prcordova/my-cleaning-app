"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, Typography, Checkbox, Button } from "@mui/material";

const Terms = () => {
  const [accepted, setAccepted] = useState(false);
  const { token, user, setAuth } = useAuthStore();
  const router = useRouter();

  const handleAcceptTerms = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/users/${user.userId}/accept-terms`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Erro ao aceitar os termos de uso.");
      }

      setAuth({ ...user, hasAcceptedTerms: true });
      router.push("/profile");
    } catch (err: any) {
      console.error(err.message || "Erro ao aceitar os termos de uso.");
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardContent>
          <Typography variant="h5" component="div" className="mb-4">
            Termos de Uso
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mb-4">
            Bem-vindo ao nosso aplicativo! Por favor, leia atentamente os termos
            de uso abaixo antes de utilizar nossos serviços.
            <br />
            <br />
            <strong>1. Aceitação dos Termos</strong>
            <br />
            Ao utilizar nosso aplicativo, você concorda em cumprir e estar
            vinculado aos termos e condições descritos neste documento.
            <br />
            <br />
            <strong>2. Uso do Aplicativo</strong>
            <br />
            Você concorda em usar o aplicativo apenas para fins legais e de
            acordo com todas as leis e regulamentos aplicáveis.
            <br />
            <br />
            <strong>3. Responsabilidades do Usuário</strong>
            <br />
            Você é responsável por manter a confidencialidade de suas
            informações de login e por todas as atividades que ocorram sob sua
            conta.
            <br />
            <br />
            <strong>4. Privacidade</strong>
            <br />
            Respeitamos sua privacidade e estamos comprometidos em proteger suas
            informações pessoais. Consulte nossa Política de Privacidade para
            obter mais informações.
            <br />
            <br />
            <strong>5. Modificações nos Termos</strong>
            <br />
            Reservamo-nos o direito de modificar estes termos a qualquer
            momento. Quaisquer alterações serão publicadas nesta página e
            entrarão em vigor imediatamente.
            <br />
            <br />
            <strong>6. Contato</strong>
            <br />
            Se você tiver alguma dúvida sobre estes termos, entre em contato
            conosco através do nosso suporte.
          </Typography>
          <div className="mb-4">
            <Checkbox
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <Typography variant="body2" color="text.secondary" component="span">
              Li e aceito os termos de uso
            </Typography>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAcceptTerms}
            disabled={!accepted}
          >
            Aceitar Termos de Uso
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Terms;
