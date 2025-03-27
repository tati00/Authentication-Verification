import axios from 'axios';

const DIDIT_API_URL = "https://verification.didit.me";
const CLIENT_ID = import.meta.env.VITE_DIDIT_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_DIDIT_CLIENT_SECRET;


// Obtiene el token de autenticación
const getAccessToken = async (): Promise<string> => {
  try {
    const response = await axios.post(
      "https://apx.didit.me/auth/v2/token/",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials"
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const token = response.data.access_token;
    localStorage.setItem("didit_access_token", token);
    return token;
  } catch (error) {
    console.error("Error al obtener el token de Didit.me", error);
    throw new Error("Error en autenticación con Didit.me");
  }
};

// Obtiene el token almacenado o lo renueva si no existe
const getStoredToken = async () => {
  let token = localStorage.getItem("didit_access_token");
  if (!token) {
    token = await getAccessToken();
  }
  return token;
};

// Inicia la verificación KYC
export const startKYC = async (email: string, name: string) => {
  try {
    const token = await getStoredToken();
    const response = await axios.post(
      `${DIDIT_API_URL}/v1/session/`,
      {
        user: { email, name },
        redirect_uri: "https://tuaplicacion.com/callback",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data; // Devuelve los datos de la sesión
  } catch (error) {
    throw new Error("Error al iniciar KYC");
  }
};

// Obtiene el estado de verificación KYC
export const getKYCStatus = async (sessionId: string) => {
  try {
    const token = await getStoredToken();
    const response = await axios.get(
      `${DIDIT_API_URL}/v1/session/${sessionId}/decision/`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener el estado de KYC");
  }
};
