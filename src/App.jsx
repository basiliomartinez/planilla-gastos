import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import FormularioGasto from "./components/FormularioGasto";
import ListaGastos from "./components/ListaGastos";
import "./styles/gastos.css";

const App = () => {
  // ===== LocalStorage =====
  const pendientesLS =
    JSON.parse(localStorage.getItem("GastosPendientes")) || [];
  const pagadosLS = JSON.parse(localStorage.getItem("GastosPagados")) || [];

  const [gastosPendientes, setGastosPendientes] = useState(pendientesLS);
  const [gastosPagados, setGastosPagados] = useState(pagadosLS);

  useEffect(() => {
    localStorage.setItem("GastosPendientes", JSON.stringify(gastosPendientes));
  }, [gastosPendientes]);

  useEffect(() => {
    localStorage.setItem("GastosPagados", JSON.stringify(gastosPagados));
  }, [gastosPagados]);

  // ===== TOTAL PENDIENTE =====
  const totalPendiente = gastosPendientes.reduce(
    (acc, gasto) => acc + gasto.monto,
    0
  );

  // ===== AGREGAR GASTO (validación duplicados) =====
  const agregarGasto = (nuevoGasto) => {
    const existePendiente = gastosPendientes.some(
      (g) => g.nombre.toLowerCase() === nuevoGasto.nombre.toLowerCase()
    );

    const existePagado = gastosPagados.some(
      (g) => g.nombre.toLowerCase() === nuevoGasto.nombre.toLowerCase()
    );

    if (existePendiente || existePagado) {
      return {
        ok: false,
        msg: "Ese gasto ya existe (pendiente o pagado).",
      };
    }

    setGastosPendientes([...gastosPendientes, nuevoGasto]);
    return { ok: true };
  };

  // ===== MARCAR COMO PAGADO =====
  const marcarComoPagado = (id) => {
    const gasto = gastosPendientes.find((g) => g.id === id);
    if (!gasto) return;

    const confirmar = window.confirm(
      `¿Confirmás que pagaste "${gasto.nombre}" por $${gasto.monto.toLocaleString(
        "es-AR"
      )}?`
    );
    if (!confirmar) return;

    const fechaPago = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    setGastosPendientes(gastosPendientes.filter((g) => g.id !== id));
    setGastosPagados([{ ...gasto, fechaPago }, ...gastosPagados]);
  };

  // ===== ELIMINAR PAGADO (historial) =====
  const eliminarPagado = (id) => {
    const gasto = gastosPagados.find((g) => g.id === id);
    if (!gasto) return;

    const confirmar = window.confirm(
      `¿Eliminar del historial el gasto "${gasto.nombre}"?`
    );
    if (!confirmar) return;

    setGastosPagados(gastosPagados.filter((g) => g.id !== id));
  };

  // ===== EXPORTAR / IMPORTAR (pendientes + pagados) =====
  const exportarDatos = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      pendientes: gastosPendientes,
      pagados: gastosPagados,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    const fecha = new Date().toISOString().slice(0, 10);
    a.download = `planilla-gastos_${fecha}.json`;

    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const importarDatos = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);

        const pendientes = Array.isArray(parsed.pendientes)
          ? parsed.pendientes
          : null;
        const pagados = Array.isArray(parsed.pagados) ? parsed.pagados : null;

        if (!pendientes || !pagados) {
          alert("El archivo no tiene el formato correcto (pendientes/pagados).");
          return;
        }

        const confirmar = window.confirm(
          "Esto reemplazará tus datos actuales. ¿Querés continuar?"
        );
        if (!confirmar) return;

        setGastosPendientes(pendientes);
        setGastosPagados(pagados);

        alert("Datos importados correctamente ✅");
      } catch (error) {
        alert("No se pudo leer el archivo. Asegurate de subir un JSON válido.");
      } finally {
        // permite volver a importar el mismo archivo
        event.target.value = "";
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="gastos-bg py-5">
      <Container>
        <div className="calc-shell">
          <div className="card calc-card">
            {/* ===== DISPLAY SUPERIOR (calculadora) ===== */}
            <div className="calc-display">
              <p className="calc-title">Planilla de gastos</p>

              <p className="calc-amount">
                ${totalPendiente.toLocaleString("es-AR")}
              </p>

              <div className="calc-sub">
                {gastosPendientes.length} gasto(s) pendientes
              </div>

              {/* Exportar / Importar */}
              <div className="d-flex gap-2 mt-3 flex-wrap">
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={exportarDatos}
                >
                  Exportar
                </button>

                <label
                  className="btn btn-outline-light btn-sm mb-0"
                  style={{ cursor: "pointer" }}
                >
                  Importar
                  <input
                    type="file"
                    accept="application/json"
                    onChange={importarDatos}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>

            {/* ===== CUERPO ===== */}
            <div className="calc-body">
              <FormularioGasto agregarGasto={agregarGasto} />

              {/* Pendientes */}
              <h2 className="section-title">Pendientes</h2>
              <div className="list-soft">
                <ListaGastos
                  titulo={null}
                  arrayGastos={gastosPendientes}
                  tipo="pendiente"
                  onAccion={marcarComoPagado}
                />
              </div>

              {/* Pagados */}
              <div className="paid-block">
                <h2 className="section-title">Pagados</h2>
                <div className="list-soft">
                  <ListaGastos
                    titulo={null}
                    arrayGastos={gastosPagados}
                    tipo="pagado"
                    onAccion={eliminarPagado}
                  />
                </div>
              </div>
            </div>
            {/* FIN BODY */}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default App;
