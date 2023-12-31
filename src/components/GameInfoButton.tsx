import { useContext, useEffect } from "react";
import AuthContext from "../auth/AuthContext";
import { Badge, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function GameInfoButton() {
  const navigate = useNavigate();
  const { activeGame, updateGame, user } = useContext(AuthContext);
  useEffect(updateGame, [user]);

  return activeGame ? (
    <Nav.Item>
      <Nav.Link>
        <Link to={`/games/` + activeGame.id.toString()}>
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
        </Link>
      </Nav.Link>
    </Nav.Item>
  ) : (
    <Nav.Item>
      <Nav.Link onClick={() => navigate("/user/history")}>
        No active game
      </Nav.Link>
    </Nav.Item>
  );
}
