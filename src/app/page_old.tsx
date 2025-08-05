/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Header from "./components/header";
import { Message } from "./models/message";
import MessageItem from "./components/message_item";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Bonjour, comment puis-je t'aider ?" },
  ]);
  const [message, setMessage] = useState({ content: "" });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Appel API vers ton backend ou OpenAI directement
    const newMessages: Message[] = messages
    newMessages.push({
      id: uuidv4(),
      role: "user",
      content: message.content
    })
    try {
      const res = await fetch("http://127.0.0.1:8000/openia/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      if (!res.ok) {
        // gestion des erreurs HTTP (ex : 401, 500)
        const errorData = await res.json();
        throw new Error(errorData?.error || "Erreur API");
      }

      const data = await res.json();

      newMessages.push({
        id: uuidv4(),
        role: "assistant",
        content: data.choices[0].message.content
      })

      setMessages(newMessages);

      setMessage({ ...message, content: "" });
    } catch (err: any) {
      console.error("Erreur lors de l'appel API :", err.message);
    }
  };

  return (
    <div className=" ">
      <Header />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center border-1 border-solid border-black min-h-screen flex flex-col w-[1250px]
      p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] h-[calc(100vh-64px)] items-start w-full flex-1">
          <div className="h-full flex flex-col">
            <div className="w-full overflow-y-auto">
              {messages && (
                <div className="mt-6 rounded w-full">
                  {messages.map(message => <MessageItem key={message.id} message={message} />)}
                </div>
              )}
            </div>
          </div>
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center bg-gray-500 w-full p-5">
          <form onSubmit={handleSubmit} className="flex flex-row gap-4 w-full">
            <input
              type="text"
              placeholder="Tape ton message ici..."
              value={message.content}
              onChange={(e) => setMessage({ ...message, content: e.target.value })}
              className="border rounded px-4 py-2 text-sm w-11/12 bg-white"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 w-1/12"
            >
              Envoyer
            </button>
          </form>
        </footer>
      </div></div>
  );
}
