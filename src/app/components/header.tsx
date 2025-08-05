/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

export default function Header() {
    return (
        <div className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
                <h1 className="text-2xl font-bold text-blue-600">🧠 Mon Assistant IA</h1>

                <nav className="space-x-4 text-sm text-gray-700">
                    <a href="/" className="hover:text-blue-600 transition">Accueil</a>
                    <a href="/chat" className="hover:text-blue-600 transition">Chat</a>
                    <a href="/a-propos" className="hover:text-blue-600 transition">À propos</a>
                </nav>
            </div>
        </div>
    );
}