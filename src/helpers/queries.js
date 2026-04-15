const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.mensaje || "Error en la petición");
  }

  return data;
};

export const listarGastosApi = async (tipo = "") => {
  try {
    const url = tipo ? `${API_URL}/gastos?tipo=${tipo}` : `${API_URL}/gastos`;
    const res = await fetch(url);
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
      headers: {
        "Content-Type": "application/json",
      },
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
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error al pasar gasto futuro a mensual:", error);
    return {};
  }
};