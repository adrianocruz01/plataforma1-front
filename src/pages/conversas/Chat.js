import Message from "@/components/Message";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Profile from "@/assets/images/profile.png";

const Chat = ({ selectedChat, fetchConversations }) => {
    const [chat, setChat] = useState([]);
    const containerRef = useRef(null);
    const [srcImage, setSrcImage] = useState("");

    useEffect(() => {
        fetchChat();
        setSrcImage(selectedChat.picture);
    }, [selectedChat]);

    const handleError = () => {
        setSrcImage("");
    };

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [chat]);

    const fetchChat = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/v1/conversation/${selectedChat.id}/messages?page&pageSize`,
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

    const enableHumanTalk = async () => {
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/chat-context/${
                    process.env.NEXT_PUBLIC_ASSISTANT_ID
                }/conversation/${
                    selectedChat.id
                }?enable=${!selectedChat.humanTalk}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GM_TOKEN}`,
                    },
                    maxBodyLength: Infinity,
                }
            );
        } catch {
            console.error("Erro ao alterar permissão:", error);
        }
    };

    const handleHumanTalk = () => {
        enableHumanTalk();
        fetchConversations();
    }

    return (
        <div className="max-h-screen flex flex-col w-full">
            <div className="px-4 pb-4 flex gap-4 border-b items-center">
                <Image
                    src={srcImage ? srcImage : Profile}
                    width={56}
                    height={56}
                    className="rounded-full max-h-14 max-w-14"
                    alt="profile"
                    onError={handleError}
                />
                <div className="flex flex-col">
                    <div className="text-xl font-bold">
                        {selectedChat.name ?? "Desconhecido"}
                    </div>
                    <div className="text-sm">
                        {selectedChat.humanTalk
                            ? "Sendo atendido por um humano"
                            : "Sendo atendido pela Zury"}
                    </div>
                </div>
                <button onClick={handleHumanTalk} className="hidden">
                    {selectedChat.humanTalk
                        ? "Voltar atendimento para a Zury"
                        : "Assumir a conversa"}
                </button>
            </div>
            <div
                ref={containerRef}
                className="flex flex-col h-auto w-full overflow-y-scroll overflow-x-hidden scrollbar-thin"
            >
                <div className="flex gap-5 mb-6 flex-col w-full">
                    <div className="flex flex-col w-full gap-4 p-4">
                        {chat.map((message, index) => (
                            <Message message={message} key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
