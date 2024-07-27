import Image from "next/image";
import Link from "next/link";
import Logo from "../../assets/images/logo.png";
import LogoQuadrado from "../../assets/images/logo-quadrado.png";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState, useEffect } from "react";

const Nav = ({ page }) => {
    const [menu, setMenu] = useState(false);
    const [assistant, setAssistant] = useState({
        name: '',
        supportFor: '',
        avatar: ''
    });
    const [assistants, setAssistants] = useState([]);

    useEffect(() => {
        fetchAssistants();
    }, []);

    const fetchAssistants = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/workspace/${process.env.NEXT_PUBLIC_WORKSPACE_ID}/assistants?page=1&pageSize=150&query=`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
                    },
                    maxBodyLength: Infinity,
                }
            );
            const data = await response.json();
            setAssistants(data.data);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        }
    };

    const handleMenu = () => {
        setMenu(!menu);
    };

    const active = "text-sky-700 bg-sky-50 hover:bg-sky-100";
    const inactive = "text-neutral-700 hover:bg-neutral-200";

    useEffect(() => {
        if (typeof window !== "undefined") {
            const name = localStorage.getItem("name");
            const supportFor = localStorage.getItem("supportFor");
            const avatar = localStorage.getItem("avatar");

            if (name && supportFor && avatar) {
                setAssistant({ name, supportFor, avatar });
            } else {
                fetchAssistant();
            }
        }
    }, []);

    const fetchAssistant = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASEURL}/workspace/${process.env.NEXT_PUBLIC_WORKSPACE_ID}/assistants?page=1&pageSize=150&query=`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
                    },
                    maxBodyLength: Infinity,
                }
            );
            const data = await response.json();
            const selectedAssistant = data.data.find(
                assistant => assistant.id === process.env.NEXT_PUBLIC_ASSISTANT_ID
            );
            if (selectedAssistant) {
                const { name, supportFor, avatar } = selectedAssistant;
                localStorage.setItem("name", name);
                localStorage.setItem("supportFor", supportFor);
                localStorage.setItem("avatar", avatar);
                setAssistant({ name, supportFor, avatar });
            }
        } catch (error) {
            console.error("Erro ao buscar assistente:", error);
        }
    };

    return (
        <nav className="bg-neutral-50 shadow-xl border-r border-neutral-100 flex flex-col relative">
            <div className="flex md:mb-10 md:px-8 md:pt-8 md:pb-0 p-6">
                <div className="flex min-w-max">
                    <Image
                        src={LogoQuadrado}
                        height={30}
                        width={30}
                        className="mr-2 rounded"
                        alt="Logo quadrado Zury"
                    />
                    <Image src={Logo} height={30} width={95} alt="Logo Zury" />
                </div>
                <button
                    className="self-center ml-auto md:hidden"
                    onClick={handleMenu}
                >
                    <MenuOutlinedIcon />
                </button>
            </div>
            <div
                className={`absolute md:static bg-neutral-50 top-full w-full ${
                    menu ? "left-0" : "-left-full"
                }`}
            >
                {assistant.name && (
                    <div className="border-y border-neutral-300 px-6 py-3 flex items-center gap-2">
                        <div>
                            <AccountCircleIcon fontSize="large" />
                        </div>
                        <div>
                            <h2 className="text-base font-medium">
                                {assistant.name}
                            </h2>
                            <h3 className="text-xs min-w-max">
                                {assistant.supportFor}
                            </h3>
                        </div>
                    </div>
                )}
                <div className="py-8 flex flex-col gap-4">
                    <Link
                        href="/"
                        className={`flex items-center gap-2 transition-colors duration-200 px-3 py-2 text-md rounded-lg ${
                            page === "home" ? active : inactive
                        }`}
                    >
                        <span>🕹️</span> Playground
                    </Link>
                    <Link
                        href="/treinamentos?tab=3"
                        className={`flex items-center gap-2 transition-colors duration-200 px-3 py-2 text-md rounded-lg ${
                            page === "treinamentos" ? active : inactive
                        }`}
                    >
                        <span>👨🏻‍🏫</span> Biblioteca
                    </Link>
                    <Link
                        href="/conversas"
                        className={`flex items-center gap-2 transition-colors duration-200 px-3 py-2 text-md rounded-lg ${
                            page === "conversas" ? active : inactive
                        }`}
                    >
                        <span>💬</span> Ver conversas
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
