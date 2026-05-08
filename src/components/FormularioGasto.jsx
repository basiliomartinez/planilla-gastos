import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Alert } from "react-bootstrap";

const fechaHoy = () => new Date().toISOString().slice(0, 10);

const normalizarFecha = (fecha) => {
  if (!fecha) return fechaHoy();
  return fecha.includes("T") ? fecha.split("T")[0] : fecha;
};

const FormularioGasto = ({
  agregarGasto,
  editarGasto,
  gastoEditando,
  cancelarEdicion,
}) => {
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [vencimiento, setVencimiento] = useState(fechaHoy());
  const [error, setError] = useState("");

  useEffect(() => {
    if (gastoEditando) {
      setNombre(gastoEditando.nombre);
      setMonto(String(gastoEditando.monto));
      setVencimiento(normalizarFecha(gastoEditando.vencimiento));
      setError("");
    }
  }, [gastoEditando]);

  const limpiarFormulario = () => {
    setNombre("");
    setMonto("");
    setVencimiento(fechaHoy());
    setError("");
  };

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

    const gasto = {
      nombre: nombre.trim(),
      monto: montoNumero,
      vencimiento,
    };

    const resultado = gastoEditando
      ? await editarGasto(gastoEditando._id, gasto)
      : await agregarGasto(gasto);

    if (!resultado.ok) {
      setError(resultado.msg);
      return;
    }

    limpiarFormulario();

    if (gastoEditando) {
      cancelarEdicion();
    }
  };

  const handleCancelar = () => {
    limpiarFormulario();
    cancelarEdicion();
  };

  return (
    <section>
      <h2 className="h4 mb-3">
        {gastoEditando ? "Editar gasto" : "Agregar gasto"}
      </h2>

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
              {gastoEditando ? "✓" : "+"}
            </Button>
          </Col>
        </Row>

        {gastoEditando && (
          <div className="mt-3">
            <Button variant="outline-secondary" size="sm" onClick={handleCancelar}>
              Cancelar edición
            </Button>
          </div>
        )}
      </Form>
    </section>
  );
};

export default FormularioGasto;