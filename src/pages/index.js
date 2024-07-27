import WhatsApp from "@/assets/images/icone-conexao-wpp.png";
import Marketing from "@/assets/images/icone-marketing.png";
import CRM from "@/assets/images/icone-grafico-2.png";
import MidiasSociais from "@/assets/images/icone-ig-fb.png";
import Ligacoes from "@/assets/images/icone-telefone.png";
import Personalidade from "@/assets/images/icone-comportamento.png";
import SMS from "@/assets/images/icone-sms.png";
import TeConvida from "@/assets/images/icone-teconvida.png";
import Zury from "@/assets/images/botao-zury.png";
import Conversas from "@/assets/images/icone-mensagens.png";
import Biblioteca from "@/assets/images/icone-biblioteca.png";
import Card from "@/components/Card";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const HomePage = () => {
    const cards = [
        {
            slug: "treinamentos?tab=3",
            title: "Biblioteca",
            source: Biblioteca,
        },
        {
            slug: "comportamento",
            title: "Criar personalidade",
            source: Personalidade,
        },
        {
            slug: "treinamentos",
            title: "Ligações em massa",
            source: Ligacoes,
        },
        {
            slug: "treinamentos",
            title: "Sistema TeConvida",
            source: TeConvida,
        },
        {
            slug: "https://crm.zury.ai/login",
            title: "Plataforma CRM",
            source: CRM,
        },
        {
            slug: "treinamentos",
            title: "Conectar mídias sociais",
            source: MidiasSociais,
        },
        {
            slug: "treinamentos",
            title: "SMS em massa",
            source: SMS,
        },
        {
            slug: "treinamentos",
            title: "Plano de Marketing",
            source: Marketing,
        },
    ];

    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        handleResize(); // Set initial width
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const getStyle = (x, y) => {
        if (windowWidth >= 768) {
            return {
                transform: `translate(${x}px, ${y}px)`,
                position: "absolute",
                top: "calc(50% - 50px)",
                left: "calc(50% - 50px)",
            };
        } else {
            return {
                transform: "none",
                position: "relative",
                top: "auto",
                left: "auto",
                marginBottom: "20px",
            };
        }
    };

    const radius = 300;
    const angleStep = (2 * Math.PI) / cards.length;
    const [isHover, setIsHover] = useState(false);

    return (
        <div className="min-h-screen w-full bg-black flex flex-col md:flex-row">
            <div className="flex md:flex-col justify-center items-center p-8 gap-5 h-full">
                <Link href={"conexoes"}>
                    <Image src={WhatsApp} width={60} height={60} className="" />
                </Link>
                <Link href={"conversas"}>
                    <Image
                        src={Conversas}
                        width={60}
                        height={60}
                        className=""
                    />
                </Link>
            </div>
            <div className="relative h-full md:h-screen w-screen flex flex-col items-center justify-center">
                <div className="bg-zury md:w-[500px] md:h-[500px] w-full h-full flex items-center justify-center rounded-full">
                    <Link
                        href={"treinamentos?tab=0"}
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                        className="flex flex-col items-center justify-center relative"
                    >
                        <div className="relative w-[250px] h-[250px] hover:w-[300px] hover:h-[300px] transition-all">
                            <Image
                                src={Zury}
                                fill={true}
                                className="animate-pulse-slow"
                            />
                        </div>
                        <span
                            className={`absolute -bottom-5 text-md text-white font-semibold text-center max-w-24 ${
                                isHover ? "block" : "hidden"
                            }`}
                        >
                            Treinar Zury
                        </span>
                    </Link>
                </div>
                <div className="flex flex-wrap gap-10 justify-center px-7">
                    {cards.map((card, index) => {
                        const angle = angleStep * index - Math.PI / 2;
                        const x = Number((radius * Math.cos(angle)).toFixed(8));
                        const y = Number((radius * Math.sin(angle)).toFixed(8));
                        return (
                            <div key={index} style={getStyle(x, y)}>
                                <Card
                                    href={card.slug}
                                    title={card.title}
                                    src={card.source}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
