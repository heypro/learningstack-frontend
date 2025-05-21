import { Routes, Route } from "react-router-dom";
import MainMenu from "./pages/MainMenu.jsx";
import Play from "./pages/Play.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import { InitDataProvider } from "./InitDataContext.jsx";

export default function App() {
  return (
    <InitDataProvider>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/play" element={<Play />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </InitDataProvider>
  );
}
