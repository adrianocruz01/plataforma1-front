import Nav from "@/components/Nav";
import Conversations from "./Conversations";
import { useEffect, useState } from "react";
import Chat from "./Chat";

const ChatsPage = () => {
    const [selectedChat, setSelectedChat] = useState({});
    const [conversations, setConversations] = useState([])
    
    useEffect(() => {
        fetchConversations();
    }, []);

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
    };

    const fetchConversations = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/v1/assistant/${process.env.NEXT_PUBLIC_ASSISTANT_ID}/conversations?page&pageSize&query&channelType`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
                    },
                    maxBodyLength: Infinity,
                }
            );
            const data = await response.json();
            setConversations(data);
        } catch (error) {
            console.error("Erro ao buscar conversas:", error);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row">
            <Nav page="conversas" />
            <div className="px-6 md:px-10 w-full">
                <h1 className="text-3xl font-bold mt-16 mb-8">Conversas</h1>
                <div className="max-w-5xl">
                    <div className="bg-white rounded-2xl shadow-lg p-8 flex max-h-screen mb-9">
                        <Conversations onSelectedChat={handleChatSelect} conversations={conversations} />
                        {selectedChat.id && (
                            <Chat selectedChat={selectedChat} fetchConversations={fetchConversations} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatsPage;
