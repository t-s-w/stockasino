import { useContext, useEffect } from "react";
import AuthContext from "../auth/AuthContext";
import { Badge, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function GameInfoButton() {
  const navigate = useNavigate();
  const { user, updateBalance } = useContext(AuthContext);
  useEffect(updateBalance, []);

  return user?.game && user.game.month ? (
    <Nav.Item>
      <Nav.Link>
        <p className="mb-0">
          Round of{" "}
          {user.game.month.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
          })}
        </p>
        <p className="mb-0">
          Current Balance:{" "}
          <Badge bg="secondary">
            {user.game.currentBalance.toLocaleString(undefined, {
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
