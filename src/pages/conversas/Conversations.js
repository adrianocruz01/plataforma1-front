import Conversation from "@/components/Conversation";
import { useEffect, useState } from "react";

const Conversations = ({ onSelectedChat }) => {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/assistant/${process.env.NEXT_PUBLIC_ASSISTANT_ID}/conversations?page&pageSize&query&channelType`,
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
        <div className="flex flex-col h-auto min-w-96 overflow-y-scroll overflow-x-hidden">
            <div className="flex gap-5 mb-6 flex-col w-full">
                <div className="flex flex-col w-full">
                    {conversations.map((conversation) => {
                        return (
                            <div
                                onClick={() => onSelectedChat(conversation.id, conversation.name)}
                                key={conversation.id}
                            >
                                <Conversation
                                    src={conversation.picture}
                                    name={conversation.name}
                                    lastMessage={conversation.conversation}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Conversations;
