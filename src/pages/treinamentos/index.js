import Nav from "@/components/Nav";
import Tabs from "@/components/Tabs";
import TextTraining from "./TextTraining";
import WebsiteTraining from "./WebsiteTraining";
import DocumentTraining from "./DocumentTraining";

const TrainingsPage = () => {

    const tabs = [
        { label: "Texto", id: "text", content: <TextTraining /> },
        { label: "Website", id: "website", content: <WebsiteTraining /> },
        { label: "Documento", id: "document", content: <DocumentTraining /> },
    ];

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row">
            <Nav page="treinamentos" />
            <div className="px-6 md:px-10 w-full bg-neutral-100">
                <h1 className="text-3xl font-bold mt-16 mb-8">Treinamentos</h1>
                <Tabs tabs={tabs} />
            </div>
        </div>
    );
};

export default TrainingsPage;
