import { Button, Badge } from "react-bootstrap";

const formatearDiaMes = (fecha) => {
  if (!fecha) return "";

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

const ItemGasto = ({ gasto, tipo, onAccion, onEditar, periodoActivo }) => {
  const esPagado = tipo === "pagado";
  const hoyISO = new Date().toISOString().slice(0, 10);

  const vencimientoISO = gasto.vencimiento?.includes("T")
    ? gasto.vencimiento.split("T")[0]
    : gasto.vencimiento;

  const esVencido = !esPagado && vencimientoISO < hoyISO;

  const periodoVencimiento = vencimientoISO?.slice(0, 7);

  const esFueraDePeriodo =
    !esPagado && periodoActivo && periodoVencimiento !== periodoActivo;

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

          {esFueraDePeriodo && (
            <Badge bg="warning" text="dark">
              Fuera de período
            </Badge>
          )}
        </div>

        {!esPagado ? (
          <>
            <small
              className={esVencido ? "text-danger" : "fecha-vencimiento-normal"}
            >
              Vence: {formatearDiaMes(gasto.vencimiento)}
            </small>

            {esFueraDePeriodo && (
              <small className="d-block text-warning">
                ⚠ Este gasto no corresponde al mes seleccionado.
              </small>
            )}
          </>
        ) : (
          <small className="text-success">
            Gasto pagado el {formatearDiaMes(gasto.fechaPago)}
          </small>
        )}
      </div>

      <div className="d-flex align-items-center gap-2">
        <strong
          className={esPagado ? "text-success" : esVencido ? "text-danger" : ""}
        >
          ${gasto.monto.toLocaleString("es-AR")}
        </strong>

        {!esPagado ? (
          <>
            <Button variant="outline-warning" onClick={() => onEditar(gasto)}>
              Editar
            </Button>

            <Button variant="danger" onClick={() => onAccion(gasto._id)}>
              A pagar
            </Button>
          </>
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
