import { Navbar, Nav, Container, Button } from "react-bootstrap";

const NavbarPrincipal = ({
  seccionActiva,
  setSeccionActiva,
  usuarioLogueado,
  cerrarSesion,
}) => {
  return (
    <Navbar bg="dark" variant="dark" expand="md" className="mb-2 py-2">
      <Container>
        <Navbar.Brand
          style={{ fontSize: "16px", cursor: "pointer" }}
          onClick={() => setSeccionActiva("mensuales")}
        >
          💰 Cuentas Claras
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-cuentas-claras" />

        <Navbar.Collapse id="navbar-cuentas-claras">
          <Nav className="ms-auto text-center align-items-md-center">
            <Nav.Link
              active={seccionActiva === "mensuales"}
              onClick={() => setSeccionActiva("mensuales")}
            >
              Mensuales
            </Nav.Link>

            <Nav.Link
              active={seccionActiva === "futuros"}
              onClick={() => setSeccionActiva("futuros")}
            >
              Futuros
            </Nav.Link>

            <Nav.Link
              active={seccionActiva === "cuotas"}
              onClick={() => setSeccionActiva("cuotas")}
            >
              Cuotas
            </Nav.Link>

            <span className="navbar-user ms-md-3 my-2 my-md-0">
              {usuarioLogueado?.nombre}
            </span>

            <Button
              variant="outline-light"
              size="sm"
              className="ms-md-2"
              onClick={cerrarSesion}
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