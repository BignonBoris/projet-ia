"use client";

import { Message } from "../models/message";

export default function MessageItem(props: { message: Message }) {
    const { message } = props
    return (
        <p key={message.id} className={`border-l-solid border-l-4 py-3 px-4 text-sm mt-4 ${message.role == "user" ? "border-cyan-500 bg-cyan-100" : "border-red-500 bg-red-100"}`}>
            {/* <strong>{message.role.toLocaleUpperCase()} :</strong>  */}
            {message.content}
        </p>
    );
}
