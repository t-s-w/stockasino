import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./auth/AuthContext";
import SignupPage from "./pages/SignupPage";
import NavBar from "./components/NavBar";
import { Container } from "react-bootstrap";
import ViewTickerPage from "./pages/ViewTickerPage";
import UserGameListPage from "./pages/UserGameListPage";
import ViewGamePage from "./pages/ViewGamePage";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Container className="p-3 ">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/viewticker/:slug" element={<ViewTickerPage />} />
          <Route path="/user/history" element={<UserGameListPage />} />
          <Route path="/games/:gameId" element={<ViewGamePage />} />
        </Routes>
      </Container>
    </AuthProvider>
  );
}

export default App;
