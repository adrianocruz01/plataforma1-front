import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Card = ({ href, title, src }) => {
    return (
        <Link href={href} className="flex flex-col gap-2 items-center">
            <Image
                src={src}
                width={300}
                height={300}
                className="rounded-[50px] border-4 border-stone-400 shadow-xl hover:shadow-2xl"
                alt="icon"
            />
            <div className="text-xl font-semibold text-center mt-4">{title}</div>
        </Link>
    );
};

export default Card;
