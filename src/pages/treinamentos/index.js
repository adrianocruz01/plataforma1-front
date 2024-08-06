import Nav from "@/components/Nav";
import Tabs from "@/components/Tabs";
import AudioTraining from "./AudioTraining";
import TextTraining from "./TextTraining";
import WebsiteTraining from "./WebsiteTraining";
import DocumentTraining from "./DocumentTraining";
import { useRouter } from "next/router";
import { ToastContainer, Bounce } from "react-toastify";

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
        <div className="flex min-h-screen w-full flex-col md:flex-row lg:pl-20">
            <div className="px-4 md:px-10 w-full">
                <h1 className="text-3xl font-bold md:mt-16 mt-12 ml-4 mb-8 audiowide text-white">Treinamentos</h1>
                <Tabs tabs={tabs} initialTab={tab ? Number(tab) : 0} />
            </div>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </div>
    );
};

export default TrainingsPage;
