import AuthContext from "../auth/AuthContext";
import { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./HomePage.css";
import { Link } from "react-router-dom";
import { getCurrentMonth } from "../utils/functions";
import Leaderboard from "../components/Leaderboard";

export default function HomePage() {
  const { user, logout } = useContext(AuthContext);
  return user ? (
    <>
      <h1>Hello, {user.username}</h1>
      <Link to="" onClick={logout}>
        Log out
      </Link>
    </>
  ) : (
    <Container className="w-100">
      <div style={{ position: "relative" }}>
        <img src="/homepage-bg.jpg" width="100%" />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundImage:
              "radial-gradient(rgba(20,20,20,0.7),rgba(20,20,20,0.7) 50%,rgba(33,37,41,1) 70%,rgba(33,37,41,1))",
          }}
          className="d-flex flex-column justify-content-around p-5 w-100 h-100"
        >
          <h4>Professional traders are basically just gambling.</h4>
          <h1 className="my-5 display-4 text-center fw-bold">
            Why shouldn't you?
          </h1>
          <p className="text-end">
            Sign up now. <br />
            Make bets on the market risk-free.
            <br />
            Join the casino.
          </p>
        </div>
      </div>
      <div></div>
      <h2>Leaderboard</h2>
      <Leaderboard />
    </Container>
  );
}
