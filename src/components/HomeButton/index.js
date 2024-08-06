import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const HomeButton = ({ button }) => {
    const [isHover, setIsHover] = useState(false);
    const router = useRouter();

    return (
        <Link
            href={button.slug}
            className={`relative items-center border- lg:justify-center lg:flex-row flex-col gap-2 h-full ${
                button.slug === "/" && button.slug === router.route ? "hidden" : "flex"
            }`}
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
                    className={`hover:shadow-lg hover:shadow-cyan-800 transition-shadow ${
                        button.slug === "/" ? "rounded-full" : "rounded-xl"
                    }`}
                />
            </div>
            <div
                className={`text-white gradient-lg-container p-2 rounded-xl lg:text-sm text-xs max-w-20 h-full lg:h-auto lg:absolute text-center lg:text-left lg:text-nowrap lg:left-[70px] lg:overflow-hidden transition-all duration-300 ease-in-out ${
                    isHover ? "lg:max-w-96" : "lg:max-w-0 lg:p-0 lg:bg-none lg:border-0"
                }`}
            >
                {button.title}
            </div>
        </Link>
    );
};

export default HomeButton;
