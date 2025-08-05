/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Header from "./components/header";
import { Message } from "./models/message";
import MessageItem from "./components/message_item";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState(""); 
  const [loadResponse, setLoadResponse] = useState(false);

  const base_url_online = "https://fastapi-ia-74eo.onrender.com/groq";
  //const base_url_local = "http://127.0.0.1:8000/groq";

  const showIAOverwiew = async () => {
    try {
      console.log(`${base_url_online}/overview`)
      const res = await fetch(`${base_url_online}/overview`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        // gestion des erreurs HTTP (ex : 401, 500)
        const errorData = await res.json();
        console.log(errorData?.error || "Erreur API");
        throw new Error(errorData?.error || "Erreur API");
      }

      setMessages([ 
        { id: "1", role: "assistant", content: (await res.json()).replace(/\\n/g, "\n") },
      ]); 

    } catch (err: any) {
      console.log("Erreur lors de l'appel API :", err.message);
    }
  } 

  useEffect(() => {
    showIAOverwiew()
  },[]);

  const handleSubmit = async (e: React.FormEvent) => { 
      e.preventDefault();
      // Appel API vers ton backend ou OpenAI directement
      const newMessages: Message[] = messages ;
      newMessages.push({ id: uuidv4(), role: "user", content: message  })
      setMessage( "" );
      setMessages(newMessages)

      setTimeout(() => {setLoadResponse(true)} , 1000);

      try {
        console.log(`${base_url_online}/test`)
        const res = await fetch(`${base_url_online}/test`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({message}),
        });

        if (!res.ok) {
          // gestion des erreurs HTTP (ex : 401, 500)
          const errorData = await res.json();
          console.log(errorData?.error || "Erreur API");
          throw new Error(errorData?.error || "Erreur API");
        }

        const data = await res.json();

        newMessages.push({
          id: uuidv4(),
          role: "assistant",
          content: data.replace(/\\n/g, "\n") 
        })
        setLoadResponse(false)
        setMessages(newMessages);

      } catch (err: any) {
        console.log("Erreur lors de l'appel API :", err.message);
      } 
  };

  return (
    <div className="h-screen flex flex-col w-[1150px]">
      <Header />
      <main className="h-[calc(100vh-64px)] bg-gray-100 p-4">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-2">
            {/* Zone scrollable */}
            {messages && (
              <div className="mt-6 rounded w-full">
                {messages.map(message => <MessageItem key={message.id} message={message} />)}
              </div>
            )}
            {loadResponse && <MessageItem key="000" message={new Message()} />}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input
              type="text" 
              value={message}
              onChange={(e) => setMessage(  e.target.value )}
              className="flex-1 border px-4 py-2 rounded !h-12"
              placeholder="Tape ton message..."
              required 
              onKeyDown={(e) => {
                if ((e.key === "Enter") && (message && message.length == 0)) {
                  e.preventDefault(); // empêche le submit
                }
              }}
            />
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!(message.length > 0)}
            >
              Envoyer
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}