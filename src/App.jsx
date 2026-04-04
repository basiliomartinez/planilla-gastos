import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import FormularioGasto from "./components/FormularioGasto";
import ListaGastos from "./components/ListaGastos";
import {
  listarGastosApi,
  crearGastoApi,
  pagarGastoApi,
  eliminarGastoApi,
} from "./helpers/queries";
import "./styles/gastos.css";

const App = () => {
  const [gastosPendientes, setGastosPendientes] = useState([]);
  const [gastosPagados, setGastosPagados] = useState([]);

  useEffect(() => {
    const cargarGastos = async () => {
      try {
        const data = await listarGastosApi();

        const pendientes = data.filter((g) => g.estado === "pendiente");
        const pagados = data.filter((g) => g.estado === "pagado");

        setGastosPendientes(pendientes);
        setGastosPagados(pagados);
      } catch (error) {
        console.error("Error al cargar los gastos:", error);
      }
    };

    cargarGastos();
  }, []);

  const totalPendiente = gastosPendientes.reduce(
    (acc, gasto) => acc + gasto.monto,
    0
  );

  const agregarGasto = async (nuevoGasto) => {
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

    try {
      const resp = await crearGastoApi(nuevoGasto);

      if (resp.gasto) {
        setGastosPendientes([...gastosPendientes, resp.gasto]);
        return { ok: true };
      }

      return {
        ok: false,
        msg: "No se pudo crear el gasto.",
      };
    } catch (error) {
      console.error("Error al crear el gasto:", error);
      return {
        ok: false,
        msg: "Ocurrió un error al crear el gasto.",
      };
    }
  };

  const marcarComoPagado = async (id) => {
    const gasto = gastosPendientes.find((g) => g._id === id);
    if (!gasto) return;

    const confirmar = window.confirm(
      `¿Confirmás que pagaste "${gasto.nombre}" por $${gasto.monto.toLocaleString(
        "es-AR"
      )}?`
    );
    if (!confirmar) return;

    try {
      const resp = await pagarGastoApi(id);

      if (!resp.gasto) return;

      setGastosPendientes(gastosPendientes.filter((g) => g._id !== id));
      setGastosPagados([resp.gasto, ...gastosPagados]);
    } catch (error) {
      console.error("Error al pagar el gasto:", error);
    }
  };

  const eliminarPagado = async (id) => {
    const gasto = gastosPagados.find((g) => g._id === id);
    if (!gasto) return;

    const confirmar = window.confirm(
      `¿Eliminar del historial el gasto "${gasto.nombre}"?`
    );
    if (!confirmar) return;

    try {
      const resp = await eliminarGastoApi(id);

      if (!resp.gasto) return;

      setGastosPagados(gastosPagados.filter((g) => g._id !== id));
    } catch (error) {
      console.error("Error al eliminar el gasto:", error);
    }
  };

  return (
    <div className="gastos-bg py-5">
      <Container>
        <div className="calc-shell">
          <div className="card calc-card">
            <div className="calc-display">
              <p className="calc-title">Planilla de Gastos</p>

              <p className="calc-amount">
                ${totalPendiente.toLocaleString("es-AR")}
              </p>

              <div className="calc-sub">
                {gastosPendientes.length} gasto(s) pendientes
              </div>
            </div>

            <div className="calc-body">
              <FormularioGasto agregarGasto={agregarGasto} />

              <h2 className="section-title">Pendientes</h2>
              <div className="list-soft">
                <ListaGastos
                  titulo={null}
                  arrayGastos={gastosPendientes}
                  tipo="pendiente"
                  onAccion={marcarComoPagado}
                />
              </div>

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
          </div>
        </div>
      </Container>
    </div>
  );
};

export default App;