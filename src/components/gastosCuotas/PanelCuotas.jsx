import { useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Alert,
  ListGroup,
  Badge,
} from "react-bootstrap";

const PanelCuotas = ({ cuotas, agregarCuota, pagarCuota, eliminarCuota }) => {
  const [articulo, setArticulo] = useState("");
  const [precioTotal, setPrecioTotal] = useState("");
  const [cantidadCuotas, setCantidadCuotas] = useState("");
  const [error, setError] = useState("");

  // TOTAL DEUDA
  const totalDeuda = cuotas.reduce((acc, c) => acc + (c.deudaPendiente || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (articulo.trim() === "") {
      setError("El artículo es obligatorio.");
      return;
    }

    const precio = Number(precioTotal);
    const cuotasCant = Number(cantidadCuotas);

    if (precio <= 0 || isNaN(precio)) {
      setError("Precio inválido.");
      return;
    }

    if (cuotasCant <= 0 || isNaN(cuotasCant)) {
      setError("Cantidad de cuotas inválida.");
      return;
    }

    const valorCuota = Number((precio / cuotasCant).toFixed(2));

    const resultado = await agregarCuota({
      articulo: articulo.trim(),
      precioTotal: precio,
      cantidadCuotas: cuotasCant,
      cuotasPagadas: 0,
      valorCuota,
    });

    if (!resultado.ok) {
      setError(resultado.msg);
      return;
    }

    setArticulo("");
    setPrecioTotal("");
    setCantidadCuotas("");
  };

  return (
    <>
      {/* DISPLAY SUPERIOR */}
      <div className="calc-display calc-display-cuotas">
        <p className="calc-title">Gastos en cuotas</p>
        <p className="calc-amount calc-amount-cuotas">
          ${totalDeuda.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <div className="calc-sub">{cuotas.length} producto(s) en cuotas</div>
      </div>

      {/* BODY */}
      <div className="calc-body">
        {/* FORM */}
        <section>
          <h2 className="section-title">Agregar compra en cuotas</h2>

          {error && <Alert variant="warning">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Control
                  placeholder="Artículo"
                  value={articulo}
                  onChange={(e) => setArticulo(e.target.value)}
                />
              </Col>

              <Col md={3}>
                <Form.Control
                  type="number"
                  placeholder="Precio total"
                  value={precioTotal}
                  onChange={(e) => setPrecioTotal(e.target.value)}
                />
              </Col>

              <Col md={3}>
                <Form.Control
                  type="number"
                  placeholder="Cuotas"
                  value={cantidadCuotas}
                  onChange={(e) => setCantidadCuotas(e.target.value)}
                />
              </Col>

              <Col md={2}>
                <Button type="submit" className="w-100 btn-add">
                  +
                </Button>
              </Col>
            </Row>
          </Form>
        </section>

        {/* LISTADO */}
        <div className="paid-block">
          <h2 className="section-title">Listado de cuotas</h2>

          {cuotas.length === 0 ? (
            <Alert variant="info">No hay cuotas cargadas.</Alert>
          ) : (
            <ListGroup>
              {cuotas.map((c) => (
                <div
                  key={c._id}
                  className="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2"
                >
                  <div>
                    <h3 className="h6 mb-1 text-light">{c.articulo}</h3>

                    <small className="detalle-cuota d-block">
                      Total: $
                      {c.precioTotal.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </small>

                    <small className="detalle-cuota d-block">
                      Cuotas: {c.cuotasPagadas} / {c.cantidadCuotas}
                    </small>

                    <small className="detalle-cuota d-block">
                      Valor cuota: $
                      {c.valorCuota.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </small>

                    <small className="text-info d-block">
                      Pendientes: {c.cuotasPendientes}
                    </small>

                    <small className="text-warning d-block">
                      Deuda: $
                      {c.deudaPendiente.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </small>

                    {c.estado === "finalizada" && (
                      <Badge bg="success">Finalizada</Badge>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => pagarCuota(c._id)}
                      disabled={c.estado === "finalizada"}
                    >
                      Pagar cuota
                    </Button>

                    <Button
                      variant="outline-danger"
                      onClick={() => eliminarCuota(c._id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </ListGroup>
          )}
        </div>
      </div>
    </>
  );
};

export default PanelCuotas;