import { useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const NavbarPrincipal = ({
  seccionActiva,
  setSeccionActiva,
  usuarioLogueado,
  cerrarSesion,
}) => {
  const [expanded, setExpanded] = useState(false);

  const navegarA = (seccion) => {
    setSeccionActiva(seccion);
    setExpanded(false);
  };

  const salir = () => {
    cerrarSesion();
    setExpanded(false);
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="md"
      expanded={expanded}
      onToggle={(valor) => setExpanded(valor)}
      className="mb-2 py-2"
    >
      <Container>
        <Navbar.Brand
          style={{ fontSize: "16px", cursor: "pointer" }}
          onClick={() => navegarA("dashboard")}
        >
          💰 Cuentas Claras
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-cuentas-claras" />

        <Navbar.Collapse id="navbar-cuentas-claras">
          <Nav className="ms-auto text-center align-items-md-center">

            <Nav.Link
              active={seccionActiva === "dashboard"}
              onClick={() => navegarA("dashboard")}
            >
              Dashboard
            </Nav.Link>

            <Nav.Link
              active={seccionActiva === "mensuales"}
              onClick={() => navegarA("mensuales")}
            >
              Mensuales
            </Nav.Link>

            <Nav.Link
              active={seccionActiva === "futuros"}
              onClick={() => navegarA("futuros")}
            >
              Futuros
            </Nav.Link>

            <Nav.Link
              active={seccionActiva === "cuotas"}
              onClick={() => navegarA("cuotas")}
            >
              Cuotas
            </Nav.Link>

            <Nav.Link
              active={seccionActiva === "historial"}
              onClick={() => navegarA("historial")}
            >
              Historial
            </Nav.Link>

            <Nav.Link
              active={seccionActiva === "vencimientos"}
              onClick={() => navegarA("vencimientos")}
            >
              Vencimientos
            </Nav.Link>

            <span className="navbar-user ms-md-3 my-2 my-md-0">
              {usuarioLogueado?.nombre}
            </span>

            <Button
              variant="outline-light"
              size="sm"
              className="ms-md-2"
              onClick={salir}
            >
              Salir
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarPrincipal;