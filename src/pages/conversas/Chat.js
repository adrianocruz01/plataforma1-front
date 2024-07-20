import Message from "@/components/Message";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Profile from "@/assets/images/profile.png";

const Chat = ({ selectedChat, fetchConversations }) => {
    const containerRef = useRef(null);
    const [chat, setChat] = useState([]);
    const [srcImage, setSrcImage] = useState("");
    const [humanTalk, setHumanTalk] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        fetchChat();
        setSrcImage(selectedChat.picture);
        setHumanTalk(selectedChat.humanTalk);
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
                }/conversation/${selectedChat.id}?enable=${!humanTalk}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GM_TOKEN}`,
                    },
                    maxBodyLength: Infinity,
                }
            );
            fetchConversations();
        } catch (error) {
            console.error("Erro ao alterar permissão:", error);
        }
    };

    const sendMessage = async (newMessage) => {
        if (!newMessage) return;
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/chat-context/${process.env.NEXT_PUBLIC_ASSISTANT_ID}/conversation/${selectedChat.id}/reply`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GM_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: newMessage,
                    }),
                }
            );
            console.log(newMessage);
            fetchChat();
            setNewMessage("");
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    };

    const handleHumanTalk = () => {
        setHumanTalk(!humanTalk);
        enableHumanTalk();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage(newMessage);
        }
    };

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
                        {humanTalk
                            ? "Sendo atendido por um humano"
                            : "Sendo atendido pela Zury"}
                    </div>
                </div>
                <button
                    onClick={handleHumanTalk}
                    className={`ml-auto text-sm font-light p-2 rounded-full text-white ${
                        humanTalk ? "bg-teal-600" : "bg-amber-600"
                    }`}
                >
                    {humanTalk
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
            <div className={`w-full p-4 ${humanTalk ? "block" : "hidden"}`}>
                <textarea
                    wrap="hard"
                    rows="3"
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    placeholder="Escreva a mensagem e tecle ENTER"
                    className="rounded-md p-3 focus-visible:outline-none border border-neutral-100 focus-visible:border-neutral-300 w-full"
                />
            </div>
        </div>
    );
};

export default Chat;
