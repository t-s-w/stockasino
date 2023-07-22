import AuthContext from "../auth/AuthContext";
import { useContext } from "react";
import GameInfoButton from "./GameInfoButton";
import { Container, Nav, NavDropdown } from "react-bootstrap";

export default function UserCard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Nav variant="underline">
      <NavDropdown
        className="text-center"
        title={
          <span>
            Logged in as
            <br />
            <span className="fw-bold">{user.username}</span>
          </span>
        }
        drop="down-centered"
      >
        <Container className="w-100 d-flex justify-content-center">
          <button className="btn btn-secondary" onClick={logout}>
            Log out
          </button>
        </Container>
      </NavDropdown>
      <GameInfoButton />
    </Nav>
  );
}
