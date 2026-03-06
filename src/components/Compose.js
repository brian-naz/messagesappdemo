import { useState } from "react";

function Compose({ onBack, onCreate }) {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  const canSend = recipient.trim() && message.trim();

  const handleSend = () => {
    if (!canSend) return;
    onCreate(recipient, message);

    setRecipient("");
    setMessage("");
  };

  return (
    <div className="screen">
      <div className="compose-header">
        <button onClick={onBack} className="close-button">
          ✕
        </button>
        <div className="compose-title">New Message</div>
      </div>

      <div className="content">
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginRight: 8 }}>To:</span>
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              color: "var(--text-primary)",
            }}
          />
        </div>
      </div>

      <div className="bottom-fixed">
        <div
          className="glass rounded-full message-input-bar"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 16px",
          }}
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="iMessage"
            style={{
              border: "none",
              background: "transparent",
              flex: 1,
              outline: "none",
              color: "var(--text-primary)",
            }}
          />

          <button
            onClick={handleSend}
            disabled={!canSend}
            style={{
              background: canSend ? "var(--accent)" : "gray",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              cursor: canSend ? "pointer" : "not-allowed",
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}

export default Compose;
