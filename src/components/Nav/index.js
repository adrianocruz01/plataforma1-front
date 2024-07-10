import Image from "next/image";
import Link from "next/link";
import Logo from "../../assets/images/logo.png";
import LogoQuadrado from "../../assets/images/logo-quadrado.png";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useState, useEffect } from "react";

const Nav = ({ page }) => {
    const [menu, setMenu] = useState(false);
    const [assistants, setAssistants] = useState([]);

    const handleMenu = () => {
        setMenu(!menu);
    };
    const active = "text-sky-700 bg-sky-50 hover:bg-sky-100";
    const inactive = "text-neutral-700 hover:bg-neutral-200";

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
            console.log(data)
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        }
    };


    return (
        <nav className="bg-neutral-50 shadow-xl border-r border-neutral-100 flex flex-col relative">
            <div className="flex md:mb-10 md:px-8 md:pt-8 md:pb-0 p-6">
                <Link href="/" className="flex">
                    <Image
                        src={LogoQuadrado}
                        height={30}
                        width={30}
                        className="mr-2 rounded"
                        alt="Logo quadrado Zury"
                    />
                    <Image src={Logo} height={30} width={95} alt="Logo Zury" />
                </Link>
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
                {assistants?.map((assistant, index) => {
                    if (assistant.id === process.env.NEXT_PUBLIC_ASSISTANT_ID) {
                        return (
                            <div key={index} className="border-y border-neutral-300 px-6 py-3">
                                <h2 className="text-lg font-medium">
                                    {assistant.name}
                                </h2>
                                <h3 className="text-xs min-w-max">
                                    {assistant.supportFor}
                                </h3>
                            </div>
                        );
                    }
                })}
                <div className="p-8 flex flex-col gap-4">
                    <Link
                        href="/"
                        className={`flex items-center gap-2 transition-colors duration-200 px-3 py-2 text-sm rounded-lg ${
                            page === "home" ? active : inactive
                        }`}
                    >
                        <HomeOutlinedIcon fontSize="small" />
                        Home
                    </Link>
                    <Link
                        href="/treinamentos"
                        className={`flex items-center gap-2 transition-colors duration-200 px-3 py-2 text-sm rounded-lg ${
                            page === "treinamentos" ? active : inactive
                        }`}
                    >
                        <LightbulbOutlinedIcon fontSize="small" />
                        Treinamentos
                    </Link>
                    <Link
                        href="/configuracoes"
                        className={`flex items-center gap-2 transition-colors duration-200 px-3 py-2 text-sm rounded-lg ${
                            page === "configuracoes" ? active : inactive
                        }`}
                    >
                        <SettingsOutlinedIcon fontSize="small" />
                        Configurações
                    </Link>
                    <Link
                        href="/conexoes"
                        className={`flex items-center gap-2 transition-colors duration-200 px-3 py-2 text-sm rounded-lg ${
                            page === "conexoes" ? active : inactive
                        }`}
                    >
                        <WhatsAppIcon fontSize="small" />
                        Conexões
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
