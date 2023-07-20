import { Link } from "react-router-dom";
import { Game } from "../utils/types";
import { Card } from "react-bootstrap";

type Props = {
  game: Game;
};

export default function GameCard(props: Props) {
  const { game } = props;

  return (
    <Link to="/">
      <Card className="my-5" body>
        Month of{" "}
        {game.month.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
        })}
      </Card>
    </Link>
  );
}
