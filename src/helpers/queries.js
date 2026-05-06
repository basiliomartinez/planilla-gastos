const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const obtenerToken = () => {
  const usuario = JSON.parse(sessionStorage.getItem("usuarioKey"));
  return usuario?.token;
};

const headersConToken = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${obtenerToken()}`,
});

const handleResponse = async (res) => {
  const data = await res.json();

  if (res.status === 401) {
    sessionStorage.removeItem("usuarioKey");
    window.dispatchEvent(new Event("sesionExpirada"));
    throw new Error(data.mensaje || "Sesión expirada");
  }

  if (!res.ok) {
    throw new Error(data.mensaje || "Error en la petición");
  }

  return data;
};

// ===== AUTH =====

export const loginApi = async (usuario) => {
  try {
    const res = await fetch(`${API_URL}/usuarios/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return {};
  }
};
export const registroApi = async (usuario) => {
  try {
    const res = await fetch(`${API_URL}/usuarios/registro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        ok: false,
        mensaje: data.mensaje || "Error al registrar usuario",
      };
    }

    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return {
      ok: false,
      mensaje: "No se pudo conectar con el servidor",
    };
  }
};

// ===== GASTOS =====

export const listarGastosApi = async (tipo = "") => {
  try {
    const url = tipo ? `${API_URL}/gastos?tipo=${tipo}` : `${API_URL}/gastos`;

    const res = await fetch(url, {
      headers: headersConToken(),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error al listar gastos:", error);
    return [];
  }
};

export const crearGastoApi = async (gasto) => {
  try {
    const res = await fetch(`${API_URL}/gastos`, {
      method: "POST",
      headers: headersConToken(),
      body: JSON.stringify(gasto),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error al crear gasto:", error);
    return {};
  }
};

export const pagarGastoApi = async (id) => {
  try {
    const res = await fetch(`${API_URL}/gastos/${id}`, {
      method: "PUT",
      headers: headersConToken(),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error al pagar gasto:", error);
    return {};
  }
};

export const eliminarGastoApi = async (id) => {
  try {
    const res = await fetch(`${API_URL}/gastos/${id}`, {
      method: "DELETE",
      headers: headersConToken(),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error al eliminar gasto:", error);
    return {};
  }
};

export const pasarGastoFuturoAMensualApi = async (id) => {
  try {
    const res = await fetch(`${API_URL}/gastos/activar/${id}`, {
      method: "PUT",
      headers: headersConToken(),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error al pasar gasto futuro a mensual:", error);
    return {};
  }
};

// ===== CUOTAS =====

export const listarCuotasApi = async () => {
  try {
    const res = await fetch(`${API_URL}/cuotas`, {
      headers: headersConToken(),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error al listar cuotas:", error);
    return [];
  }
};

export const crearCuotaApi = async (cuota) => {
  try {
    const res = await fetch(`${API_URL}/cuotas`, {
      method: "POST",
      headers: headersConToken(),
      body: JSON.stringify(cuota),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error al crear cuota:", error);
    return {};
  }
};

export const pagarCuotaApi = async (id) => {
  try {
    const res = await fetch(`${API_URL}/cuotas/${id}`, {
      method: "PUT",
      headers: headersConToken(),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error al pagar cuota:", error);
    return {};
  }
};

export const eliminarCuotaApi = async (id) => {
  try {
    const res = await fetch(`${API_URL}/cuotas/${id}`, {
      method: "DELETE",
      headers: headersConToken(),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error al eliminar cuota:", error);
    return {};
  }
};