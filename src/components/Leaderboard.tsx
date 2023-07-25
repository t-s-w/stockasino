import { useContext, useEffect, useState } from "react";
import sendRequest from "../utils/sendRequest";
import { APIURL } from "../utils/constants";
import { APIError, GameScore } from "../utils/types";
import ErrorAlertContext from "../contexts/ErrorAlertContext";
import { Spinner } from "react-bootstrap";
import { getCurrentMonth } from "../utils/functions";
import LeaderboardEntries from "./LeaderboardEntries";

type Props = {
  YYYYMM?: string;
};

export default function Leaderboard({ YYYYMM }: Props) {
  const { errorAlert } = useContext(ErrorAlertContext);
  const [loading, setLoading] = useState(true);
  const [gameScores, setGameScores] = useState([] as GameScore[]);
  const month = YYYYMM
    ? new Date(
        parseInt(YYYYMM.substring(0, 4)),
        parseInt(YYYYMM.substring(4, 6)) - 1
      )
    : getCurrentMonth();
  async function fetchLeaderboard(YYYYMM = undefined as undefined | string) {
    try {
      setLoading(true);
      const query = YYYYMM ? `?yyyymm=${YYYYMM}` : "";
      const response = await sendRequest<GameScore[]>(
        APIURL + "games/leaderboard" + query
      );
      setGameScores(response);
    } catch (err) {
      if (err instanceof APIError) {
        errorAlert(err.message);
      }
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => void fetchLeaderboard(YYYYMM), [YYYYMM]);
  return loading ? (
    <div className="w-100 d-flex justify-content-center">
      <Spinner
        animation="grow"
        variant="secondary"
        className="m-auto"
        style={{ width: "6rem", height: "6rem" }}
      />
    </div>
  ) : (
    <>
      {gameScores.length > 0 ? (
        <>
          <h5>
            For the month of{" "}
            {month.toLocaleDateString("en-sg", {
              year: "numeric",
              month: "long",
            })}
          </h5>
          <LeaderboardEntries gameScores={gameScores} />{" "}
        </>
      ) : (
        <h5>No games found for the requested month. {":("}</h5>
      )}
    </>
  );
}
