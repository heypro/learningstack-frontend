import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInitData } from "../InitDataContext.jsx";

// simple inline styles – tweak later
const pageStyle = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 20,
  fontFamily: "sans-serif",
};

const clickStyle = {
  fontSize: 32,
  padding: "28px 48px",
  borderRadius: 16,
  border: "none",
  background: "var(--tg-theme-button-color, #3390ec)",
  color: "var(--tg-theme-button-text-color, #fff)",
};

export default function Play() {
  const navigate = useNavigate();
  const tg = window.Telegram?.WebApp;
  const initData = useInitData();
  const [score, setScore] = useState(0);
  const containerRef = useRef(null);

  /* ── back arrow setup ─────────────────────────── */
  useEffect(() => {
    if (!tg?.BackButton) return;

    tg.BackButton.show();
    tg.BackButton.onClick(() => navigate("/"));

    return () => {
      tg.BackButton.offClick();   // cleanup
      tg.BackButton.hide();
    };
  }, [navigate, tg]);

  /* ── click handler ────────────────────────────── */
  async function handleClick() {
    animatePlusOne();
    setScore((s) => s + 1);

    try {
      tg?.HapticFeedback?.impactOccurred?.("light");
    } catch (_) {}

    // fire & forget – no blocking UI
    fetch("/api/click/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ increment: 1, initData }),
    }).then(r => r.ok ? r.json() : null)
    .then(data => data && setScore(data.score))
    .catch(() => {
      /* ignore network errors for now */
    });
  }

  /* ── little “+1” float animation ──────────────── */
  function animatePlusOne() {
    const span = document.createElement("span");
    span.textContent = "+1";
    span.style.position = "absolute";
    span.style.fontWeight = "700";
    span.style.color = "var(--tg-theme-link-color, #00b0ff)";
    span.style.left = "50%";
    span.style.top = "50%";
    span.style.transform = "translate(-50%, -50%)";
    span.style.pointerEvents = "none";
    span.style.transition = "all 600ms ease-out";
    containerRef.current.appendChild(span);

    // kick off animation in next tick
    requestAnimationFrame(() => {
      span.style.transform = "translate(-50%, -120%)";
      span.style.opacity = "0";
    });

    setTimeout(() => span.remove(), 650);
  }

  return (
    <div ref={containerRef} style={pageStyle}>
      <div>Score: {score}</div>
      <button style={clickStyle} onClick={handleClick}>
        CLICK
      </button>
    </div>
  );
}
