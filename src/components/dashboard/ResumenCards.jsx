import { Row, Col } from "react-bootstrap";

const ResumenCards = ({
  totalPendiente,
  totalFuturos,
  deudaCuotas,
  totalPagados,
  setSeccionActiva,
}) => {
  return (
    <Row className="g-3 mb-4 resumen-cards-row">
      <Col xs={6} md={3}>
        <div
          className="resumen-card resumen-card-danger resumen-card-clickable"
          onClick={() => setSeccionActiva("mensuales")}
          role="button"
        >
          <small>Pendiente</small>
          <h3>${totalPendiente.toLocaleString("es-AR")}</h3>
        </div>
      </Col>

      <Col xs={6} md={3}>
        <div
          className="resumen-card resumen-card-warning resumen-card-clickable"
          onClick={() => setSeccionActiva("futuros")}
          role="button"
        >
          <small>Futuros</small>
          <h3>${totalFuturos.toLocaleString("es-AR")}</h3>
        </div>
      </Col>

      <Col xs={6} md={3}>
        <div
          className="resumen-card resumen-card-primary resumen-card-clickable"
          onClick={() => setSeccionActiva("cuotas")}
          role="button"
        >
          <small>Cuotas</small>
          <h3>${deudaCuotas.toLocaleString("es-AR")}</h3>
        </div>
      </Col>

      <Col xs={6} md={3}>
        <div
          className="resumen-card resumen-card-success resumen-card-clickable"
          onClick={() => setSeccionActiva("historial")}
          role="button"
        >
          <small>Pagados</small>
          <h3>${totalPagados.toLocaleString("es-AR")}</h3>
        </div>
      </Col>
    </Row>
  );
};

export default ResumenCards;