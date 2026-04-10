import FormularioGasto from "../FormularioGasto";
import ListaGastos from "../ListaGastos";

const PanelMensual = ({
  gastosPendientes,
  gastosPagados,
  agregarGasto,
  marcarComoPagado,
  eliminarPagado,
  totalPendiente,
}) => {
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
        <FormularioGasto agregarGasto={agregarGasto} />

        <h2 className="section-title">Pendientes</h2>
        <div className="list-soft">
          <ListaGastos
            titulo={null}
            arrayGastos={gastosPendientes}
            tipo="pendiente"
            onAccion={marcarComoPagado}
          />
        </div>

        <div className="paid-block">
          <h2 className="section-title">Pagados</h2>
          <div className="list-soft">
            <ListaGastos
              titulo={null}
              arrayGastos={gastosPagados}
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