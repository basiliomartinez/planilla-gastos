import { useState } from "react";
import { Button, Form, Container, Alert } from "react-bootstrap";
import { loginApi, registroApi } from "../../helpers/queries";

const Login = ({ setUsuarioLogueado, mensajeSesion, setMensajeSesion }) => {
  const [modoRegistro, setModoRegistro] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

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

      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
        setError("El nombre solo puede tener letras y espacios.");
        return;
      }

      if (!email.includes("@")) {
        setError("Ingresá un email válido 📧");
        return;
      }

      if (password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres 🔒");
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
      setEmail("");
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
const esFormularioValido = () => {
  if (modoRegistro) {
    return (
      nombre.trim().length >= 2 &&
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre) &&
      email.includes("@") &&
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(password)
    );
  }

  // login
  return email !== "" && password !== "";
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
                  placeholder="Ej: Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />

                {/* 👇 PASO 5: esto va debajo del input de nombre */}
                <Form.Text className="text-warning">
                  {nombre.length > 0 &&
                    !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre) &&
                    "Solo letras y espacios"}
                </Form.Text>
                {/* 👆 FIN PASO 5 */}
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

              <div className="position-relative">
                <Form.Control
                  type={mostrarPassword ? "text" : "password"}
                  placeholder="Ej: Abc123!@"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <span
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {mostrarPassword ? "🙈" : "👁"}
                </span>
              </div>

              <Form.Text className="text-warning">
                {password.length > 0 &&
                  password.length < 8 &&
                  "Mínimo 8 caracteres"}
                {password.length >= 8 &&
                  !/[A-Z]/.test(password) &&
                  "Falta una mayúscula"}
                {password.length >= 8 &&
                  /[A-Z]/.test(password) &&
                  !/[0-9]/.test(password) &&
                  "Falta un número"}
                {password.length >= 8 &&
                  /[A-Z]/.test(password) &&
                  /[0-9]/.test(password) &&
                  !/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(password) &&
                  "Falta un carácter especial"}
              </Form.Text>
            </Form.Group>

            <Button type="submit" 
            className="w-100 mb-2"
            disabled={!esFormularioValido()}
            >
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