import { Container } from "react-bootstrap";
import PrivateRoute from "../auth/PrivateRoute";
import { useEffect, useState } from "react";
import { APIError, Game } from "../utils/types";
import sendRequest from "../utils/sendRequest";
import Loading from "../components/Loading";
import { APIURL } from "../utils/constants";
import GameCard from "../components/GameCard";

export default function UserGameListPage() {
  const [games, setGames] = useState([] as Game[]);
  const [currentGame, setCurrentGame] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function getGames() {
    try {
      const response = await sendRequest(APIURL + "games").then((x) =>
        x.map(
          (game) =>
            ({
              month: new Date(game.month),
              currentBalance: parseFloat(game.currentBalance),
            } as Game)
        )
      );
      const findCurrentGame = response.find((game) => {
        const now = new Date();
        return (
          game.month.getMonth() === now.getUTCMonth() &&
          game.month.getUTCFullYear() === now.getUTCFullYear()
        );
      });

      setCurrentGame(findCurrentGame);
      setGames(response);
    } catch (err) {
      if (err instanceof APIError) {
        console.log(err.body);
        setError(APIError.body?.detail);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getGames();
  }, []);

  const pastGames = games.filter((game) => {
    const now = new Date();
    return (
      game.month.getMonth() !== now.getUTCMonth() ||
      game.month.getUTCFullYear() !== now.getUTCFullYear()
    );
  });

  return (
    <>
      <PrivateRoute />
      <Loading loading={loading}>
        <Container>
          <h1>Your games</h1>
          <p>
            Games are defined by calendar months. Try your best to buy and sell
            your way to the top every month!
          </p>
          <p>
            Click on one of the game cards below to view details about your
            buy/sell records during that round.
          </p>

          <h2 className="mt-3">
            Current Month:{" "}
            {new Date().toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </h2>
          {currentGame ? (
            <GameCard game={currentGame} />
          ) : (
            <div className="d-flex flex-column align-items-center my-5">
              <p className="text-center">No game active at the moment.</p>
              <button className="btn btn-primary    ">Start one now!</button>
            </div>
          )}
          <h2>Past Games</h2>
          {pastGames.length > 0 ? (
            pastGames.map((game) => (
              <GameCard key={game.month.valueOf()} game={game} />
            ))
          ) : (
            <Container>No past games to show.</Container>
          )}
        </Container>
      </Loading>
    </>
  );
}
