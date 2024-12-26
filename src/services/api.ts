export const baseUrl = process.env.baseUrl || "http://localhost:8080";
// export const baseUrl = "https://limpfybackend-ucdppc9d.b4a.run/";

export const login = async (email: string, password: string) => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.message || "Erro ao realizar login. Verifique suas credenciais."
    );
  }

  return res.json();
};

export const createJob = async (jobData: any, token: string) => {
  const res = await fetch(`${baseUrl}/jobs/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erro ao criar trabalho");
  }

  return res.json();
};

export const acceptJob = async (jobId: string, token: string) => {
  const res = await fetch(`${baseUrl}/jobs/${jobId}/accept`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Erro ao aceitar trabalho");
  }

  return res.json();
};

// Adicione outros endpoints conforme necessário
