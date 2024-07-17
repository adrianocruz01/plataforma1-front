import Nav from "@/components/Nav";
import Tabs from "@/components/Tabs";
import AudioTraining from "./AudioTraining";
import TextTraining from "./TextTraining";
import WebsiteTraining from "./WebsiteTraining";
import DocumentTraining from "./DocumentTraining";
import { useRouter } from "next/router";

const TrainingsPage = () => {
    const router = useRouter();
    const { tab } = router.query;

    const tabs = [
        { label: "Treinamento", id: "training", content: <AudioTraining /> },
        { label: "Site", id: "website", content: <WebsiteTraining /> },
        { label: "Documento", id: "document", content: <DocumentTraining /> },
        { label: "Biblioteca", id: "text", content: <TextTraining /> },
    ];

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row">
            <Nav page="treinamentos" />
            <div className="px-6 md:px-10 w-full bg-animate">
                <h1 className="text-3xl font-bold mt-16 mb-8">Treinamentos</h1>
                <Tabs tabs={tabs} initialTab={tab ? Number(tab) : 0} />
            </div>
        </div>
    );
};

export default TrainingsPage;
