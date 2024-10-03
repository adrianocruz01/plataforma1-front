import Message from "@/components/Message";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Profile from "@/assets/images/profile.png";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";

const Chat = ({
    selectedChat,
    fetchConversations,
    chatIsOpen,
    setChatIsOpen,
}) => {
    const containerRef = useRef(null);
    const [chat, setChat] = useState([]);
    const [srcImage, setSrcImage] = useState("");
    const [humanTalk, setHumanTalk] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [rows, setRows] = useState(1);
    const [loading, setLoading] = useState(false);
    const pollingRef = useRef(null);

    const handleError = () => {
        setSrcImage("");
    };

    const fetchChat = useCallback(async () => {
        if (selectedChat?.id) {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASEURL}/chats/chat/${selectedChat?.id}/messages?page=1&pageSize=1000000000`,
                    {
                        method: "GET",
                    }
                );
                const data = await response.json();
                setChat(data);
            } catch (error) {
                console.error("Erro ao buscar chat:", error);
            }
        }
    }, [selectedChat?.id]);

    const startPolling = useCallback(() => {
        stopPolling();
        pollingRef.current = setInterval(fetchChat, 1000);
    }, [fetchChat]);

    const stopPolling = () => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    };

    useEffect(() => {
        const initializeChat = async () => {
            setLoading(true);
            setChat([]);
            setSrcImage(selectedChat.picture);
            setHumanTalk(selectedChat.humanTalk);
            await fetchChat();
            setLoading(false);
            startPolling();
        };

        initializeChat();

        return () => stopPolling();
    }, [selectedChat, fetchChat, startPolling]);

    useEffect(() => {
        if (containerRef.current && !loading) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [loading]);

    const enableHumanTalk = async () => {
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/chats/chat/${
                    selectedChat?.id
                }/${humanTalk ? "stop" : "start"}-human`,
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
                `${process.env.NEXT_PUBLIC_BASEURL}/chats/chat/${selectedChat?.id}/send-message`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: newMessage,
                    }),
                }
            );
            fetchChat();
            fetchConversations();
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

    const handleChange = (e) => {
        const previousRows = e.target.rows;
        e.target.rows = 1;

        const currentRows = Math.floor(e.target.scrollHeight / 24 - 1);

        if (currentRows === previousRows) {
            e.target.rows = currentRows;
        }

        setNewMessage(e.target.value);
        setRows(currentRows);
    };

    return (
        <div
            className={`lg:flex max-h-screen flex-col w-full ${
                chatIsOpen ? "flex" : "hidden"
            }`}
        >
            <div className="px-4 pb-4 flex flex-wrap flex-col lg:flex-row gap-4 items-center">
                <div className="flex self-start gap-4">
                    <button
                        onClick={() => setChatIsOpen(false)}
                        className="lg:hidden block -mr-3 text-white"
                    >
                        <ArrowBackIosNewOutlinedIcon fontSize="small" />
                    </button>
                    <div className="md:h-14 md:w-14 w-11 h-11 min-h-11 min-w-11 relative">
                        <Image
                            src={srcImage ? srcImage : Profile}
                            fill={true}
                            className="rounded-full"
                            alt="profile"
                            onError={handleError}
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="md:text-xl text-md font-bold text-neutral-50">
                            {selectedChat?.name ?? "Desconhecido"}
                        </div>
                        <div className="md:text-sm text-xs text-neutral-100">
                            {humanTalk
                                ? "Sendo atendido por um humano"
                                : "Sendo atendido pela Zury"}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col lg:ml-auto items-center font-medium text-sm">
                    <div className="text-neutral-50">Atendimento Zury</div>
                    <div className="flex items-center">
                        <label className="text-xs text-neutral-100">Desativar</label>
                        <Switch
                            onChange={handleHumanTalk}
                            checked={!humanTalk}
                            color="warning"
                        />
                        <label className="text-xs text-neutral-100">Ativar</label>
                    </div>
                </div>
            </div>
            <div
                ref={containerRef}
                className="flex flex-col h-auto w-full overflow-y-scroll overflow-x-hidden scrollbar-thin"
            >
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <CircularProgress />
                    </div>
                ) : (
                    <div className="flex gap-5 mb-6 flex-col w-full">
                        <div className="flex flex-col w-full gap-4 p-4">
                            {chat.map((message, index) => (
                                <Message message={message} key={index} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div
                className={`w-full hidden gap-2 p-4 ${
                    humanTalk ? "block" : "hidden"
                }`}
            >
                <textarea
                    wrap="hard"
                    rows={rows}
                    type="text"
                    value={newMessage}
                    onChange={(e) => handleChange(e)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    placeholder="Escreva a mensagem e tecle ENTER"
                    className="rounded-3xl p-3 focus-visible:outline-none border border-neutral-300 focus-visible:border-neutral-500 w-full scrollbar-hidden"
                />
                <button
                    onClick={() => sendMessage(newMessage)}
                    className="md:hidden block min-w-[50px] rounded-full bg-sky-700 text-white"
                >
                    <SendOutlinedIcon />
                </button>
            </div>
        </div>
    );
};

export default Chat;