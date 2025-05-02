import React from 'react';
import { Navbar, Nav, Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, logout, getCurrentUser } from '../services/authService';

const AppNavbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.search.value;
    if (onSearch && searchTerm) {
      onSearch(searchTerm);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">MovieHub</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {loggedIn && (
              <>
                {/* Add more nav links here if needed */}
              </>
            )}
          </Nav>
          
          {loggedIn && (
            <Form className="d-flex mx-auto" onSubmit={handleSearch}>
              <Form.Control
                type="search"
                placeholder="Search movies or actors"
                className="me-2"
                aria-label="Search"
                name="search"
              />
              <Button variant="outline-light" type="submit">Search</Button>
            </Form>
          )}
          
          <Nav>
            {loggedIn ? (
              <>
                <Navbar.Text className="me-3">
                  Signed in as: {currentUser?.username}
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar; 