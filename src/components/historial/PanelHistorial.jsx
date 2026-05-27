import { Alert, Badge, ListGroup } from "react-bootstrap";

const PanelHistorial = ({ gastosPagados }) => {
  const obtenerPeriodo = (gasto) => {
    if (gasto.periodo) return gasto.periodo;

    if (!gasto.fechaPago) return "Sin período";

    const fecha = gasto.fechaPago.includes("T")
      ? gasto.fechaPago.split("T")[0]
      : gasto.fechaPago;

    return fecha.slice(0, 7);
  };

  const formatearPeriodo = (periodo) => {
    if (periodo === "Sin período") return periodo;

    const nombrePeriodo = new Date(`${periodo}-02`).toLocaleDateString(
      "es-AR",
      {
        month: "long",
        year: "numeric",
      }
    );

    return nombrePeriodo.charAt(0).toUpperCase() + nombrePeriodo.slice(1);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    const fechaLimpia = fecha.includes("T") ? fecha.split("T")[0] : fecha;

    const [anio, mes, dia] = fechaLimpia.split("-");

    return `${dia}/${mes}/${anio}`;
  };

  const gastosPorPeriodo = gastosPagados.reduce((acc, gasto) => {
    const periodo = obtenerPeriodo(gasto);

    if (!acc[periodo]) {
      acc[periodo] = [];
    }

    acc[periodo].push(gasto);

    return acc;
  }, {});

  const periodosOrdenados = Object.keys(gastosPorPeriodo).sort().reverse();

  const totalGeneralPagado = gastosPagados.reduce(
    (acc, gasto) => acc + gasto.monto,
    0
  );

  return (
    <>
      <div className="calc-display calc-display-success">
        <p className="calc-title">Historial mensual</p>

        <p className="calc-amount text-success">
          ${totalGeneralPagado.toLocaleString("es-AR")}
        </p>

        <div className="calc-sub">
          {gastosPagados.length} gasto(s) pagados en total
        </div>
      </div>

      <div className="calc-body">
        <h2 className="section-title">Resumen por mes</h2>

        {periodosOrdenados.length === 0 ? (
          <Alert variant="info">Todavía no hay gastos pagados.</Alert>
        ) : (
          periodosOrdenados.map((periodo) => {
            const gastosDelPeriodo = gastosPorPeriodo[periodo];

            const totalPeriodo = gastosDelPeriodo.reduce(
              (acc, gasto) => acc + gasto.monto,
              0
            );

            return (
              <section key={periodo} className="historial-periodo">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                  <div>
                    <h3 className="h5 text-light mb-1">
                      {formatearPeriodo(periodo)}
                    </h3>

                    <small className="text-secondary">
                      {gastosDelPeriodo.length} gasto(s) pagados
                    </small>
                  </div>

                  <Badge bg="success" className="fs-6">
                    ${totalPeriodo.toLocaleString("es-AR")}
                  </Badge>
                </div>

                <ListGroup>
                  {gastosDelPeriodo.map((gasto) => (
                    <div
                      key={gasto._id}
                      className="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2"
                    >
                      <div>
                        <h4 className="h6 mb-1 text-light">{gasto.nombre}</h4>

                        <small className="text-success">
                          Pagado el {formatearFecha(gasto.fechaPago)}
                        </small>
                      </div>

                      <strong className="text-success">
                        ${gasto.monto.toLocaleString("es-AR")}
                      </strong>
                    </div>
                  ))}
                </ListGroup>
              </section>
            );
          })
        )}
      </div>
    </>
  );
};

export default PanelHistorial;