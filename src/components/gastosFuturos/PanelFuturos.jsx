import { useState } from "react";
import { Button, Form, Row, Col, Alert, ListGroup } from "react-bootstrap";

const PanelFuturos = ({
  gastosFuturos,
  agregarGastoFuturo,
  pasarFuturoAMensual,
}) => {
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [error, setError] = useState("");

  const totalFuturo = gastosFuturos.reduce((acc, gasto) => acc + gasto.monto, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (nombre.trim() === "") {
      setError("El nombre del gasto es obligatorio.");
      return;
    }

    const montoNumero = Number(monto);
    if (monto === "" || Number.isNaN(montoNumero) || montoNumero <= 0) {
      setError("El monto debe ser un número mayor a 0.");
      return;
    }

    if (vencimiento === "") {
      setError("La fecha de vencimiento es obligatoria.");
      return;
    }

    const resultado = await agregarGastoFuturo({
      nombre: nombre.trim(),
      monto: montoNumero,
      vencimiento,
    });

    if (!resultado.ok) {
      setError(resultado.msg);
      return;
    }

    setNombre("");
    setMonto("");
    setVencimiento("");
  };

  const formatearDiaMes = (fecha) => {
    if (!fecha) return "";
    if (fecha.includes("T")) fecha = fecha.split("T")[0];
    const [anio, mes, dia] = fecha.split("-");
    return `${dia}/${mes}`;
  };

  return (
    <>
      <div className="calc-display calc-display-futuros">
        <p className="calc-title">Gastos futuros</p>
        <p className="calc-amount calc-amount-futuros">
          ${totalFuturo.toLocaleString("es-AR")}
        </p>
        <div className="calc-sub">
          {gastosFuturos.length} gasto(s) futuros
        </div>
      </div>

      <div className="calc-body">
        <section>
          <h2 className="section-title">Agregar gasto futuro</h2>

          {error && <Alert variant="warning">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={5}>
                <Form.Group>
                  <Form.Label>Nombre del gasto</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: Vacaciones"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Monto (ARS)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ej: 120000"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Vencimiento</Form.Label>
                  <Form.Control
                    type="date"
                    value={vencimiento}
                    onChange={(e) => setVencimiento(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={1} className="d-flex align-items-end">
                <Button type="submit" className="w-100 btn-add">
                  +
                </Button>
              </Col>
            </Row>
          </Form>
        </section>

        <div className="paid-block">
          <h2 className="section-title">Listado de futuros</h2>

          {gastosFuturos.length === 0 ? (
            <Alert variant="info">No hay gastos futuros cargados.</Alert>
          ) : (
            <ListGroup>
              {gastosFuturos.map((gasto) => (
                <div
                  key={gasto._id}
                  className="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2"
                >
                  <div>
                    <h3 className="h6 mb-1 text-light">{gasto.nombre}</h3>
                    <small className="fecha-vencimiento-normal">
                      Vence: {formatearDiaMes(gasto.vencimiento)}
                    </small>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <strong className="text-light">
                      ${gasto.monto.toLocaleString("es-AR")}
                    </strong>

                    <Button
                      variant="outline-light"
                      onClick={() => pasarFuturoAMensual(gasto._id)}
                    >
                      Pasar a mensual
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

export default PanelFuturos;