const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

// helper para manejar respuestas
const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.mensaje || "Error en la petición");
  }

  return data;
};

// GET
export const listarGastosApi = async () => {
  try {
    const res = await fetch(`${API_URL}/gastos`);
    return await handleResponse(res);
  } catch (error) {
    console.error("Error al listar gastos:", error);
    return [];
  }
};

// POST
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

// PUT (pagar)
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

// DELETE
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