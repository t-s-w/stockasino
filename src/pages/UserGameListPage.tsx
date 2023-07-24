import { Container } from "react-bootstrap";
import PrivateRoute from "../auth/PrivateRoute";
import { useContext, useEffect, useState } from "react";
import { APIError, APIReturnGame, Game } from "../utils/types";
import sendRequest from "../utils/sendRequest";
import Loading from "../components/Loading";
import { APIURL } from "../utils/constants";
import GameCard from "../components/GameCard";
import { useNavigate } from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import { parseGameInfo } from "../utils/functions";
import ErrorAlertContext from "../contexts/ErrorAlertContext";

export default function UserGameListPage() {
  const { updateGame } = useContext(AuthContext);
  const [games, setGames] = useState([] as Game[]);
  const [currentGame, setCurrentGame] = useState(undefined as Game | undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { errorAlert } = useContext(ErrorAlertContext);
  const navigate = useNavigate();
  async function getGames() {
    try {
      setLoading(true);
      const response = (await sendRequest(APIURL + "games")) as APIReturnGame[];
      const gameList = response.map(parseGameInfo);
      const findCurrentGame = (await sendRequest(
        APIURL + "games/update"
      )) as APIReturnGame;

      setCurrentGame(parseGameInfo(findCurrentGame));
      setGames(gameList);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void getGames();
  }, []);

  const pastGames = games.filter((game) => {
    const now = new Date();
    return (
      game.month.getMonth() !== now.getUTCMonth() ||
      game.month.getUTCFullYear() !== now.getUTCFullYear()
    );
  });

  async function startGame() {
    try {
      const response = (await sendRequest(
        APIURL + "games/",
        "POST"
      )) as APIReturnGame;
      updateGame();
      navigate("/");
    } catch (err) {
      if (err instanceof APIError) {
        errorAlert(err.message);
      }
    }
  }

  return (
    <>
      <PrivateRoute />
      {error ? (
        <h1>{error}</h1>
      ) : (
        <Loading loading={loading}>
          <Container>
            <h1>Your games</h1>
            <p>
              Games are defined by calendar months. Try your best to buy and
              sell your way to the top every month!
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
                <button
                  className="btn btn-primary"
                  onClick={() => void startGame()}
                >
                  Start one now!
                </button>
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
      )}
    </>
  );
}
