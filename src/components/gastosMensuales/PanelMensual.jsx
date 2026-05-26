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
  periodoActivo,
  setPeriodoActivo,
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

  const nombrePeriodo = new Date(`${periodoActivo}-02`).toLocaleDateString(
    "es-AR",
    {
      month: "long",
      year: "numeric",
    }
  );

  return (
    <>
      <div className="calc-display">
        <p className="calc-title">
          {nombrePeriodo.charAt(0).toUpperCase() + nombrePeriodo.slice(1)}
        </p>

        <p className="calc-amount">
          ${totalPendiente.toLocaleString("es-AR")}
        </p>

        <div className="calc-sub">
          {gastosPendientes.length} gasto(s) pendientes
        </div>

        <div className="selector-periodo-contenedor mt-3">
          <Form.Select
            className="selector-periodo"
            value={periodoActivo.split("-")[1]}
            onChange={(e) => {
              const nuevoMes = e.target.value;
              const anio = periodoActivo.split("-")[0];

              setPeriodoActivo(`${anio}-${nuevoMes}`);
            }}
          >
            <option value="01">Enero</option>
            <option value="02">Febrero</option>
            <option value="03">Marzo</option>
            <option value="04">Abril</option>
            <option value="05">Mayo</option>
            <option value="06">Junio</option>
            <option value="07">Julio</option>
            <option value="08">Agosto</option>
            <option value="09">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
          </Form.Select>

          <Form.Select
            className="selector-periodo"
            value={periodoActivo.split("-")[0]}
            onChange={(e) => {
              const nuevoAnio = e.target.value;
              const mes = periodoActivo.split("-")[1];

              setPeriodoActivo(`${nuevoAnio}-${mes}`);
            }}
          >
            {Array.from({ length: 100 }, (_, i) => {
              const anio = 1980 + i;

              return (
                <option key={anio} value={anio}>
                  {anio}
                </option>
              );
            })}
          </Form.Select>
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
            periodoActivo={periodoActivo}
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