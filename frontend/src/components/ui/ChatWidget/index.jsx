import { useState, useRef, useEffect, useCallback } from "react";
import request from "../../../lib/apiClient";
import "./style.css";

const WA_NUMBER = import.meta.env.VITE_WA_NUMBER || "915468427200";
const WA_URL = `https://wa.me/${WA_NUMBER}`;
const MAX_HISTORY = 6;

const QUICK_CHIPS = [
  "What can I order?",
  "How long is delivery?",
  "How do I place an order?",
];

const GREETING = {
  id: "greeting",
  role: "ai",
  text: "Hi! I'm Velora AI — ask me anything about our apparel, gifts, sizes, or how to order. What are you looking for?",
  showWa: false,
};

function WaCta() {
  return (
    <a
      href={WA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="cw-wa-cta"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Chat on WhatsApp
    </a>
  );
}

function Bubble({ msg }) {
  if (msg.role === "typing") {
    return (
      <div className="cw-typing" aria-label="Velora AI is typing">
        <span /><span /><span />
      </div>
    );
  }
  return (
    <div className={`cw-bubble cw-bubble--${msg.role === "error" ? "error" : msg.role === "ai" ? "ai" : "user"}`}>
      {msg.text}
      {msg.showWa && <><br /><WaCta /></>}
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState("");
  const [msgs, setMsgs]       = useState([GREETING]);
  const [loading, setLoading] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const historyForApi = useCallback(() => {
    return msgs
      .filter((m) => m.role === "user" || m.role === "ai")
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));
  }, [msgs]);

  const send = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setChipsVisible(false);
    setInput("");
    setMsgs((prev) => [...prev, { id: Date.now(), role: "user", text: trimmed }]);
    setLoading(true);
    setMsgs((prev) => [...prev, { id: "typing", role: "typing" }]);

    try {
      const json = await request("/chat/widget", {
        method: "POST",
        body: JSON.stringify({
          message: trimmed,
          history: historyForApi(),
        }),
      });

      const reply = json?.data?.response || "I'm not sure about that — try asking the team on WhatsApp.";
      const showWa = reply.toLowerCase().includes("whatsapp") || reply.toLowerCase().includes("contact");

      setMsgs((prev) => [
        ...prev.filter((m) => m.id !== "typing"),
        { id: Date.now() + 1, role: "ai", text: reply, showWa },
      ]);
    } catch (err) {
      setMsgs((prev) => [
        ...prev.filter((m) => m.id !== "typing"),
        {
          id: Date.now() + 1,
          role: "error",
          text: err.message || "Couldn't reach the assistant right now.",
          showWa: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, historyForApi]);

  const handleSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <>
      {/* Floating action button */}
      <button
        type="button"
        className="cw-fab"
        aria-label={open ? "Close chat" : "Open Velora AI chat"}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="cw-panel" role="dialog" aria-label="Velora AI chat">

          {/* Header */}
          <div className="cw-header">
            <div className="cw-header__avatar" aria-hidden="true">✦</div>
            <div className="cw-header__info">
              <div className="cw-header__name">Velora AI</div>
              <div className="cw-header__sub">Your personal style guide</div>
            </div>
            <button
              type="button"
              className="cw-header__close"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="cw-messages" aria-live="polite" aria-atomic="false">
            {msgs.map((m) => (
              <Bubble key={m.id} msg={m} />
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick chips — shown until first user message */}
          {chipsVisible && (
            <div className="cw-chips">
              {QUICK_CHIPS.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="cw-chip"
                  onClick={() => send(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input form */}
          <form className="cw-form" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              className="cw-input"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything…"
              maxLength={1000}
              aria-label="Message"
              disabled={loading}
            />
            <button
              type="submit"
              className="cw-send"
              aria-label="Send message"
              disabled={loading || !input.trim()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>

        </div>
      )}
    </>
  );
}
