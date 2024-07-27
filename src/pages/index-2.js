import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Card from "@/components/Card";

const HomePage = () => {
    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row">
            <div className="px-6 md:px-10 w-full bg-neutral-100">
                <h1 className="text-3xl font-bold mt-16 mb-8">Dashboard</h1>
                <div className="bg-white rounded-2xl max-w-2xl shadow-lg">
                    <h2 className="text-2xl font-semibold mb-6 px-6 pt-6">
                        Funcionalidades
                    </h2>
                    <div>
                        <Card
                            href="treinamentos"
                            title="Treinamentos"
                            description="Ensine seu assistente com textos, websites ou documentos."
                            bgPath="/assets/images/teconvida.jpeg"
                        />
                        <Link
                            href="treinamentos"
                            className="flex gap-2 items-center border-t border-neutral-200 py-4 px-8 hover:bg-neutral-100 transition-colors duration-200"
                        >
                            <div className="text-orange-700 bg-orange-100 p-1 rounded-md">
                                <LightbulbOutlinedIcon fontSize="large" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-medium">
                                    Treinamentos
                                </span>
                                <span className="text-xs font-light">
                                    Ensine seu assistente com textos, websites
                                    ou documentos.
                                </span>
                            </div>
                        </Link>
                        <Link
                            href="configuracoes"
                            className="flex gap-2 items-center border-t border-neutral-200 py-4 px-8 hover:bg-neutral-100 transition-colors duration-200"
                        >
                            <div className="text-cyan-700 bg-cyan-100 p-1 rounded-md">
                                <SettingsOutlinedIcon fontSize="large" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-medium">
                                    Configurações
                                </span>
                                <span className="text-xs font-light">
                                    Ensine seu assistente com comportamento e a
                                    Zury.
                                </span>
                            </div>
                        </Link>
                        <Link
                            href="conexoes"
                            className="flex gap-2 items-center border-t border-neutral-200 py-4 px-8 hover:bg-neutral-100 transition-colors duration-200"
                        >
                            <div className="text-green-700 bg-green-100 p-1 rounded-md">
                                <WhatsAppIcon fontSize="large" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-medium">
                                    Conexões
                                </span>
                                <span className="text-xs font-light">
                                    Conecte seu WhatsApp.
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
