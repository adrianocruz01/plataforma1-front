import Nav from "@/components/Nav";
import Behavior from "./Behavior";
import { useRouter } from "next/router";
import { useEffect } from "react";

const BehaviorPage = () => {
    const router = useRouter();
    useEffect(() => {
        router.push("/");
    }, [router]);
    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row">
            <Nav page="comportamento" />
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

export default BehaviorPage;
