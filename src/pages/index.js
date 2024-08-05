import Marketing from "@/assets/images/icone-marketing.png";
import CRM from "@/assets/images/icone-grafico-2.png";
import MidiasSociais from "@/assets/images/icone-ig-fb.png";
import Ligacoes from "@/assets/images/icone-telefone.png";
import Personalidade from "@/assets/images/icone-comportamento.png";
import SMS from "@/assets/images/icone-sms.png";
import TeConvida from "@/assets/images/icone-teconvida.png";
import Zury from "@/assets/images/botao-zury.png";
import Biblioteca from "@/assets/images/icone-biblioteca.png";
import ClonagemVoz from "@/assets/images/icone-clonagem-voz.png";
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
            slug: "https://crm.zury.ai/login",
            title: "Plataforma CRM",
            source: CRM,
            target: "_blank",
        },
        {
            slug: "clonagem-voz",
            title: "Clonar voz",
            source: ClonagemVoz,
        },
        {
            slug: "",
            title: "Ligações em massa",
            source: Ligacoes,
        },
        {
            slug: "",
            title: "Sistema TeConvida",
            source: TeConvida,
        },
        {
            slug: "",
            title: "Conectar mídias sociais",
            source: MidiasSociais,
        },
        {
            slug: "",
            title: "SMS em massa",
            source: SMS,
        },
        {
            slug: "",
            title: "Plano de Marketing",
            source: Marketing,
        },
    ];
    const [windowWidth, setWindowWidth] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);
    const [isHover, setIsHover] = useState(false);
    const [isHoverCircle, setIsHoverCircle] = useState(false);
    const radius = windowHeight >= 900 ? 325 : 250;
    const angleStep = (2 * Math.PI) / cards.length;

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const getStyle = (x, y) => {
        if (windowWidth >= 1024) {
            return {
                transform: `translate(${x}px, ${y}px)`,
                position: "absolute",
                top: "calc(50% - 60px)",
                left: "calc(50% - 60px)",
                transition: "transform 1ms linear",
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

    return (
        <div className="min-h-screen w-full lg:flex flex-col lg:flex-row overflow-hidden relative pt-10 lg:pt-0">
            <div className="relative h-full lg:h-screen w-screen flex flex-col items-center justify-center">
                <div
                    className={`relative ${
                        windowHeight >= 900
                            ? "lg:w-[450px] lg:h-[450px]"
                            : "lg:w-[300px] lg:h-[300px]"
                    } w-[350px] h-[350px] flex items-center justify-center rounded-full relative z-[1]`}
                >
                    <div className="ripple border-2 border-cyan-700 rounded-full w-48 h-48 absolute opacity-0"></div>
                    <div className="ripple border-2 border-cyan-700 rounded-full w-48 h-48 absolute opacity-0"></div>
                    <div className="ripple border-2 border-cyan-700 rounded-full w-48 h-48 absolute opacity-0"></div>
                    <div className="ripple border-2 border-cyan-700 rounded-full w-48 h-48 absolute opacity-0"></div>
                    <div className="ripple border-2 border-cyan-700 rounded-full w-48 h-48 absolute opacity-0"></div>
                    <Link
                        href={"treinamentos?tab=0"}
                        onMouseEnter={() => setIsHover(true)}
                        onMouseLeave={() => setIsHover(false)}
                        onTouchStart={() => setIsHover(true)}
                        onTouchEnd={() => setIsHover(false)}
                        className="flex flex-col items-center justify-center relative"
                    >
                        <div
                            className={`relative ${
                                windowHeight >= 900
                                    ? "w-[250px] h-[250px]"
                                    : "w-[200px] h-[200px]"
                            } hover:w-[300px] hover:h-[300px] transition-all`}
                        >
                            <Image
                                src={Zury}
                                fill={true}
                                className="animate-pulse-slow"
                                alt=""
                            />
                        </div>
                        <span
                            className={`absolute -bottom-5 text-md block text-white font-semibold text-center w-max ${
                                isHover ? "lg:block" : "lg:hidden"
                            }`}
                        >
                            Ensinar a Zury
                        </span>
                    </Link>
                </div>
                <div
                    onMouseEnter={() => setIsHoverCircle(true)}
                    onMouseLeave={() => setIsHoverCircle(false)}
                    onTouchStart={() => setIsHoverCircle(true)}
                    onTouchEnd={() => setIsHoverCircle(false)}
                    className={`lg:absolute mt-8 lg:mt-0 flex flex-wrap lg:block gap-10 justify-center px-7 lg:px-0 lg:h-[700px] lg:w-[700px] animate-rotate-slow ${
                        isHoverCircle ? "animate-pause" : ""
                    }`}
                >
                    {cards.map((card, index) => {
                        const angle = angleStep * index - Math.PI / 2;
                        const x = Number((radius * Math.cos(angle)).toFixed(8));
                        const y = Number((radius * Math.sin(angle)).toFixed(8));
                        return (
                            <div key={index} style={getStyle(x, y)}>
                                <Card
                                    href={card.slug}
                                    target={card.target}
                                    title={card.title}
                                    src={card.source}
                                    onMouseEnter={() => setIsHover(true)}
                                    onMouseLeave={() => setIsHover(false)}
                                    onTouchStart={() => setIsHover(true)}
                                    onTouchEnd={() => setIsHover(false)}
                                    isHoverCircle={isHoverCircle}
                                    cardSize={windowHeight >= 900 ? 120 : 100}
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
