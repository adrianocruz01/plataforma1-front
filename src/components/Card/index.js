import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Card = ({ href, title, src }) => {
    const [isHover, setIsHover] = useState(false);

    return (
        <Link href={href} className="flex flex-col gap-2 items-center">
            <Image
                src={src}
                width={120}
                height={120}
                className="rounded-[20px] shadow-xl hover:shadow-2xl"
                alt="icon"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            />
            <div
                className={`text-sm text-white block font-semibold text-center max-w-24 ${
                    isHover ? "md:block" : "md:hidden"
                }`}
            >
                {title}
            </div>
        </Link>
    );
};

export default Card;
