import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";
import { APIError, Game } from "../utils/types";
import sendRequest from "../utils/sendRequest";
import { APIURL } from "../utils/constants";
import { Container } from "react-bootstrap";
import Portfolio from "../components/Portfolio";

export default function ViewGamePage() {
  const { gameId } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [gameInfo, setGameInfo] = useState({} as Game);
  async function fetchGameData() {
    try {
      setLoading(true);
      const game = await sendRequest(APIURL + `games/${gameId}/details`);
      game.month = new Date(game.month);
      game.currentBalance = parseFloat(game.cash);
      setGameInfo(game as Game);
      console.log(game);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.body.detail);
      }
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchGameData();
  }, []);

  return (
    <Loading loading={loading}>
      {error ? (
        <h1>{error}</h1>
      ) : (
        gameInfo && (
          <Container>
            <h1>{`${gameInfo.user}'s round of ${gameInfo.month?.toLocaleString(
              undefined,
              { year: "numeric", month: "long" }
            )}`}</h1>
            <h2>Current Holdings</h2>
            {gameInfo && <Portfolio gameInfo={gameInfo} />}
          </Container>
        )
      )}
    </Loading>
  );
}
