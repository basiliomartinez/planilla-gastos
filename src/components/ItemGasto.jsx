import { Button, Badge } from "react-bootstrap";

// Formatea fechas:
// - "YYYY-MM-DD" -> "DD/MM"
// - "DD/MM/YYYY" -> "DD/MM"
// - fechas ISO de Mongo "2026-04-03T00:00:00.000Z" -> "DD/MM"
const formatearDiaMes = (fecha) => {
  if (!fecha) return "";

  // Si viene como string ISO, me quedo solo con la parte YYYY-MM-DD
  if (fecha.includes("T")) {
    fecha = fecha.split("T")[0];
  }

  if (fecha.includes("/")) {
    const [dia, mes] = fecha.split("/");
    return `${dia}/${mes}`;
  }

  if (fecha.includes("-")) {
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}`;
  }

  return fecha;
};

const ItemGasto = ({ gasto, tipo, onAccion }) => {
  const esPagado = tipo === "pagado";
  const hoyISO = new Date().toISOString().slice(0, 10);

  // Si vencimiento viene como ISO de Mongo, corto antes de comparar
  const vencimientoISO = gasto.vencimiento?.includes("T")
    ? gasto.vencimiento.split("T")[0]
    : gasto.vencimiento;

  const esVencido = !esPagado && vencimientoISO < hoyISO;

  return (
    <div className="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2">
      <div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <h3
            className={`h6 mb-0 ${
              esPagado ? "text-success" : esVencido ? "text-danger" : ""
            }`}
            style={esPagado ? { textDecoration: "line-through" } : {}}
          >
            {esPagado ? "✅ " : ""}
            {gasto.nombre}
          </h3>

          {!esPagado && esVencido && <Badge bg="danger">Vencido</Badge>}
        </div>

        {!esPagado ? (
          <small className={esVencido ? "text-danger" : "text-muted"}>
            Vence: {formatearDiaMes(gasto.vencimiento)}
          </small>
        ) : (
          <small className="text-success">
            Gasto pagado el {formatearDiaMes(gasto.fechaPago)}
          </small>
        )}
      </div>

      <div className="d-flex align-items-center gap-2">
        <strong
          className={
            esPagado ? "text-success" : esVencido ? "text-danger" : ""
          }
        >
          ${gasto.monto.toLocaleString("es-AR")}
        </strong>

        {!esPagado ? (
          <Button variant="danger" onClick={() => onAccion(gasto._id)}>
            A pagar
          </Button>
        ) : (
          <>
            <Badge bg="success">Pagado</Badge>
            <Button
              variant="outline-danger"
              onClick={() => onAccion(gasto._id)}
            >
              Eliminar
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ItemGasto;