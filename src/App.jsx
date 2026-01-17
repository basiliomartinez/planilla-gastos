import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import FormularioGasto from "./components/FormularioGasto";
import ListaGastos from "./components/ListaGastos";
import "./styles/gastos.css";

const App = () => {
  // ===== LocalStorage =====
  const pendientesLS =
    JSON.parse(localStorage.getItem("GastosPendientes")) || [];
  const pagadosLS =
    JSON.parse(localStorage.getItem("GastosPagados")) || [];

  const [gastosPendientes, setGastosPendientes] = useState(pendientesLS);
  const [gastosPagados, setGastosPagados] = useState(pagadosLS);

  useEffect(() => {
    localStorage.setItem(
      "GastosPendientes",
      JSON.stringify(gastosPendientes)
    );
  }, [gastosPendientes]);

  useEffect(() => {
    localStorage.setItem("GastosPagados", JSON.stringify(gastosPagados));
  }, [gastosPagados]);

  // ===== TOTAL PENDIENTE (único dato clave) =====
  const totalPendiente = gastosPendientes.reduce(
    (acc, gasto) => acc + gasto.monto,
    0
  );

  // ===== AGREGAR GASTO (con validación duplicados) =====
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

  return (
    <div className="gastos-bg py-5">
      <Container>
        <div className="calc-shell">
          <div className="card calc-card">
            {/* ===== DISPLAY SUPERIOR (calculadora) ===== */}
            <div className="calc-display">
              <p className="calc-title">Planilla de Gastos</p>

              <p className="calc-amount">
                ${totalPendiente.toLocaleString("es-AR")}
              </p>

              <div className="calc-sub">
                {gastosPendientes.length} gasto(s) pendientes
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
