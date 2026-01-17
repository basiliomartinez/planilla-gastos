import { useState } from "react";
import { Button, Form, Row, Col, Alert } from "react-bootstrap";

const FormularioGasto = ({ agregarGasto }) => {
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
const [vencimiento, setVencimiento] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // 1) Nombre obligatorio
    if (nombre.trim() === "") {
      setError("El nombre del gasto es obligatorio.");
      return;
    }

    // 2) Monto obligatorio y > 0
    const montoNumero = Number(monto);
    if (monto === "" || Number.isNaN(montoNumero) || montoNumero <= 0) {
      setError("El monto debe ser un número mayor a 0.");
      return;
    }

    // 3) Fecha obligatoria
    if (vencimiento === "") {
      setError("La fecha de vencimiento es obligatoria.");
      return;
    }

    const nuevoGasto = {
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      monto: montoNumero,
      vencimiento,
    };

    // 4) Validación de duplicados (la decide App)
    const resultado = agregarGasto(nuevoGasto);

    if (!resultado.ok) {
      setError(resultado.msg);
      return;
    }

    // Si salió todo bien, limpio el form
   setNombre("");
setMonto("");
setVencimiento(new Date().toISOString().slice(0, 10));

  };

  return (
    <section>
      <h2 className="h4 mb-3">Agregar gasto</h2>

      {error && <Alert variant="warning">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col md={5}>
            <Form.Group>
              <Form.Label>Nombre del gasto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Alquiler"
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
  );
};

export default FormularioGasto;
