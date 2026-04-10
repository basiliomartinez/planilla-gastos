import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

import NavbarPrincipal from "./components/layout/NavbarPrincipal";
import FooterPrincipal from "./components/layout/FooterPrincipal";

import PanelMensual from "./components/gastosMensuales/PanelMensual";
import PanelFuturos from "./components/gastosFuturos/PanelFuturos";
import PanelCuotas from "./components/gastosCuotas/PanelCuotas";

import {
  listarGastosApi,
  crearGastoApi,
  pagarGastoApi,
  eliminarGastoApi,
} from "./helpers/queries";

import "./styles/gastos.css";

const App = () => {
  const [seccionActiva, setSeccionActiva] = useState("mensuales");
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

  const renderSeccion = () => {
    switch (seccionActiva) {
      case "mensuales":
        return (
          <PanelMensual
            gastosPendientes={gastosPendientes}
            gastosPagados={gastosPagados}
            agregarGasto={agregarGasto}
            marcarComoPagado={marcarComoPagado}
            eliminarPagado={eliminarPagado}
            totalPendiente={totalPendiente}
          />
        );

      case "futuros":
        return <PanelFuturos />;

      case "cuotas":
        return <PanelCuotas />;

      default:
        return null;
    }
  };

  return (
    <div className="app-layout gastos-bg">
      <NavbarPrincipal
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
      />

      <main className="main-content">
        <Container className="py-2 py-md-4">
          <div className="calc-shell">
            <div className="calc-card">{renderSeccion()}</div>
          </div>
        </Container>
      </main>

      <FooterPrincipal />
    </div>
  );
};

export default App;