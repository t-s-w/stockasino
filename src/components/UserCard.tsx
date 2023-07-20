import AuthContext from "../auth/AuthContext";
import { useContext } from "react";
import GameInfoButton from "./GameInfoButton";

export default function UserCard() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <span>Hi, {user.username}!</span>
      <GameInfoButton />
    </>
  );
}
