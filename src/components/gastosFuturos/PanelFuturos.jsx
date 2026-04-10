const PanelFuturos = () => {
  return (
    <>
      <div className="calc-display calc-display-futuros">
        <p className="calc-title">Gastos futuros</p>
        <p className="calc-amount calc-amount-futuros">$0</p>
        <div className="calc-sub">Todavía no cargaste gastos futuros.</div>
      </div>

      <div className="calc-body">
        <div className="panel-placeholder panel-placeholder-futuros">
          <h2>Próximamente</h2>
          <p>
            Acá vas a poder guardar gastos de meses futuros y pasarlos al mes
            actual cuando corresponda.
          </p>
        </div>
      </div>
    </>
  );
};

export default PanelFuturos;