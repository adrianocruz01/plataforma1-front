import Nav from "@/components/Nav";
import Behavior from "./Behavior";

const TrainingsPage = () => {

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row">
            <div>
                
            </div>
            <Nav page="configuracoes"  />
            <div className="px-6 md:px-10 w-full bg-animate">
                <h1 className="text-3xl font-bold mt-16 mb-8">Personalidade</h1>
                <div className="max-w-5xl">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                    <Behavior />
                    
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingsPage;
