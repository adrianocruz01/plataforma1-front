import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const HomeButton = ({ button, index }) => {
    const [isHover, setIsHover] = useState(false);

    return (
        <Link
            href={button.slug}
            className="relative flex items-center md:justify-center md:flex-row flex-col gap-2 h-full"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            key={index}
        >
            <div className="relative md:h-[60px] md:w-[60px] h-10 w-10">
                <Image
                    src={button.source}
                    fill={true}
                    className="hover:shadow-lg hover:shadow-cyan-800 rounded-xl transition-shadow"
                />
            </div>
            <div
                className={`text-white md:text-sm text-xs max-w-20 h-full md:h-auto md:absolute text-center md:text-left md:text-nowrap md:left-[70px] md:overflow-hidden transition-all duration-300 ease-in-out ${
                    isHover ? "md:max-w-96" : "md:max-w-0"
                }`}
            >
                {button.title}
            </div>
        </Link>
    );
};

export default HomeButton;
