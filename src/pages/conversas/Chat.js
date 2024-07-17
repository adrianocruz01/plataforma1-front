import Image from "next/image";
import { useEffect, useState } from "react";

const Chat = ({ chatID }) => {
    const [chat, setChat] = useState([]);

    useEffect(() => {
        fetchChat();
    }, [chatID]);

    const fetchChat = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/conversation/${chatID}/messages?page&pageSize`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
                    },
                    maxBodyLength: Infinity,
                }
            );
            const data = await response.json();
            setChat(data);
        } catch (error) {
            console.error("Erro ao buscar chat:", error);
        }
    };

    return (
        <div className="flex flex-col h-auto w-full overflow-y-scroll overflow-x-hidden">
            <div className="flex gap-5 mb-6 flex-col w-full">
                <div className="flex flex-col w-full gap-4 p-4">
                    {chat.map((message) => {
                        return (
                            <div
                                className={`${
                                    message.role === "assistant"
                                        ? "bg-cyan-600 ml-auto"
                                        : "bg-zinc-400"
                                } w-[348px] p-6 flex gap-3 rounded-xl shadow-lg flex-col`}
                            >
                                {message.audios.length ? (
                                    <div className="flex flex-col gap-4">
                                        <audio controls>
                                            <source
                                                src={message.audios[0]}
                                                type="audio/ogg"
                                            />
                                            Your browser does not support the
                                            audio element.
                                        </audio>
                                        <p>{message.midiaContent}</p>
                                    </div>
                                ) : (
                                    ""
                                )}
                                {message.content ? (
                                    <p >{message.content}</p>
                                ) : (
                                    ""
                                )}
                                {message.images.length ? (
                                    <div className="flex flex-col gap-4">
                                        <Image
                                            src={message.images[0]}
                                            width={256}
                                            height={705}
                                            className="h-auto max-w-64 rounded-lg"
                                        />
                                        <p>{message.midiaContent}</p>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Chat;
