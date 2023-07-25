import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";
import { APIError, APIReturnGame, Game } from "../utils/types";
import sendRequest from "../utils/sendRequest";
import { APIURL } from "../utils/constants";
import { Container } from "react-bootstrap";
import Portfolio from "../components/Portfolio";
import { parseGameInfo } from "../utils/functions";

export default function ViewGamePage() {
  const { gameId } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [gameInfo, setGameInfo] = useState({} as Game);
  async function fetchGameData() {
    try {
      if (!gameId) return;
      setLoading(true);
      const game = await sendRequest<APIReturnGame>(
        APIURL + `games/${gameId}/holdings`
      );
      const parsedGame = parseGameInfo(game);
      setGameInfo(parsedGame);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void fetchGameData();
  }, []);

  return (
    <Loading loading={loading}>
      {error ? (
        <h1>{error}</h1>
      ) : (
        gameInfo &&
        gameInfo.user && (
          <Container>
            <h1 className="mb-5">{`${
              gameInfo.user
            }'s round of ${gameInfo.month?.toLocaleString(undefined, {
              year: "numeric",
              month: "long",
            })}`}</h1>
            <h2>Current Holdings</h2>
            {gameInfo && <Portfolio gameInfo={gameInfo} />}
          </Container>
        )
      )}
    </Loading>
  );
}
