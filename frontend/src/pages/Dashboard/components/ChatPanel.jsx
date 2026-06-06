import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
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

function getStoredSession() { return localStorage.getItem(SESSION_KEY) || null; }
function newSession() {
  const id = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, id);
  return id;
}

// Send icon SVG
const SendIcon = ({ spinning }) => spinning ? (
  <svg className="chat-send-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-9H21M3 12H2m15.07-7.07l-.71.71M7.64 16.36l-.71.71M19.07 19.07l-.71-.71M7.64 7.64l-.71-.71" />
  </svg>
) : (
  <svg viewBox="0 0 20 20" fill="currentColor" width={16} height={16}>
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);

export default function ChatPanel() {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const sessionId = useRef(getStoredSession() || newSession());
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Load previous history on mount
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
      .finally(() => {
        setHistoryLoading(false);
        // Auto-focus after history loads
        setTimeout(() => inputRef.current?.focus(), 80);
      });
  }, []);

  // Scroll to bottom on new messages
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
      const errText = "Something went wrong connecting to the AI. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", text: errText }]);
      toast.error("AI response failed", { description: "Check your connection and try again." });
    } finally {
      setLoading(false);
      // Re-focus input after response
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }

  function startNewChat() {
    sessionId.current = newSession();
    setMessages([GREETING]);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 60);
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
      <div className="chat-panel chat-panel--loading">
        <div className="chat-skeleton">
          {[72, 55, 85, 48].map((w, i) => (
            <div key={i} className={`chat-skeleton-line ${i % 2 === 1 ? "chat-skeleton-line--right" : ""}`} style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="chat-loading-text">Loading conversation…</div>
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
            <div>
              <div className="chat-bubble chat-bubble--assistant">
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
              <div className="chat-thinking-text">AI is thinking…</div>
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
          ref={inputRef}
          className="chat-input"
          placeholder="Ask the print assistant anything…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          disabled={loading}
        />
        <button
          className={`chat-send-btn ${loading ? "chat-send-btn--loading" : ""}`}
          onClick={() => send()}
          disabled={loading || !input.trim()}
          aria-label="Send message"
          title={loading ? "Sending…" : "Send (Enter)"}
        >
          <SendIcon spinning={loading} />
        </button>
        <button className="chat-new-btn" onClick={startNewChat} title="Start new chat">
          ✕ New
        </button>
      </div>
    </div>
  );
}
