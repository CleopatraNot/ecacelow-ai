import { useState, useRef, useEffect } from "react";

export default function EcacelowChat() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Halo! Aku Ecacelow, asisten AI kamu." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages([...newMessages, { role: "ai", content: "..." }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: "Kamu adalah Ecacelow, AI futuristik yang ramah dan pintar." },
            ...newMessages
          ]
        })
      });

      const data = await response.json();
      const aiReply = data.choices?.[0]?.message?.content || "Maaf, ada kesalahan.";
      setMessages([...newMessages, { role: "ai", content: aiReply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "ai", content: "Gagal menghubungi server AI." }]);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-black to-gray-900 min-h-screen text-white flex flex-col">
      <div className="p-4 text-xl font-semibold text-center border-b border-gray-800 shadow">
        Ecacelow AI
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "ai" ? "items-start" : "justify-end"}`}>
            {msg.role === "ai" && (
              <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold mr-2">E</div>
            )}
            <div
  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${
    msg.role === "ai" ? "bg-indigo-600 text-left" : "bg-gray-700 text-right"
  }`}
>
  {msg.content}
</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-800 bg-gray-950 flex gap-2">
        <input
          type="text"
          className="flex-1 bg-gray-800 text-white p-3 rounded-xl focus:outline-none"
          placeholder="Tulis pesan ke Ecacelow..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-indigo-600 px-5 py-3 rounded-xl hover:bg-indigo-500 disabled:opacity-50"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}
