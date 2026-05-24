import { useState, useRef, useEffect } from "react";
import { chatApi } from "../../../lib/api";

const GREETING = {
  role: "assistant",
  text:
    "Hi! I'm Aayu AI, your print consultant here at Aayu Printing Studio. " +
    "Whether you're planning business cards, packaging, labels, or a full brand launch — " +
    "I can help you choose the right product, finish, and specs. What are you working on?",
};

const SUGGESTED = [
  "What's the best business card finish for a luxury brand?",
  "How do I prepare my file for printing?",
  "What's the difference between matte and soft touch lamination?",
  "How long does packaging take to produce?",
  "What GSM should I choose for premium business cards?",
  "Do you do rush orders?",
];

const SESSION_KEY = "aayu_chat_session";

function getStoredSession() {
  return localStorage.getItem(SESSION_KEY) || null;
}

function newSession() {
  const id = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, id);
  return id;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const sessionId = useRef(getStoredSession() || newSession());
  const bottomRef = useRef(null);

  // Load previous chat history on mount
  useEffect(() => {
    chatApi
      .getHistory(sessionId.current)
      .then((res) => {
        const history = res?.data ?? [];
        if (history.length > 0) {
          setMessages(history.map((m) => ({ role: m.role, text: m.content })));
        }
      })
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, []);

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
      const sources = res?.data?.sources ?? [];
      setMessages((prev) => [...prev, { role: "assistant", text: reply, sources }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong connecting to the AI. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function startNewChat() {
    sessionId.current = newSession();
    setMessages([GREETING]);
    setInput("");
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const showSuggestions = messages.length === 1 && !loading && !historyLoading;

  if (historyLoading) {
    return (
      <div className="chat-panel" style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--text-light)", fontSize: "0.88rem" }}>Loading conversation…</div>
      </div>
    );
  }

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg chat-msg--${m.role}`}>
            {m.role === "assistant" && <div className="chat-avatar">✦</div>}
            <div>
              <div className={`chat-bubble chat-bubble--${m.role}`}>{m.text}</div>
              {m.role === "assistant" && m.sources?.length > 0 && (
                <div className="chat-sources">
                  <span className="chat-sources-label">Source:</span>
                  {m.sources.map((s) => (
                    <span key={s} className="chat-source-chip">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-msg chat-msg--assistant">
            <div className="chat-avatar">✦</div>
            <div className="chat-bubble chat-bubble--assistant">
              <div className="typing-indicator">
                <span /><span /><span />
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
        <button className="chat-new-btn" onClick={startNewChat} title="Start new chat">
          ✕ New
        </button>
      </div>
    </div>
  );
}
