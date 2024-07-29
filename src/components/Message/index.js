import Image from "next/image";
import React from "react";

const Message = ({ message }) => {
    const isAssistant = message.role === "assistant";
    return (
        <div className={`relative max-w-[340px] w-fit p-3 md:p-5 flex gap-3 shadow-lg flex-col text-white break-words ${isAssistant ? 'bg-cyan-600 ml-auto rounded-t-xl rounded-bl-xl' : 'bg-zinc-400 rounded-t-xl rounded-br-xl'}`}>
            {message.audioUrl ? (
                <div className="flex flex-col gap-4">
                    <audio controls className="max-w-full">
                        <source src={message.audioUrl} type="audio/ogg" />
                        Your browser does not support the audio element.
                    </audio>
                    <p>{message.midiaContent}</p>
                </div>
            ) : (
                ""
            )}
            {message.text ? <p>{message.text}</p> : ""}
            {message.imageUrl ? (
                <div className="flex flex-col gap-4">
                    <Image
                        src={message.imageUrl}
                        width={256}
                        height={705}
                        className="h-auto max-w-64 rounded-lg"
                        alt={message.midiaContent}
                    />
                    <p>{message.midiaContent}</p>
                </div>
            ) : (
                ""
            )}
            <div className={`absolute -bottom-2 ${isAssistant ? '-right-2 border-l-8 border-l-transparent border-y-8 border-y-transparent border-r-8 border-r-cyan-600 -rotate-45' : '-left-2 border-r-8 border-r-transparent border-y-8 border-y-transparent border-l-8 border-l-zinc-400 rotate-45'}`}></div>
        </div>
    );
};

export default Message;
