import { useState } from "react";
import { Form, Alert, ListGroup } from "react-bootstrap";

const PanelHistorial = ({ gastosPagados }) => {
  const [mesSeleccionado, setMesSeleccionado] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const gastosFiltrados = gastosPagados.filter((gasto) => {
    if (!gasto.fechaPago) return false;

    const fecha = gasto.fechaPago.includes("T")
      ? gasto.fechaPago.split("T")[0]
      : gasto.fechaPago;

    return fecha.startsWith(mesSeleccionado);
  });

  const totalPagadoMes = gastosFiltrados.reduce(
    (acc, gasto) => acc + gasto.monto,
    0
  );

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    const fechaLimpia = fecha.includes("T")
      ? fecha.split("T")[0]
      : fecha;

    const [anio, mes, dia] = fechaLimpia.split("-");

    return `${dia}/${mes}/${anio}`;
  };

  return (
    <>
      <div className="calc-display calc-display-success">
        <p className="calc-title">Historial mensual</p>

        <p className="calc-amount text-success">
          ${totalPagadoMes.toLocaleString("es-AR")}
        </p>

        <div className="calc-sub">
          {gastosFiltrados.length} gasto(s) pagados
        </div>
      </div>

      <div className="calc-body">
        <section>
          <h2 className="section-title">Filtrar por mes</h2>

          <Form.Control
            type="month"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
          />
        </section>

        <div className="paid-block">
          <h2 className="section-title">Gastos pagados</h2>

          {gastosFiltrados.length === 0 ? (
            <Alert variant="info">
              No hay gastos pagados en este mes.
            </Alert>
          ) : (
            <ListGroup>
              {gastosFiltrados.map((gasto) => (
                <div
                  key={gasto._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h3 className="h6 mb-1 text-light">
                      {gasto.nombre}
                    </h3>

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
          )}
        </div>
      </div>
    </>
  );
};

export default PanelHistorial;