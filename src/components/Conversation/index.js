import Image from "next/image";
import Profile from "@/assets/images/profile.png"

const Conversation = ({ src, name, lastMessage }) => {
    return (
        <div className="py-3 flex gap-3 w-full cursor-pointer">
            <Image src={src ? src : Profile} width={56} height={56} className="rounded-full max-h-14 max-w-14" alt="profile" />
            <div>
                <div className="text-xl font-bold max-w-60 whitespace-nowrap text-ellipsis min-w-0 overflow-hidden">{name ?? 'Desconhecido'}</div>
                <div className="font-light max-w-64 text-sm whitespace-nowrap text-ellipsis min-w-0 overflow-hidden">{lastMessage}</div>
            </div>
        </div>
    );
};

export default Conversation;
