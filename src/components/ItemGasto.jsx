import { Button, Badge } from "react-bootstrap";

// Formatea fechas:
// - "YYYY-MM-DD" -> "DD/MM"
// - "DD/MM/YYYY" -> "DD/MM"
const formatearDiaMes = (fecha) => {
  if (!fecha) return "";

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
  const esVencido = !esPagado && gasto.vencimiento < hoyISO;

  return (
    <div className="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2">
      <div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <h3
            className={`h6 mb-0 ${esPagado ? "text-success" : esVencido ? "text-danger" : ""}`}
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
        <strong className={esPagado ? "text-success" : esVencido ? "text-danger" : ""}>
          ${gasto.monto.toLocaleString("es-AR")}
        </strong>

        {!esPagado ? (
          <Button variant="danger" onClick={() => onAccion(gasto.id)}>
            A pagar
          </Button>
        ) : (
          <>
            <Badge bg="success">Pagado</Badge>
            <Button variant="outline-danger" onClick={() => onAccion(gasto.id)}>
              Eliminar
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ItemGasto;
