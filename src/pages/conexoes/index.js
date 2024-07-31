import Nav from "@/components/Nav";
import Connection from "./Connection";
import { Bounce, ToastContainer } from "react-toastify";

const ConnectionsPage = () => {
    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row">
            <Nav page="conexoes" />
            <div className="px-6 md:px-10 w-full bg-animate">
                <h1 className="text-3xl font-bold mt-16 mb-8">Conexões</h1>
                <div className="max-w-5xl">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <Connection />
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

export default ConnectionsPage;
