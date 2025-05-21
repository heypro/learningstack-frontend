import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInitData } from "../InitDataContext.jsx";

const rowStyle = { padding: "8px 0", borderBottom: "1px solid #e1e1e1" };

export default function Leaderboard() {
  const navigate = useNavigate();
  const tg = window.Telegram?.WebApp;
  const initData = useInitData();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  /* back arrow */
  useEffect(() => {
    tg?.BackButton.show();
    tg?.BackButton.onClick(() => navigate("/"));
    return () => {
      tg?.BackButton.offClick();
      tg?.BackButton.hide();
    };
  }, [navigate, tg]);

  /* fetch leaderboard */
  useEffect(() => {
    fetch("/api/leaderboard/")
      .then((r) => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(setRows)
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h3>Leaderboard</h3>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {!rows && !error && <div>Loading…</div>}

      {rows && rows.map((u, idx) => (
        <div key={u.user_id} style={rowStyle}>
          <strong>{idx + 1}.</strong>{" "}
          {u.username ? `@${u.username}` : u.first_name || u.user_id} –{" "}
          {u.score}
        </div>
      ))}
    </div>
  );
}
