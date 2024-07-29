import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Card = ({ href, title, src, isHoverCircle, target }) => {
    const [isHover, setIsHover] = useState(false);

    return (
        <Link
            href={href}
            className={`relative flex flex-col items-center animate-rotate-card ${
                isHoverCircle ? "animate-pause" : ""
            } ${href ? "" : "grayscale"}`}
            target={target ?? "_self"}
        >
            <Image
                src={src}
                width={120}
                height={120}
                className="rounded-[30px]"
                alt="icon"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            />
            <div
                className={`md:absolute md:top-full mt-2 text-sm text-white block font-semibold text-center overflow-hidden max-w-24 transition-all duration-300 ease-in-out ${
                    isHover ? "md:max-h-24" : "md:max-h-0"
                }`}
            >
                {title}
            </div>
        </Link>
    );
};

export default Card;
