import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import { useContext } from "react";
import UserCard from "./UserCard";
import Login from "./Login";

export default function NavBar() {
  const { user } = useContext(AuthContext);

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>
          <Link to="/">Stockasino!</Link>
        </Navbar.Brand>
        <Navbar.Collapse id="navbarNav">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          ></Nav>
          {user ? <UserCard /> : <Login />}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
