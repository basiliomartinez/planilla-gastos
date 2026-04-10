const PanelCuotas = () => {
  return (
    <>
      <div className="calc-display calc-display-cuotas">
        <p className="calc-title">Gastos en cuotas</p>
        <p className="calc-amount calc-amount-cuotas">$0</p>
        <div className="calc-sub">Todavía no cargaste gastos en cuotas.</div>
      </div>

      <div className="calc-body">
        <div className="panel-placeholder panel-placeholder-cuotas">
          <h2>Próximamente</h2>
          <p>
            Acá vas a poder cargar artículo, precio, cuotas totales, cuotas
            pagadas y cuotas pendientes.
          </p>
        </div>
      </div>
    </>
  );
};

export default PanelCuotas;