import { useState, useRef, useEffect } from "react";
import { chatApi } from "../../../lib/api";

const GREETING =
  "Hi! I'm Aayu AI, your print consultant here at Aayu Printing Studio. " +
  "Whether you're planning business cards, packaging, labels, or a full brand launch — " +
  "I can help you choose the right product, finish, and specs. What are you working on?";

const SUGGESTED = [
  "What's the best business card finish for a luxury brand?",
  "How do I prepare my file for printing?",
  "What's the difference between matte and soft touch lamination?",
  "How long does packaging take to produce?",
  "What GSM should I choose for premium business cards?",
  "Do you do rush orders?",
];

export default function ChatPanel() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionId = useRef(crypto.randomUUID());
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const res = await chatApi.send(msg, sessionId.current);
      const reply = res?.data?.response ?? "Sorry, I couldn't get a response right now.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong connecting to the AI. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const showSuggestions = messages.length === 1 && !loading;

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg chat-msg--${m.role}`}>
            {m.role === "assistant" && <div className="chat-avatar">✦</div>}
            <div className={`chat-bubble chat-bubble--${m.role}`}>{m.text}</div>
          </div>
        ))}

        {loading && (
          <div className="chat-msg chat-msg--assistant">
            <div className="chat-avatar">✦</div>
            <div className="chat-bubble chat-bubble--assistant">
              <div className="typing-indicator">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}

        {showSuggestions && (
          <div className="chat-suggestions">
            {SUGGESTED.map((s) => (
              <button key={s} className="chat-suggestion-chip" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <textarea
          className="chat-input"
          placeholder="Ask the print assistant anything…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          disabled={loading}
        />
        <button
          className="chat-send-btn"
          onClick={() => send()}
          disabled={loading || !input.trim()}
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
