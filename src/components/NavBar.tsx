import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import { useContext } from "react";
import UserCard from "./UserCard";
import Login from "./Login";
import SearchBar from "./SearchBar";

export default function NavBar() {
  const { user } = useContext(AuthContext);

  return (
    <Navbar expand="lg" className="bg-body-tertiary bg-gradient">
      <Container>
        <Navbar.Brand>
          <Link to="/">Stockasino!</Link>
        </Navbar.Brand>
        <SearchBar />
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: "100px" }}>
            <Nav.Link as={Link} to="/leaderboards">
              Leaderboards
            </Nav.Link>
          </Nav>
          {user ? <UserCard /> : <Login />}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
