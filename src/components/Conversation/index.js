import Image from "next/image";
import Profile from "@/assets/images/profile.png";
import AudiotrackOutlinedIcon from "@mui/icons-material/AudiotrackOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { useState } from "react";

const Conversation = ({ src, name, lastMessage, type }) => {
    const [srcImage, setSrcImage] = useState(src);

    const handleError = () => {
        setSrcImage("");
    };
    return (
        <div className="py-3 flex gap-3 w-full cursor-pointer">
            <Image
                src={srcImage ? srcImage : Profile}
                width={56}
                height={56}
                className="rounded-full max-h-14 max-w-14"
                alt="profile"
                onError={handleError}
            />
            <div>
                <div className="text-xl font-bold max-w-60 whitespace-nowrap text-ellipsis min-w-0 overflow-hidden">
                    {name ?? "Desconhecido"}
                </div>
                <div className="font-light max-w-64 text-sm whitespace-nowrap text-ellipsis min-w-0 overflow-hidden">
                    {type === "TEXT" ? (
                        lastMessage
                    ) : type === "AUDIO" ? (
                        <span>
                            <AudiotrackOutlinedIcon fontSize="inherit" /> Áudio
                        </span>
                    ) : (
                        <span>
                            <CameraAltOutlinedIcon fontSize="inherit" /> Imagem
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Conversation;
