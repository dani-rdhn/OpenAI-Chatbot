"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "bot"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [model, setModel] = useState("gpt-5-nano"); // Default model
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user" as const, content: message };

    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    
    resetTextarea();

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          model,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        { role: "bot", content: data.reply || "Error: No response" },
      ]);
    } catch (err) {
      console.error(err);
      setChat((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, there was an error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  return (
    <div className={`${darkMode ? "dark" : ""} h-screen`}>
      <div className="flex h-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Left Sidebar */}
        <aside className="hidden md:block w-64 border-r bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">Settings</h2>
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:opacity-80 text-sm"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Model Selector */}
          <label className="block mb-1 text-sm font-medium">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full border rounded-md p-2 text-sm dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="gpt-4o-mini">gpt-4o-mini (fast, cheaper)</option>
            <option value="gpt-5-nano">gpt-5-nano (fast, cheaper)</option>
            <option value="gpt-5-mini">gpt-5-mini (more capable)</option>
          </select>
        </aside>

        {/* Chat Section */}
        <div className="flex flex-col flex-1">
          <div className="md:hidden border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-2 flex justify-between items-center">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="border rounded-md p-1 text-sm dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="gpt-4o-mini">gpt-4o-mini</option>
              <option value="gpt-5-nano">gpt-5-nano</option>
              <option value="gpt-5-mini">gpt-5-mini</option>
            </select>
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="ml-2 px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:opacity-80 text-sm"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-4 py-2 rounded-lg max-w-[75%] text-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-lg text-sm">
                  Thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                className="flex-1 resize-none border rounded-lg p-2 text-sm max-h-40 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Type your message..."
                rows={1}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  resetTextarea();
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}