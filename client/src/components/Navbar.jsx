import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import senaLogo from '../assets/sena-logo.svg'; // Asegúrate de tener el logo en esta ruta

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica de deslogueo
    navigate('/login'); // Redirige a la página de login después de desloguearse
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand >
          <img
            src={senaLogo}
            alt="SENA Logo"
            width="40"
            height="40"
            className="d-inline-block align-top"
          />{' '}
          SENA
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Button variant="outline-danger" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
