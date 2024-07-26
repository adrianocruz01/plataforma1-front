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
            <div className="md:h-14 md:w-14 w-11 h-11 min-h-11 min-w-11 relative">
                <Image
                    src={srcImage ? srcImage : Profile}
                    fill={true}
                    className="rounded-full"
                    alt="profile"
                    onError={handleError}
                />
            </div>
            <div className="max-w-[calc(100%-56px)]">
                <div className="md:text-xl text-md font-bold md:max-w-60 max-w-full whitespace-nowrap text-ellipsis min-w-0 overflow-hidden">
                    {name ?? "Desconhecido"}
                </div>
                <div className="font-light md:max-w-64 max-w-full text-sm whitespace-nowrap text-ellipsis min-w-0 overflow-hidden">
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
