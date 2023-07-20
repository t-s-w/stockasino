import { useContext } from "react";
import AuthContext from "../auth/AuthContext";

export default function GameInfoButton() {
  const { user } = useContext(AuthContext);
  return user.game ? <></> : "Not currently playing a game. Start one!";
}
