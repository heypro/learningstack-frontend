export default function BigButton({ children, onClick }) {
    return (
      <button
        onClick={onClick}
        style={{
          width: "100%",
          padding: "20px 0",
          margin: "12px 0",
          fontSize: 24,
          fontWeight: 700,
          borderRadius: 12,
          border: "none",
          background: "var(--tg-theme-button-color, #3390ec)",
          color: "var(--tg-theme-button-text-color, #fff)",
        }}
      >
        {children}
      </button>
    );
  }
  