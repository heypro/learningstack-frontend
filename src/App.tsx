// src/App.tsx
import React, { useEffect, useState } from "react";

type Entry = { key: string; val: string; type: string };

function getEntries(): Entry[] {
  const wa = (window as any).Telegram?.WebApp;
  if (!wa) {
    return [
      {
        key: "Telegram.WebApp",
        val: "not found (open through Telegram, bro)",
        type: "undefined",
      },
    ];
  }

  // Call ready() early so Telegram hides the loading spinner
  if (typeof wa.ready === "function") wa.ready();

  return Object.getOwnPropertyNames(wa).map((k) => {
    const v = wa[k];
    let val: string;
    if (typeof v === "object") {
      try {
        val = JSON.stringify(v, null, 2);
      } catch {
        val = "[object]";
      }
    } else if (typeof v === "function") {
      val = "[function]";
    } else {
      val = String(v);
    }
    return { key: k, val, type: typeof v };
  });
}

const App: React.FC = () => {
  const [entries, setEntries] = useState<Entry[] | null>(null);

  useEffect(() => {
    setEntries(getEntries());
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>Telegram.WebApp dump</h1>
      {!entries ? (
        "Loading…"
      ) : (
        <dl>
          {entries.map((e) => (
            <React.Fragment key={e.key}>
              <dt>
                {e.key}{" "}
                <small style={{ fontWeight: 400, color: "#666" }}>
                  ({e.type})
                </small>
              </dt>
              <dd
                style={{
                  marginLeft: "1rem",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  marginBottom: "0.5rem",
                }}
              >
                {e.val}
              </dd>
            </React.Fragment>
          ))}
        </dl>
      )}
    </div>
  );
};

export default App;
