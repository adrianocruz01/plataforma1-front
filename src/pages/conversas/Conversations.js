import Conversation from "@/components/Conversation";
import { useEffect, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";

const Conversations = ({ onSelectedChat, conversations, chatIsOpen, setChatIsOpen }) => {
    const [groupedConversations, setGroupedConversations] = useState({});

    useEffect(() => {
        groupConversationsByDate();
    }, [conversations]);

    const groupConversationsByDate = () => {
        const grouped = conversations.reduce((acc, conversation) => {
            const date = new Date(conversation.time);
            const formattedDate = format(date, "dd/MM/yyyy");

            if (!acc[formattedDate]) {
                acc[formattedDate] = [];
            }
            acc[formattedDate].push(conversation);
            return acc;
        }, {});
        setGroupedConversations(grouped);
    };

    const getDateLabel = (date) => {
        const parsedDate = new Date(
            date.split("/").reverse().join("-") + " 00:00:00"
        );
        if (isToday(parsedDate)) {
            return "Hoje";
        } else if (isYesterday(parsedDate)) {
            return "Ontem";
        } else {
            return date;
        }
    };

    const handleChat = (conversation) => {
        onSelectedChat(conversation);
        setChatIsOpen(true);
    };

    return (
        <div
            className={`lg:flex flex-col h-auto lg:min-w-80 lg:max-w-96 w-full overflow-y-scroll overflow-x-hidden scrollbar-thin md:pr-0 pr-5 ${
                chatIsOpen ? "hidden" : "flex"
            }`}
        >
            {Object.keys(groupedConversations).map((date) => (
                <div key={date} className="mb-6">
                    <h2 className="text-md font-medium mb-2">
                        {getDateLabel(date)}
                    </h2>
                    <div className="flex gap-5 flex-col w-full">
                        {groupedConversations[date].map((conversation) => (
                            <div
                                onClick={() => handleChat(conversation)}
                                key={conversation.id}
                            >
                                <Conversation
                                    src={conversation.picture}
                                    name={conversation.name}
                                    lastMessage={conversation.conversation}
                                    type={conversation.conversationType}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Conversations;
