import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const HomeButton = ({ button }) => {
    const [isHover, setIsHover] = useState(false);

    return (
        <Link
            href={button.slug}
            className="relative flex items-center lg:justify-center lg:flex-row flex-col gap-2 h-full"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onTouchStart={() => setIsHover(true)}
            onTouchEnd={() => setIsHover(false)}
        >
            <div className="relative md:h-[60px] md:w-[60px] h-10 w-10">
                <Image
                    src={button.source}
                    fill={true}
                    alt=""
                    className="hover:shadow-lg hover:shadow-cyan-800 rounded-xl transition-shadow"
                />
            </div>
            <div
                className={`text-white lg:text-sm text-xs max-w-20 h-full lg:h-auto lg:absolute text-center lg:text-left lg:text-nowrap lg:left-[70px] lg:overflow-hidden transition-all duration-300 ease-in-out ${
                    isHover ? "lg:max-w-96" : "lg:max-w-0"
                }`}
            >
                {button.title}
            </div>
        </Link>
    );
};

export default HomeButton;
