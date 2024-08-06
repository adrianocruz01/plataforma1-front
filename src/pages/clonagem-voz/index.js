import { ToastContainer, Bounce } from "react-toastify";
import CloningVoice from "./CloningVoice";

const CloningVoicePage = () => {
    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row lg:pl-20">
            <div className="px-6 md:px-10 w-full bg-animate">
                <h1 className="text-3xl font-bold mt-16 mb-8 audiowide text-white">
                    Clonar voz
                </h1>
                <div className="max-w-5xl">
                    <div className="bg-neutral-700 rounded-2xl shadow-lg p-8">
                        <CloningVoice />
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
                </div>
            </div>
        </div>
    );
};

export default CloningVoicePage;
