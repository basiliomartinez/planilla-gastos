import { Navbar, Nav, Container } from "react-bootstrap";

const NavbarPrincipal = ({ seccionActiva, setSeccionActiva }) => {
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
          <Nav className="ms-auto text-center">
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarPrincipal;