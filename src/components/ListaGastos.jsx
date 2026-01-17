import { ListGroup, Alert } from "react-bootstrap";
import ItemGasto from "./ItemGasto";

const ListaGastos = ({ titulo, arrayGastos, tipo, onAccion }) => {
  const hoyISO = new Date().toISOString().slice(0, 10);

  const gastosOrdenados =
    tipo === "pendiente"
      ? [...arrayGastos].sort((a, b) => {
          const aVencido = a.vencimiento < hoyISO;
          const bVencido = b.vencimiento < hoyISO;

          // 1) Vencidos primero
          if (aVencido !== bVencido) return aVencido ? -1 : 1;

          // 2) Luego por fecha de vencimiento (más próximo primero)
          return a.vencimiento.localeCompare(b.vencimiento);
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
              key={gasto.id}
              gasto={gasto}
              tipo={tipo}
              onAccion={onAccion}
            />
          ))}
        </ListGroup>
      )}
    </section>
  );
};

export default ListaGastos;
