import { Table } from "react-bootstrap";
import { GameScore } from "../utils/types";
import { Link } from "react-router-dom";

type Props = {
  gameScores: GameScore[];
};

export default function LeaderboardEntries({ gameScores }: Props) {
  return (
    <Table striped>
      <thead>
        <tr>
          <th>#</th>
          <th>Username</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {gameScores.map((score, index) => (
          <tr>
            <td>{index + 1}</td>
            <td>
              <Link
                to={"/games/" + score.id.toString()}
                className="fw-semibold"
              >
                {score.user}
              </Link>
            </td>
            <td>
              {score.value.toLocaleString(undefined, {
                style: "currency",
                currency: "USD",
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
