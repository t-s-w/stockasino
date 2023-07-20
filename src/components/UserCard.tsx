import AuthContext from "../auth/AuthContext";
import { useContext } from "react";
import GameInfoButton from "./GameInfoButton";
import { Nav, NavDropdown } from "react-bootstrap";

export default function UserCard() {
  const { user } = useContext(AuthContext);

  return (
    <Nav variant="underline">
      <NavDropdown
        className="text-center"
        title={
          <span>
            Logged in as
            <br />
            {user.username}
          </span>
        }
        drop="down-centered"
      >
        test
      </NavDropdown>
      <GameInfoButton />
    </Nav>
    // <>
    //   <span>Hi, {user.username}!</span>
    //   <GameInfoButton />
    // </>
  );
}
