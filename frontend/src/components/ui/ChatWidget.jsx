import { useEffect, useRef, useState } from "react";
import { widgetApi } from "../../lib/api";

const WIDGET_SESSION_KEY = "velora_widget_session";

const GREETING = {
  role: "assistant",
  text: "Hi! I'm Velora AI — your print consultant. Ask me anything about our products, turnaround times, pricing, or file preparation. What are you working on?",
};

const QUICK_QUESTIONS = [
  "What products do you offer?",
  "How long does printing take?",
  "What file format do I need?",
  "Do you do rush orders?",
];

function getOrCreateSession() {
  let id = sessionStorage.getItem(WIDGET_SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(WIDGET_SESSION_KEY, id);
  }
  return id;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(getOrCreateSession);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 140);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    // Capture history before adding the new user message — React state update is async.
    // Cap at last 12 messages (6 exchanges) to stay within Groq token limits.
    const history = messages.slice(-12).map((m) => ({ role: m.role, content: m.text }));
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const res = await widgetApi.send(msg, sessionId, history);
      const reply = res?.data?.response ?? "Sorry, something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong. Email us at admin@velorastudio.in and we'll get right back to you." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  const showQuickQuestions = messages.length === 1 && !loading;

  return (
    <>
      {/* Trigger — only shown when panel is closed */}
      {!open && (
        <button
          className="cw-trigger"
          onClick={() => setOpen(true)}
          aria-label="Chat with Velora AI"
        >
          <span className="cw-trigger-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={22} height={22}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </span>
          <span className="cw-trigger-label">Chat with us</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="cw-panel" role="dialog" aria-label="Velora AI Chat">

          {/* Header */}
          <div className="cw-header">
            <div className="cw-header-left">
              <div className="cw-header-avatar">
                <svg viewBox="0 0 20 20" fill="currentColor" width={18} height={18}>
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="cw-header-info">
                <span className="cw-header-name">Velora AI</span>
                <span className="cw-header-sub">
                  <span className="cw-status-dot" />
                  Print consultant · Online
                </span>
              </div>
            </div>
            <button className="cw-close" onClick={() => setOpen(false)} aria-label="Close">
              <svg viewBox="0 0 20 20" fill="currentColor" width={16} height={16}>
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="cw-messages">
            {messages.map((m, i) => (
              <div key={i} className={`cw-bubble-wrap ${m.role === "user" ? "cw-wrap-user" : "cw-wrap-ai"}`}>
                <div className={`cw-bubble ${m.role === "user" ? "cw-bubble-user" : "cw-bubble-ai"}`}>
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="cw-bubble-wrap cw-wrap-ai">
                <div className="cw-bubble cw-bubble-ai cw-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {showQuickQuestions && (
              <div className="cw-quick">
                <p className="cw-quick-label">Suggested questions</p>
                <div className="cw-quick-grid">
                  {QUICK_QUESTIONS.map((q) => (
                    <button key={q} className="cw-quick-btn" onClick={() => send(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="cw-input-area">
            <input
              ref={inputRef}
              className="cw-input"
              placeholder="Ask anything about printing…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button
              className="cw-send"
              onClick={() => send()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width={16} height={16}>
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>

          <div className="cw-footer">VELORA STUDIO · admin@velorastudio.in</div>
        </div>
      )}
    </>
  );
}
