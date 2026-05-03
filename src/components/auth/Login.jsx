import { useState } from "react";
import { Button, Form, Container, Alert } from "react-bootstrap";
import { loginApi, registroApi } from "../../helpers/queries";

const Login = ({ setUsuarioLogueado, mensajeSesion, setMensajeSesion }) => {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (modoRegistro) {
      if (nombre.trim() === "") {
        setError("Decinos tu nombre 🙂");
        return;
      }
      if (!email.includes("@")) {
        setError("Ingresá un email válido 📧");
        return;
      }

      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres 🔒");
        return;
      }
      const data = await registroApi({
        nombre: nombre.trim(),
        email,
        password,
      });

      if (!data?.mensaje) {
        setError(data?.mensaje || "Error al crear cuenta 😕");
        return;
      }

      setMensaje("Cuenta creada correctamente 🎉 Ahora podés ingresar.");
      setModoRegistro(false);
      setNombre("");
      setPassword("");
      return;
    }
    if (!email || !password) {
      setError("Completá email y contraseña 🙏");
      return;
    }
    const data = await loginApi({ email, password });

    if (!data?.token) {
      setError("Email o contraseña incorrectos 😕");
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
    <div className="app-layout gastos-bg d-flex align-items-center justify-content-center">
      <Container style={{ maxWidth: "420px" }}>
        <div className="calc-card p-4 shadow-lg">
          <h1 className="text-center text-light mb-2">💰 Cuentas Claras</h1>

          <p className="text-center text-secondary mb-4">
            {modoRegistro
              ? "Creá tu cuenta para empezar"
              : "Ingresá para ver tus gastos"}
          </p>

          {mensajeSesion && (
            <Alert
              variant="warning"
              onClose={() => setMensajeSesion("")}
              dismissible
            >
              {mensajeSesion}
            </Alert>
          )}

          {error && <Alert variant="danger">{error}</Alert>}
          {mensaje && <Alert variant="success">{mensaje}</Alert>}

          <Form onSubmit={handleSubmit}>
            {modoRegistro && (
              <Form.Group className="mb-3">
                <Form.Label className="text-light">Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Basilio"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label className="text-light">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="usuario@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-light">Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" className="w-100 mb-2">
              {modoRegistro ? "Crear cuenta" : "Ingresar"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <Button
              variant="link"
              className="text-decoration-none text-info"
              onClick={() => {
                setModoRegistro(!modoRegistro);
                setError("");
                setMensaje("");
              }}
            >
              {modoRegistro ? "Ya tengo cuenta" : "No tengo cuenta"}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
