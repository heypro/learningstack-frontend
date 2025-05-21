import { useNavigate } from "react-router-dom";
import BigButton from "../components/BigButton.jsx";

export default function MainMenu() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <BigButton onClick={() => navigate("/play")}>PLAY</BigButton>
      <BigButton onClick={() => navigate("/leaderboard")}>LEADERBOARD</BigButton>
    </div>
  );
}
