import { useContext, useEffect } from "react";
import AuthContext from "../auth/AuthContext";
import { Badge, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function GameInfoButton() {
  const navigate = useNavigate();
  const { activeGame, updateGame } = useContext(AuthContext);
  useEffect(updateGame, []);

  return activeGame ? (
    <Nav.Item>
      <Nav.Link>
        <p className="mb-0">
          Round of{" "}
          {activeGame.month.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
          })}
        </p>
        <p className="mb-0">
          Current Balance:{" "}
          <Badge bg="secondary">
            {activeGame.currentBalance.toLocaleString(undefined, {
              style: "currency",
              currency: "USD",
            })}
          </Badge>
        </p>
      </Nav.Link>
    </Nav.Item>
  ) : (
    <Nav.Item>
      <Nav.Link onClick={() => navigate("/user/games")}>
        No active game
      </Nav.Link>
    </Nav.Item>
  );
}
