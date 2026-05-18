import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Swal from "sweetalert2";

import Login from "./components/auth/Login";

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
  editarGastoApi,
  editarCuotaApi,
} from "./helpers/queries";

import "./styles/gastos.css";

const App = () => {
  const [seccionActiva, setSeccionActiva] = useState("mensuales");

  const [usuarioLogueado, setUsuarioLogueado] = useState(
    JSON.parse(sessionStorage.getItem("usuarioKey")) || {}
  );

  const [mensajeSesion, setMensajeSesion] = useState("");
  const [cargando, setCargando] = useState(false);

  const [gastosPendientes, setGastosPendientes] = useState([]);
  const [gastosPagados, setGastosPagados] = useState([]);
  const [gastosFuturos, setGastosFuturos] = useState([]);
  const [cuotas, setCuotas] = useState([]);

  useEffect(() => {
    if (!usuarioLogueado?.token) return;

    const cargarDatos = async () => {
      setCargando(true);

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
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [usuarioLogueado]);

  useEffect(() => {
    const manejarSesionExpirada = () => {
      setUsuarioLogueado({});
      setMensajeSesion("Tu sesión expiró. Volvé a iniciar sesión.");
      setGastosPendientes([]);
      setGastosPagados([]);
      setGastosFuturos([]);
      setCuotas([]);
      setCargando(false);
    };

    window.addEventListener("sesionExpirada", manejarSesionExpirada);

    return () => {
      window.removeEventListener("sesionExpirada", manejarSesionExpirada);
    };
  }, []);

  const cerrarSesion = () => {
    sessionStorage.removeItem("usuarioKey");
    setUsuarioLogueado({});
    setMensajeSesion("");
    setGastosPendientes([]);
    setGastosPagados([]);
    setGastosFuturos([]);
    setCuotas([]);
    setCargando(false);
  };

  if (!usuarioLogueado?.token) {
    return (
      <Login
        setUsuarioLogueado={setUsuarioLogueado}
        mensajeSesion={mensajeSesion}
        setMensajeSesion={setMensajeSesion}
      />
    );
  }

  if (cargando) {
    return (
      <div
        className="app-layout gastos-bg d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center text-light">
          <div className="spinner-border mb-3" role="status"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

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

  const editarGasto = async (id, gastoEditado) => {
    const resp = await editarGastoApi(id, gastoEditado);

    if (!resp.gasto) {
      return { ok: false, msg: "No se pudo editar el gasto" };
    }

    setGastosPendientes(
      gastosPendientes.map((g) => (g._id === id ? resp.gasto : g))
    );

    setGastosFuturos(
      gastosFuturos.map((g) => (g._id === id ? resp.gasto : g))
    );

    setGastosPagados(
      gastosPagados.map((g) => (g._id === id ? resp.gasto : g))
    );

    return { ok: true };
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

    const confirmar = await Swal.fire({
      title: "¿Confirmás el pago?",
      text: `Vas a marcar "${gasto.nombre}" como pagado.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, pagar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#198754",
      cancelButtonColor: "#6c757d",
    });

    if (!confirmar.isConfirmed) return;

    const resp = await pagarGastoApi(id);

    if (!resp.gasto) return;

    setGastosPendientes(gastosPendientes.filter((g) => g._id !== id));
    setGastosPagados([resp.gasto, ...gastosPagados]);

    Swal.fire("Listo", "El gasto fue marcado como pagado.", "success");
  };

  const eliminarPagado = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Eliminar gasto?",
      text: "Se eliminará del historial de pagados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    });

    if (!confirmar.isConfirmed) return;

    await eliminarGastoApi(id);
    setGastosPagados(gastosPagados.filter((g) => g._id !== id));

    Swal.fire("Eliminado", "El gasto fue eliminado correctamente.", "success");
  };

  const pasarFuturoAMensual = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Pasar a mensual?",
      text: "Este gasto futuro se moverá a gastos mensuales.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, pasar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#6c757d",
    });

    if (!confirmar.isConfirmed) return;

    const resp = await pasarGastoFuturoAMensualApi(id);

    if (!resp.gasto) return;

    setGastosFuturos(gastosFuturos.filter((g) => g._id !== id));
    setGastosPendientes([...gastosPendientes, resp.gasto]);

    Swal.fire("Listo", "El gasto fue pasado a mensuales.", "success");
  };

  const agregarCuota = async (nuevaCuota) => {
    const resp = await crearCuotaApi(nuevaCuota);

    if (resp.cuota) {
      setCuotas([resp.cuota, ...cuotas]);
      return { ok: true };
    }

    return { ok: false, msg: "No se pudo crear cuota" };
  };

  const editarCuota = async (id, cuotaEditada) => {
    const resp = await editarCuotaApi(id, cuotaEditada);

    if (!resp.cuota) {
      return { ok: false, msg: "No se pudo editar la cuota" };
    }

    setCuotas(cuotas.map((c) => (c._id === id ? resp.cuota : c)));

    return { ok: true };
  };

  const pagarCuota = async (id) => {
    const resp = await pagarCuotaApi(id);

    if (!resp.cuota) return;

    setCuotas(cuotas.map((c) => (c._id === id ? resp.cuota : c)));
  };

  const eliminarCuota = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Eliminar cuota?",
      text: "Se eliminará esta compra en cuotas.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    });

    if (!confirmar.isConfirmed) return;

    await eliminarCuotaApi(id);
    setCuotas(cuotas.filter((c) => c._id !== id));

    Swal.fire("Eliminada", "La cuota fue eliminada correctamente.", "success");
  };

  const renderSeccion = () => {
    switch (seccionActiva) {
      case "mensuales":
        return (
          <PanelMensual
            gastosPendientes={gastosPendientes}
            gastosPagados={gastosPagados}
            agregarGasto={agregarGasto}
            editarGasto={editarGasto}
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
            editarGasto={editarGasto}
            pasarFuturoAMensual={pasarFuturoAMensual}
          />
        );

      case "cuotas":
        return (
          <PanelCuotas
            cuotas={cuotas}
            agregarCuota={agregarCuota}
            editarCuota={editarCuota}
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
        usuarioLogueado={usuarioLogueado}
        cerrarSesion={cerrarSesion}
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