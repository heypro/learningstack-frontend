import { useEffect, useState } from "react";

function getInitData() {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp?.initData || null;
}

function getInitDataUnsafe() {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp?.initDataUnsafe || null;
}

export default function App() {
  const [initData, setInitData] = useState(null);
  const [initDataUnsafe, setInitDataUnsafe] = useState(null);

  useEffect(() => {
    // Try to get initData once Telegram WebApp is available
    function updateData() {
      setInitData(getInitData());
      setInitDataUnsafe(getInitDataUnsafe());
    }

    // Telegram may load late, so try again after a tiny delay
    updateData();
    const timeout = setTimeout(updateData, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "monospace" }}>
      <h2>Telegram Mini App Init Data Viewer</h2>
      <div>
        <h4>initData:</h4>
        {initData && initData.length > 0 ? (
          <pre>{initData}</pre>
        ) : (
          <div>No <code>initData</code> detected. (Probably not loaded inside Telegram?)</div>
        )}
      </div>
      <div>
        <h4>initDataUnsafe:</h4>
        {initDataUnsafe ? (
          <pre>{JSON.stringify(initDataUnsafe, null, 2)}</pre>
        ) : (
          <div>No <code>initDataUnsafe</code> detected.</div>
        )}
      </div>
    </div>
  );
}
