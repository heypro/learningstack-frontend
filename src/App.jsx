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

  // new state for backend call
  const [authResponse, setAuthResponse] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(false);

  // grab initData once Telegram injects the API
  useEffect(() => {
    function updateData() {
      setInitData(getInitData());
      setInitDataUnsafe(getInitDataUnsafe());
    }

    updateData();
    const t = setTimeout(updateData, 500); // safety ping
    return () => clearTimeout(t);
  }, []);

  // when we finally have initData → hit backend
  useEffect(() => {
    if (!initData) return;

    const controller = new AbortController();
    const { signal } = controller;

    async function sendToBackend() {
      try {
        setLoading(true);
        setAuthError(null);

        const res = await fetch("/api/telegram-auth/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData }),
          signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || res.statusText);
        }

        const data = await res.json();
        setAuthResponse(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setAuthError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    sendToBackend();
    return () => controller.abort();
  }, [initData]);

  return (
    <div style={{ padding: 24, fontFamily: "monospace" }}>
      <h2>Telegram Mini App Init Data Viewer</h2>

      {/* raw initData */}
      <div>
        <h4>initData:</h4>
        {initData ? <pre>{initData}</pre> : <div>No <code>initData</code> detected.</div>}
      </div>

      {/* unsafe object */}
      <div>
        <h4>initDataUnsafe:</h4>
        {initDataUnsafe ? (
          <pre>{JSON.stringify(initDataUnsafe, null, 2)}</pre>
        ) : (
          <div>No <code>initDataUnsafe</code> detected.</div>
        )}
      </div>

      {/* backend auth result */}
      <div>
        <h4>Backend Auth Response:</h4>
        {loading && <div>Loading…</div>}

        {authError && (
          <div style={{ color: "red" }}>
            Auth error: <code>{authError}</code>
          </div>
        )}

        {authResponse ? (
          <pre>{JSON.stringify(authResponse, null, 2)}</pre>
        ) : !loading ? (
          <div>No response yet.</div>
        ) : null}
      </div>
    </div>
  );
}
