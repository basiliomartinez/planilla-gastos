import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Swal from "sweetalert2";

import Login from "./components/auth/Login";
import NavbarPrincipal from "./components/layout/NavbarPrincipal";
import FooterPrincipal from "./components/layout/FooterPrincipal";
import PanelMensual from "./components/gastosMensuales/PanelMensual";
import PanelFuturos from "./components/gastosFuturos/PanelFuturos";
import PanelCuotas from "./components/gastosCuotas/PanelCuotas";
import ResumenCards from "./components/dashboard/ResumenCards";
import PanelHistorial from "./components/historial/PanelHistorial";
import PanelVencimientos from "./components/vencimientos/PanelVencimientos";
import PanelDashboard from "./components/dashboard/PanelDashboard";
import { ArrowRepeat } from "react-bootstrap-icons";

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

  const [periodoActivo, setPeriodoActivo] = useState(
    new Date().toISOString().slice(0, 7),
  );

  const [usuarioLogueado, setUsuarioLogueado] = useState(
    JSON.parse(sessionStorage.getItem("usuarioKey")) || {},
  );

  const [mensajeSesion, setMensajeSesion] = useState("");
  const [cargando, setCargando] = useState(false);

  const [gastosPendientes, setGastosPendientes] = useState([]);
  const [gastosPagados, setGastosPagados] = useState([]);
  const [gastosFuturos, setGastosFuturos] = useState([]);

  const [todosLosGastosMensuales, setTodosLosGastosMensuales] = useState([]);

  const [cuotas, setCuotas] = useState([]);

  const [alertaVencidosMostrada, setAlertaVencidosMostrada] = useState(false);

  const [actualizando, setActualizando] = useState(false);

  // ==========================================
  // CARGA DE DATOS
  // ==========================================
const cargarDatos = async () => {
  if (!usuarioLogueado?.token) return;

  setCargando(true);

  try {
    const mensuales = await listarGastosApi("mensual", periodoActivo);

    const todosMensuales = await listarGastosApi("mensual");

    const futuros = await listarGastosApi("futuro");

    const cuotasData = await listarCuotasApi();

    const pendientes = mensuales.filter(
      (gasto) => gasto.estado === "pendiente",
    );

    const pagados = mensuales.filter(
      (gasto) => gasto.estado === "pagado",
    );

    setGastosPendientes(pendientes);
    setGastosPagados(pagados);
    setTodosLosGastosMensuales(todosMensuales);
    setGastosFuturos(futuros);
    setCuotas(cuotasData);
  } catch (error) {
    console.error("Error al cargar datos:", error);
  } finally {
    setCargando(false);
  }
};

const actualizarInformacion = async () => {
  setActualizando(true);

  await cargarDatos();

  setTimeout(() => {
    setActualizando(false);
  }, 800);
};


useEffect(() => {
  cargarDatos();
}, [usuarioLogueado, periodoActivo]);

  // ==========================================
  // ALERTA GLOBAL DE VENCIMIENTOS
  // ==========================================

  useEffect(() => {
    if (
      cargando ||
      alertaVencidosMostrada ||
      !usuarioLogueado?.token
    ) {
      return;
    }

    const hoyISO = new Date().toISOString().slice(0, 10);

    const pendientesGlobales = todosLosGastosMensuales.filter(
      (gasto) => gasto.estado === "pendiente",
    );

    const gastosVencidosGlobales = pendientesGlobales.filter((gasto) => {
      const vencimiento = gasto.vencimiento?.includes("T")
        ? gasto.vencimiento.split("T")[0]
        : gasto.vencimiento;

      return vencimiento && vencimiento < hoyISO;
    });

    const gastosVencenHoyGlobales = pendientesGlobales.filter((gasto) => {
      const vencimiento = gasto.vencimiento?.includes("T")
        ? gasto.vencimiento.split("T")[0]
        : gasto.vencimiento;

      return vencimiento === hoyISO;
    });

    if (
      gastosVencidosGlobales.length === 0 &&
      gastosVencenHoyGlobales.length === 0
    ) {
      return;
    }

    const totalVencido = gastosVencidosGlobales.reduce(
      (acc, gasto) => acc + gasto.monto,
      0,
    );

    const totalHoy = gastosVencenHoyGlobales.reduce(
      (acc, gasto) => acc + gasto.monto,
      0,
    );

    setAlertaVencidosMostrada(true);

    Swal.fire({
      title: "⚠️ Atención con tus vencimientos",

      html: `
        <div style="text-align:left">

          ${
            gastosVencidosGlobales.length > 0
              ? `
                <p>
                  Tenés
                  <b>${gastosVencidosGlobales.length}</b>
                  gasto(s) vencidos por
                  <b>$${totalVencido.toLocaleString("es-AR")}</b>.
                </p>
              `
              : ""
          }

          ${
            gastosVencenHoyGlobales.length > 0
              ? `
                <p>
                  Tenés
                  <b>${gastosVencenHoyGlobales.length}</b>
                  gasto(s) que vencen hoy por
                  <b>$${totalHoy.toLocaleString("es-AR")}</b>.
                </p>
              `
              : ""
          }

          <p style="margin-bottom:0">
            Se incluyen gastos pendientes de períodos anteriores.
          </p>

        </div>
      `,

      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Revisar vencimientos",
      cancelButtonText: "Cerrar",

      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#6c757d",
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        setSeccionActiva("vencimientos");
      }
    });
  }, [
    cargando,
    alertaVencidosMostrada,
    usuarioLogueado,
    todosLosGastosMensuales,
  ]);

  // ==========================================
  // SESIÓN EXPIRADA
  // ==========================================

  useEffect(() => {
    const manejarSesionExpirada = () => {
      setUsuarioLogueado({});

      setMensajeSesion(
        "Tu sesión expiró. Volvé a iniciar sesión.",
      );

      setGastosPendientes([]);
      setGastosPagados([]);
      setGastosFuturos([]);
      setTodosLosGastosMensuales([]);
      setCuotas([]);

      setCargando(false);
      setAlertaVencidosMostrada(false);
    };

    window.addEventListener(
      "sesionExpirada",
      manejarSesionExpirada,
    );

    return () => {
      window.removeEventListener(
        "sesionExpirada",
        manejarSesionExpirada,
      );
    };
  }, []);

  // ==========================================
  // CERRAR SESIÓN
  // ==========================================

  const cerrarSesion = () => {
    sessionStorage.removeItem("usuarioKey");

    setUsuarioLogueado({});
    setMensajeSesion("");

    setGastosPendientes([]);
    setGastosPagados([]);
    setGastosFuturos([]);
    setTodosLosGastosMensuales([]);
    setCuotas([]);

    setCargando(false);

    setPeriodoActivo(
      new Date().toISOString().slice(0, 7),
    );

    setAlertaVencidosMostrada(false);
  };

  // ==========================================
  // LOGIN
  // ==========================================

  if (!usuarioLogueado?.token) {
    return (
      <Login
        setUsuarioLogueado={setUsuarioLogueado}
        mensajeSesion={mensajeSesion}
        setMensajeSesion={setMensajeSesion}
      />
    );
  }

  // ==========================================
  // CARGANDO
  // ==========================================

  if (cargando) {
    return (
      <div
        className="app-layout gastos-bg d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center text-light">
          <div
            className="spinner-border mb-3"
            role="status"
          ></div>

          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // TOTALES DEL PERÍODO ACTIVO
  // ==========================================

  const totalPendiente = gastosPendientes.reduce(
    (acc, gasto) => acc + gasto.monto,
    0,
  );

  const totalFuturos = gastosFuturos.reduce(
    (acc, gasto) => acc + gasto.monto,
    0,
  );

  const totalPagados = gastosPagados.reduce(
    (acc, gasto) => acc + gasto.monto,
    0,
  );

  const deudaCuotas = cuotas.reduce(
    (acc, cuota) => acc + cuota.deudaPendiente,
    0,
  );

  // ==========================================
  // VENCIMIENTOS GLOBALES
  // ==========================================

  const hoyISO = new Date().toISOString().slice(0, 10);

  const pendientesGlobales = todosLosGastosMensuales.filter(
    (gasto) => gasto.estado === "pendiente",
  );

  const gastosVencidos = pendientesGlobales.filter((gasto) => {
    const vencimiento = gasto.vencimiento?.includes("T")
      ? gasto.vencimiento.split("T")[0]
      : gasto.vencimiento;

    return vencimiento && vencimiento < hoyISO;
  });

  const gastosVencenHoy = pendientesGlobales.filter((gasto) => {
    const vencimiento = gasto.vencimiento?.includes("T")
      ? gasto.vencimiento.split("T")[0]
      : gasto.vencimiento;

    return vencimiento === hoyISO;
  });

  // ==========================================
  // AGREGAR GASTO MENSUAL
  // ==========================================

  const agregarGasto = async (nuevoGasto) => {
    const existePendiente = gastosPendientes.some(
      (gasto) =>
        gasto.nombre.toLowerCase() ===
        nuevoGasto.nombre.toLowerCase(),
    );

    const existePagado = gastosPagados.some(
      (gasto) =>
        gasto.nombre.toLowerCase() ===
        nuevoGasto.nombre.toLowerCase(),
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
        periodo: periodoActivo,
      });

      if (resp.gasto) {
        setGastosPendientes((gastos) => [
          ...gastos,
          resp.gasto,
        ]);

        setTodosLosGastosMensuales((gastos) => [
          ...gastos,
          resp.gasto,
        ]);

        return { ok: true };
      }

      return {
        ok: false,
        msg: "No se pudo crear el gasto.",
      };
    } catch (error) {
      console.error(error);

      return {
        ok: false,
        msg: "Error al crear gasto",
      };
    }
  };

  // ==========================================
  // EDITAR GASTO
  // ==========================================

  const editarGasto = async (id, gastoEditado) => {
    const resp = await editarGastoApi(
      id,
      gastoEditado,
    );

    if (!resp.gasto) {
      return {
        ok: false,
        msg: "No se pudo editar el gasto",
      };
    }

    setGastosPendientes((gastos) =>
      gastos.map((gasto) =>
        gasto._id === id ? resp.gasto : gasto,
      ),
    );

    setGastosFuturos((gastos) =>
      gastos.map((gasto) =>
        gasto._id === id ? resp.gasto : gasto,
      ),
    );

    setGastosPagados((gastos) =>
      gastos.map((gasto) =>
        gasto._id === id ? resp.gasto : gasto,
      ),
    );

    setTodosLosGastosMensuales((gastos) =>
      gastos.map((gasto) =>
        gasto._id === id ? resp.gasto : gasto,
      ),
    );

    return { ok: true };
  };

  // ==========================================
  // AGREGAR GASTO FUTURO
  // ==========================================

  const agregarGastoFuturo = async (nuevoGasto) => {
    const existe = gastosFuturos.some(
      (gasto) =>
        gasto.nombre.toLowerCase() ===
        nuevoGasto.nombre.toLowerCase(),
    );

    if (existe) {
      return {
        ok: false,
        msg: "Ese gasto futuro ya existe.",
      };
    }

    try {
      const resp = await crearGastoApi({
        ...nuevoGasto,
        tipo: "futuro",
      });

      if (resp.gasto) {
        setGastosFuturos((gastos) => [
          ...gastos,
          resp.gasto,
        ]);

        return { ok: true };
      }

      return {
        ok: false,
        msg: "No se pudo crear gasto futuro.",
      };
    } catch (error) {
      console.error(error);

      return {
        ok: false,
        msg: "Error al crear gasto futuro",
      };
    }
  };

  // ==========================================
  // MARCAR GASTO COMO PAGADO
  // ==========================================

  const marcarComoPagado = async (id) => {
    // Puede ser un gasto del período activo
    // o de un período anterior.
    const gasto =
      gastosPendientes.find(
        (gasto) => gasto._id === id,
      ) ||
      todosLosGastosMensuales.find(
        (gasto) =>
          gasto._id === id &&
          gasto.estado === "pendiente",
      );

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

    // Actualizamos la lista global.
    setTodosLosGastosMensuales((gastos) =>
      gastos.map((gastoActual) =>
        gastoActual._id === id
          ? resp.gasto
          : gastoActual,
      ),
    );

    // Si el gasto pertenece al período que estamos viendo,
    // también actualizamos las listas visibles del mes.
    const estaEnPeriodoActivo = gastosPendientes.some(
      (gastoActual) => gastoActual._id === id,
    );

    if (estaEnPeriodoActivo) {
      setGastosPendientes((gastos) =>
        gastos.filter(
          (gastoActual) =>
            gastoActual._id !== id,
        ),
      );

      setGastosPagados((gastos) => [
        resp.gasto,
        ...gastos,
      ]);
    }

    Swal.fire({
      title: "🎉 ¡Un gasto menos!",

      text: `"${gasto.nombre}" ya quedó pagado. Buen avance.`,

      icon: "success",

      confirmButtonText: "Genial",
      confirmButtonColor: "#198754",

      timer: 2500,
      timerProgressBar: true,
    });
  };

  // ==========================================
  // ELIMINAR GASTO PAGADO
  // ==========================================

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

    setGastosPagados((gastos) =>
      gastos.filter(
        (gasto) => gasto._id !== id,
      ),
    );

    setTodosLosGastosMensuales((gastos) =>
      gastos.filter(
        (gasto) => gasto._id !== id,
      ),
    );

    Swal.fire(
      "Eliminado",
      "El gasto fue eliminado correctamente.",
      "success",
    );
  };

  // ==========================================
  // PASAR FUTURO A MENSUAL
  // ==========================================

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

    const resp =
      await pasarGastoFuturoAMensualApi(id);

    if (!resp.gasto) return;

    setGastosFuturos((gastos) =>
      gastos.filter(
        (gasto) => gasto._id !== id,
      ),
    );

    setGastosPendientes((gastos) => [
      ...gastos,
      resp.gasto,
    ]);

    setTodosLosGastosMensuales((gastos) => [
      ...gastos,
      resp.gasto,
    ]);

    Swal.fire(
      "Listo",
      "El gasto fue pasado a mensuales.",
      "success",
    );
  };

  // ==========================================
  // MOVER MENSUAL A FUTURO
  // ==========================================

  const moverMensualAFuturo = async (id) => {
    const confirmar = await Swal.fire({
      title: "¿Mover a futuros?",

      text: "Este gasto saldrá de mensuales y pasará a gastos futuros.",

      icon: "question",

      showCancelButton: true,

      confirmButtonText: "Sí, mover",
      cancelButtonText: "Cancelar",

      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#6c757d",
    });

    if (!confirmar.isConfirmed) return;

    const resp = await editarGastoApi(id, {
      tipo: "futuro",
      periodo: null,
    });

    if (!resp.gasto) return;

    setGastosPendientes((gastos) =>
      gastos.filter(
        (gasto) => gasto._id !== id,
      ),
    );

    setTodosLosGastosMensuales((gastos) =>
      gastos.filter(
        (gasto) => gasto._id !== id,
      ),
    );

    setGastosFuturos((gastos) => [
      resp.gasto,
      ...gastos,
    ]);

    Swal.fire(
      "Listo",
      "El gasto fue movido a futuros.",
      "success",
    );
  };

  // ==========================================
  // CUOTAS
  // ==========================================

  const agregarCuota = async (nuevaCuota) => {
    const resp = await crearCuotaApi(nuevaCuota);

    if (resp.cuota) {
      setCuotas((cuotasActuales) => [
        resp.cuota,
        ...cuotasActuales,
      ]);

      return { ok: true };
    }

    return {
      ok: false,
      msg: "No se pudo crear cuota",
    };
  };

  const editarCuota = async (
    id,
    cuotaEditada,
  ) => {
    const resp = await editarCuotaApi(
      id,
      cuotaEditada,
    );

    if (!resp.cuota) {
      return {
        ok: false,
        msg: "No se pudo editar la cuota",
      };
    }

    setCuotas((cuotasActuales) =>
      cuotasActuales.map((cuota) =>
        cuota._id === id
          ? resp.cuota
          : cuota,
      ),
    );

    return { ok: true };
  };

  const pagarCuota = async (id) => {
    const cuotaActual = cuotas.find(
      (cuota) => cuota._id === id,
    );

    const resp = await pagarCuotaApi(id);

    if (!resp.cuota) return;

    setCuotas((cuotasActuales) =>
      cuotasActuales.map((cuota) =>
        cuota._id === id
          ? resp.cuota
          : cuota,
      ),
    );

    if (resp.cuota.estado === "finalizada") {
      Swal.fire({
        title: "🏆 ¡Compra terminada!",

        text: `Terminaste de pagar "${resp.cuota.articulo}". Gran esfuerzo.`,

        icon: "success",

        confirmButtonText: "Excelente",
        confirmButtonColor: "#198754",

        timer: 3500,
        timerProgressBar: true,
      });

      return;
    }

    Swal.fire({
      title: "💪 Cuota pagada",

      text: cuotaActual
        ? `Pagaste una cuota de "${cuotaActual.articulo}". Ya falta menos.`
        : "Cuota registrada correctamente. Ya falta menos.",

      icon: "success",

      confirmButtonText: "Bien",
      confirmButtonColor: "#0d6efd",

      timer: 2500,
      timerProgressBar: true,
    });
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

    setCuotas((cuotasActuales) =>
      cuotasActuales.filter(
        (cuota) => cuota._id !== id,
      ),
    );

    Swal.fire(
      "Eliminada",
      "La cuota fue eliminada correctamente.",
      "success",
    );
  };

  // ==========================================
  // RENDER DE SECCIONES
  // ==========================================

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
            periodoActivo={periodoActivo}
            setPeriodoActivo={setPeriodoActivo}
            moverMensualAFuturo={moverMensualAFuturo}
            usuario={usuarioLogueado}
          />
        );

      case "futuros":
        return (
          <PanelFuturos
            gastosFuturos={gastosFuturos}
            agregarGastoFuturo={
              agregarGastoFuturo
            }
            editarGasto={editarGasto}
            pasarFuturoAMensual={
              pasarFuturoAMensual
            }
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

      case "historial":
        return (
          <PanelHistorial
            gastosPagados={gastosPagados}
          />
        );

      case "vencimientos":
        return (
          <PanelVencimientos
            gastos={todosLosGastosMensuales}
            marcarComoPagado={marcarComoPagado}
          />
        );

      case "dashboard":
        return (
          <PanelDashboard
            totalPendiente={totalPendiente}
            totalPagados={totalPagados}
            totalFuturos={totalFuturos}
            deudaCuotas={deudaCuotas}
            periodoActivo={periodoActivo}
            setPeriodoActivo={setPeriodoActivo}
            setSeccionActiva={setSeccionActiva}
            usuario={usuarioLogueado}
          />
        );

      default:
        return null;
    }
  };

  // ==========================================
  // APP
  // ==========================================

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
            <ResumenCards
              totalPendiente={totalPendiente}
              totalFuturos={totalFuturos}
              deudaCuotas={deudaCuotas}
              totalPagados={totalPagados}
              setSeccionActiva={setSeccionActiva}
              periodoActivo={periodoActivo}
              cantidadVencidos={
                gastosVencidos.length
              }
              cantidadVencenHoy={
                gastosVencenHoy.length
              }
            />

            <div className="calc-card">
              {renderSeccion()}
            </div>
          </div>
        </Container>
      </main>
<button
  className="btn-actualizar"
  onClick={actualizarInformacion}
  disabled={actualizando}
>
  <ArrowRepeat
    size={24}
    className={actualizando ? "spin" : ""}
  />
</button>


      <FooterPrincipal />
    </div>
  );
};

export default App;