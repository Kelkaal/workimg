import React from "react";

import { IconCardProps } from "../types";
import Image from "next/image";

export type { IconCardProps };

const Card: React.FC<IconCardProps> = ({
  title,
  description,
  number,
  image,
}) => {
  return (
    <div className="flex flex-col p-8 gap-6 bg-white shadow-2xl rounded-lg">
      <h3 className="bg-[#800020] rounded-full text-white text-2xl font-bold leading-8 w-fit py-4 px-[25.32px]">
        {number}
      </h3>
      <div className="flex flex-col gap-4">
        <h3 className="text-[#111827] text-2xl font-bold leading-8">{title}</h3>
        <p className="leading-6 text-[#4B5563]">{description}</p>
      </div>
      <Image src={image} alt={title} height={316} width={237} className="w-full" />
    </div>
  );
};

export default Card;
