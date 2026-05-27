import { Alert, Badge, Button, ListGroup } from "react-bootstrap";

const normalizarFecha = (fecha) => {
  if (!fecha) return "";
  return fecha.includes("T") ? fecha.split("T")[0] : fecha;
};

const formatearFecha = (fecha) => {
  if (!fecha) return "";

  const fechaLimpia = normalizarFecha(fecha);
  const [anio, mes, dia] = fechaLimpia.split("-");

  return `${dia}/${mes}/${anio}`;
};

const calcularDiasRestantes = (fecha) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechaVencimiento = new Date(`${normalizarFecha(fecha)}T00:00:00`);
  fechaVencimiento.setHours(0, 0, 0, 0);

  const diferencia = fechaVencimiento - hoy;

  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
};

const PanelVencimientos = ({ gastos, marcarComoPagado }) => {
  const gastosPendientes = gastos
    .filter((gasto) => gasto.estado === "pendiente")
    .sort(
      (a, b) =>
        normalizarFecha(a.vencimiento).localeCompare(
          normalizarFecha(b.vencimiento)
        )
    );

  const gastosVencidos = gastosPendientes.filter(
    (gasto) => calcularDiasRestantes(gasto.vencimiento) < 0
  );

  const gastosHoy = gastosPendientes.filter(
    (gasto) => calcularDiasRestantes(gasto.vencimiento) === 0
  );

  const gastosProximos = gastosPendientes.filter((gasto) => {
    const dias = calcularDiasRestantes(gasto.vencimiento);
    return dias > 0 && dias <= 7;
  });

  const totalCritico = [...gastosVencidos, ...gastosHoy, ...gastosProximos].reduce(
    (acc, gasto) => acc + gasto.monto,
    0
  );

  const renderGasto = (gasto) => {
    const dias = calcularDiasRestantes(gasto.vencimiento);

    let badge = <Badge bg="info">Próximo</Badge>;

    if (dias < 0) {
      badge = <Badge bg="danger">Vencido hace {Math.abs(dias)} día(s)</Badge>;
    }

    if (dias === 0) {
      badge = <Badge bg="warning" text="dark">Vence hoy</Badge>;
    }

    if (dias > 0) {
      badge = <Badge bg="primary">Faltan {dias} día(s)</Badge>;
    }

    return (
      <div
        key={gasto._id}
        className="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2"
      >
        <div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <h3 className="h6 mb-0 text-light">{gasto.nombre}</h3>
            {badge}
          </div>

          <small className="fecha-vencimiento-normal">
            Vence: {formatearFecha(gasto.vencimiento)}
          </small>
        </div>

        <div className="d-flex align-items-center gap-2">
          <strong className={dias < 0 ? "text-danger" : "text-light"}>
            ${gasto.monto.toLocaleString("es-AR")}
          </strong>

          <Button variant="success" onClick={() => marcarComoPagado(gasto._id)}>
            Pagar
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="calc-display calc-display-futuros">
        <p className="calc-title">Próximos vencimientos</p>

        <p className="calc-amount calc-amount-futuros">
          ${totalCritico.toLocaleString("es-AR")}
        </p>

        <div className="calc-sub">
          {gastosVencidos.length + gastosHoy.length + gastosProximos.length} vencimiento(s) críticos
        </div>
      </div>

      <div className="calc-body">
        <section className="paid-block">
          <h2 className="section-title">Vencidos</h2>

          {gastosVencidos.length === 0 ? (
            <Alert variant="info">No hay gastos vencidos.</Alert>
          ) : (
            <ListGroup>{gastosVencidos.map(renderGasto)}</ListGroup>
          )}
        </section>

        <section className="paid-block">
          <h2 className="section-title">Vencen hoy</h2>

          {gastosHoy.length === 0 ? (
            <Alert variant="info">No hay gastos que venzan hoy.</Alert>
          ) : (
            <ListGroup>{gastosHoy.map(renderGasto)}</ListGroup>
          )}
        </section>

        <section className="paid-block">
          <h2 className="section-title">Próximos 7 días</h2>

          {gastosProximos.length === 0 ? (
            <Alert variant="info">No hay vencimientos próximos.</Alert>
          ) : (
            <ListGroup>{gastosProximos.map(renderGasto)}</ListGroup>
          )}
        </section>
      </div>
    </>
  );
};

export default PanelVencimientos;