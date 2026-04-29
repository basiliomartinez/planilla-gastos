import { useState } from "react";
import { Button, Form, Container, Alert } from "react-bootstrap";
import { loginApi } from "../../helpers/queries";

const Login = ({ setUsuarioLogueado }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const data = await loginApi({ email, password });

    if (!data?.token) {
      setError("Email o contraseña incorrectos.");
      return;
    }

    const usuario = {
      nombre: data.nombre,
      email: data.email,
      token: data.token,
    };

    sessionStorage.setItem("usuarioKey", JSON.stringify(usuario));
    setUsuarioLogueado(usuario);
  };

  return (
    <div className="app-layout gastos-bg">
      <Container className="py-5" style={{ maxWidth: "420px" }}>
        <div className="calc-card p-4">
          <h1 className="text-light text-center mb-3">Cuentas Claras</h1>
          <p className="text-center detalle-cuota mb-4">
            Ingresá para ver tus gastos.
          </p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="usuario1@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="123456"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" className="w-100">
              Ingresar
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default Login;