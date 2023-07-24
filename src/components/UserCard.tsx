import AuthContext from "../auth/AuthContext";
import { useContext } from "react";
import GameInfoButton from "./GameInfoButton";
import { Container, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function UserCard() {
  const { user, logout } = useContext(AuthContext);

  return user ? (
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
        <NavDropdown.Item eventKey={"gamelist"}>
          <Link to="/user/history">History</Link>
        </NavDropdown.Item>
        <NavDropdown.Item eventKey="logout" onClick={() => void logout()}>
          Log out
        </NavDropdown.Item>
      </NavDropdown>
      <GameInfoButton />
    </Nav>
  ) : null;
}
