import { ListGroup, Alert } from "react-bootstrap";
import ItemGasto from "./ItemGasto";

const ListaGastos = ({ titulo, arrayGastos, tipo, onAccion, onEditar }) => {
  const hoyISO = new Date().toISOString().slice(0, 10);

  const normalizarFecha = (fecha) => {
    if (!fecha) return "";
    return fecha.includes("T") ? fecha.split("T")[0] : fecha;
  };

  const gastosOrdenados =
    tipo === "pendiente"
      ? [...arrayGastos].sort((a, b) => {
          const fechaA = normalizarFecha(a.vencimiento);
          const fechaB = normalizarFecha(b.vencimiento);

          const aVencido = fechaA < hoyISO;
          const bVencido = fechaB < hoyISO;

          if (aVencido !== bVencido) return aVencido ? -1 : 1;

          return fechaA.localeCompare(fechaB);
        })
      : arrayGastos;

  return (
    <section>
      {titulo && <h2 className="h4 mb-3">{titulo}</h2>}

      {gastosOrdenados.length === 0 ? (
        <Alert variant="info">No hay gastos en esta sección.</Alert>
      ) : (
        <ListGroup>
          {gastosOrdenados.map((gasto) => (
            <ItemGasto
              key={gasto._id}
              gasto={gasto}
              tipo={tipo}
              onAccion={onAccion}
              onEditar={onEditar}
            />
          ))}
        </ListGroup>
      )}
    </section>
  );
};

export default ListaGastos;