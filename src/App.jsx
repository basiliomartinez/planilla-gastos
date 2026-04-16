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
  pasarGastoFuturoAMensualApi,
  listarCuotasApi,
  crearCuotaApi,
  pagarCuotaApi,
  eliminarCuotaApi,
} from "./helpers/queries";

import "./styles/gastos.css";

const App = () => {
  const [seccionActiva, setSeccionActiva] = useState("mensuales");

  const [gastosPendientes, setGastosPendientes] = useState([]);
  const [gastosPagados, setGastosPagados] = useState([]);
  const [gastosFuturos, setGastosFuturos] = useState([]);
  const [cuotas, setCuotas] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const mensuales = await listarGastosApi("mensual");
        const futuros = await listarGastosApi("futuro");
        const cuotasData = await listarCuotasApi();

        const pendientes = mensuales.filter((g) => g.estado === "pendiente");
        const pagados = mensuales.filter((g) => g.estado === "pagado");

        setGastosPendientes(pendientes);
        setGastosPagados(pagados);
        setGastosFuturos(futuros);
        setCuotas(cuotasData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    cargarDatos();
  }, []);

  // ===== TOTALES =====
  const totalPendiente = gastosPendientes.reduce(
    (acc, gasto) => acc + gasto.monto,
    0
  );

  // ===== GASTOS =====

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
      const resp = await crearGastoApi({
        ...nuevoGasto,
        tipo: "mensual",
      });

      if (resp.gasto) {
        setGastosPendientes([...gastosPendientes, resp.gasto]);
        return { ok: true };
      }

      return { ok: false, msg: "No se pudo crear el gasto." };
    } catch (error) {
      console.error(error);
      return { ok: false, msg: "Error al crear gasto" };
    }
  };

  const agregarGastoFuturo = async (nuevoGasto) => {
    const existe = gastosFuturos.some(
      (g) => g.nombre.toLowerCase() === nuevoGasto.nombre.toLowerCase()
    );

    if (existe) {
      return { ok: false, msg: "Ese gasto futuro ya existe." };
    }

    try {
      const resp = await crearGastoApi({
        ...nuevoGasto,
        tipo: "futuro",
      });

      if (resp.gasto) {
        setGastosFuturos([...gastosFuturos, resp.gasto]);
        return { ok: true };
      }

      return { ok: false, msg: "No se pudo crear gasto futuro." };
    } catch (error) {
      console.error(error);
      return { ok: false, msg: "Error al crear gasto futuro" };
    }
  };

  const marcarComoPagado = async (id) => {
    const gasto = gastosPendientes.find((g) => g._id === id);
    if (!gasto) return;

    const confirmar = window.confirm(`¿Pagaste "${gasto.nombre}"?`);
    if (!confirmar) return;

    const resp = await pagarGastoApi(id);

    if (!resp.gasto) return;

    setGastosPendientes(gastosPendientes.filter((g) => g._id !== id));
    setGastosPagados([resp.gasto, ...gastosPagados]);
  };

  const eliminarPagado = async (id) => {
    const confirmar = window.confirm("¿Eliminar gasto?");
    if (!confirmar) return;

    await eliminarGastoApi(id);
    setGastosPagados(gastosPagados.filter((g) => g._id !== id));
  };

  const pasarFuturoAMensual = async (id) => {
    const confirmar = window.confirm("¿Pasar a mensual?");
    if (!confirmar) return;

    const resp = await pasarGastoFuturoAMensualApi(id);

    if (!resp.gasto) return;

    setGastosFuturos(gastosFuturos.filter((g) => g._id !== id));
    setGastosPendientes([...gastosPendientes, resp.gasto]);
  };

  // ===== CUOTAS =====

  const agregarCuota = async (nuevaCuota) => {
    const resp = await crearCuotaApi(nuevaCuota);

    if (resp.cuota) {
      setCuotas([resp.cuota, ...cuotas]);
      return { ok: true };
    }

    return { ok: false, msg: "No se pudo crear cuota" };
  };

  const pagarCuota = async (id) => {
    const resp = await pagarCuotaApi(id);

    if (!resp.cuota) return;

    setCuotas(cuotas.map((c) => (c._id === id ? resp.cuota : c)));
  };

  const eliminarCuota = async (id) => {
    await eliminarCuotaApi(id);
    setCuotas(cuotas.filter((c) => c._id !== id));
  };

  // ===== RENDER =====

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
        return (
          <PanelFuturos
            gastosFuturos={gastosFuturos}
            agregarGastoFuturo={agregarGastoFuturo}
            pasarFuturoAMensual={pasarFuturoAMensual}
          />
        );

      case "cuotas":
        return (
          <PanelCuotas
            cuotas={cuotas}
            agregarCuota={agregarCuota}
            pagarCuota={pagarCuota}
            eliminarCuota={eliminarCuota}
          />
        );

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