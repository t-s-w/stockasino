import { useParams } from "react-router-dom";
import Leaderboard from "../components/Leaderboard";

export default function LeaderboardPage() {
  const { YYYYMM } = useParams();
  return (
    <>
      <h1>Leaderboard</h1>

      <Leaderboard YYYYMM={YYYYMM} />
    </>
  );
}
