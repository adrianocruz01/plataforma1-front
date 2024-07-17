import Nav from "@/components/Nav";
import Conversations from "./Conversations";
import { useState } from "react";
import Chat from "./Chat";

const ChatsPage = () => {
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [selectedChatName, setSelectedChatName] = useState("");

    const handleChatSelect = (chatId, chatName) => {
        setSelectedChatId(chatId);
        setSelectedChatName(chatName);
    };

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row">
            <div></div>
            <Nav page="conversas" />
            <div className="px-6 md:px-10 w-full">
                <h1 className="text-3xl font-bold mt-16 mb-8">Conversas</h1>
                <div className="max-w-5xl">
                    <div className="bg-white rounded-2xl shadow-lg p-8 flex max-h-screen mb-9">
                        <Conversations onSelectedChat={handleChatSelect} />
                        {selectedChatId && (
                            <div className="max-h-screen flex flex-col w-full">
                                <div className="text-3xl font-bold ml-4 mb-6">{selectedChatName ?? 'Desconhecido'}</div>
                                <Chat chatID={selectedChatId} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatsPage;
