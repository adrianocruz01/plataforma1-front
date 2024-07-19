import Image from "next/image";

const Message = ({ message }) => {
    return (
        <div
            className={`${
                message.role === "assistant"
                    ? "bg-cyan-600 ml-auto"
                    : "bg-zinc-400"
            } max-w-[340px] w-fit p-5 flex gap-3 rounded-xl shadow-lg flex-col text-white overflow-wrap-anywhere`}
        >
            {message.audios.length ? (
                <div className="flex flex-col gap-4">
                    <audio controls>
                        <source src={message.audios[0]} type="audio/ogg" />
                        Your browser does not support the audio element.
                    </audio>
                    <p>{message.midiaContent}</p>
                </div>
            ) : (
                ""
            )}
            {message.content ? <p>{message.content}</p> : ""}
            {message.images.length ? (
                <div className="flex flex-col gap-4">
                    <Image
                        src={message.images[0]}
                        width={256}
                        height={705}
                        className="h-auto max-w-64 rounded-lg"
                        alt={message.midiaContent}
                    />
                    <p>{message.midiaContent}</p>
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

export default Message;
