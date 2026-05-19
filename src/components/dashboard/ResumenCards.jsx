import { Row, Col } from "react-bootstrap";

const ResumenCards = ({
  totalPendiente,
  totalFuturos,
  deudaCuotas,
  totalPagados,
}) => {
  return (
    <Row className="g-3 mb-4">
      <Col xs={6} md={3}>
        <div className="resumen-card resumen-card-danger">
          <small>Pendiente</small>

          <h3>
            ${totalPendiente.toLocaleString("es-AR")}
          </h3>
        </div>
      </Col>

      <Col xs={6} md={3}>
        <div className="resumen-card resumen-card-warning">
          <small>Futuros</small>

          <h3>
            ${totalFuturos.toLocaleString("es-AR")}
          </h3>
        </div>
      </Col>

      <Col xs={6} md={3}>
        <div className="resumen-card resumen-card-primary">
          <small>Cuotas</small>

          <h3>
            ${deudaCuotas.toLocaleString("es-AR")}
          </h3>
        </div>
      </Col>

      <Col xs={6} md={3}>
        <div className="resumen-card resumen-card-success">
          <small>Pagados</small>

          <h3>
            ${totalPagados.toLocaleString("es-AR")}
          </h3>
        </div>
      </Col>
    </Row>
  );
};

export default ResumenCards;