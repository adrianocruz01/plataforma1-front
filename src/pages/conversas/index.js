import Nav from "@/components/Nav";
import Conversations from "./Conversations";
import { useEffect, useState } from "react";
import Chat from "./Chat";

const ChatsPage = () => {
    const [selectedChat, setSelectedChat] = useState({});
    const [conversations, setConversations] = useState([]);
    const [chatIsOpen, setChatIsOpen] = useState(false);

    useEffect(() => {
        fetchConversations();
    }, []);

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
    };

    const fetchConversations = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/chats/workspace/${process.env.NEXT_PUBLIC_WORKSPACE_ID}?agentId=${process.env.NEXT_PUBLIC_ASSISTANT_ID}&page=1&pageSize=1000000000`,
                {
                    method: "GET",
                }
            );
            const data = await response.json();
            setConversations(data);
        } catch (error) {
            console.error("Erro ao buscar conversas:", error);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row lg:pl-20">
            <div className="px-4 md:px-10 w-full">
                <h1 className="text-3xl font-bold md:mt-16 mt-12 ml-4 mb-8 audiowide text-white">Conversas</h1>
                <div className="max-w-5xl">
                    <div className={`bg-neutral-700 rounded-2xl shadow-lg md:p-8 py-5 ${chatIsOpen ? "pl-0" : "pl-5"} flex max-h-[calc(100vh-168px)] mb-9`}>
                        <Conversations
                            onSelectedChat={handleChatSelect}
                            conversations={conversations}
                            chatIsOpen={chatIsOpen}
                            setChatIsOpen={setChatIsOpen}
                        />
                        {selectedChat.id && (
                            <Chat
                                selectedChat={selectedChat}
                                fetchConversations={fetchConversations}
                                chatIsOpen={chatIsOpen}
                                setChatIsOpen={setChatIsOpen}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatsPage;
