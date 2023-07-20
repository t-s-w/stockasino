import { Container } from "react-bootstrap";
import PrivateRoute from "../auth/PrivateRoute";

export default function UserGameListPage() {
  return (
    <>
      <PrivateRoute />
      <Container>
        <h2>Current Game</h2>
        <h2>Past Games</h2>
      </Container>
    </>
  );
}
