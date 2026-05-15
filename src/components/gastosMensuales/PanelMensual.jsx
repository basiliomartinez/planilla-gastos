import { useState } from "react";
import { Form } from "react-bootstrap";
import FormularioGasto from "../FormularioGasto";
import ListaGastos from "../ListaGastos";

const PanelMensual = ({
  gastosPendientes,
  gastosPagados,
  agregarGasto,
  editarGasto,
  marcarComoPagado,
  eliminarPagado,
  totalPendiente,
}) => {
  const [gastoEditando, setGastoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const cancelarEdicion = () => {
    setGastoEditando(null);
  };

  const filtrarGastos = (arrayGastos) =>
    arrayGastos.filter((gasto) =>
      gasto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

  const gastosPendientesFiltrados = filtrarGastos(gastosPendientes);
  const gastosPagadosFiltrados = filtrarGastos(gastosPagados);

  return (
    <>
      <div className="calc-display">
        <p className="calc-title">Gastos mensuales</p>

        <p className="calc-amount">
          ${totalPendiente.toLocaleString("es-AR")}
        </p>

        <div className="calc-sub">
          {gastosPendientes.length} gasto(s) pendientes
        </div>
      </div>

      <div className="calc-body">
        <FormularioGasto
          agregarGasto={agregarGasto}
          editarGasto={editarGasto}
          gastoEditando={gastoEditando}
          cancelarEdicion={cancelarEdicion}
        />

    <section className="mb-4">
  <h2 className="section-title">Buscar gasto</h2>

  <Form.Control
    type="text"
    className="buscador-gastos"
    placeholder="🔎 Buscar por nombre..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
  />
</section>

        <h2 className="section-title">Pendientes</h2>
        <div className="list-soft">
          <ListaGastos
            titulo={null}
            arrayGastos={gastosPendientesFiltrados}
            tipo="pendiente"
            onAccion={marcarComoPagado}
            onEditar={setGastoEditando}
          />
        </div>

        <div className="paid-block">
          <h2 className="section-title">Pagados</h2>
          <div className="list-soft">
            <ListaGastos
              titulo={null}
              arrayGastos={gastosPagadosFiltrados}
              tipo="pagado"
              onAccion={eliminarPagado}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PanelMensual;