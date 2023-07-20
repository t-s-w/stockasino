import { useContext } from "react";
import AuthContext from "../auth/AuthContext";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function GameInfoButton() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  return user.game ? (
    <></>
  ) : (
    <Nav.Item>
      <Nav.Link onClick={() => navigate("/user/games")}>
        No active game
      </Nav.Link>
    </Nav.Item>
  );
}
