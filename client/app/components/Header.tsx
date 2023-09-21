import React from "react";
import Link from "next/link";
import Image from "next/image";

type InputProps = {
  headerText: string;
};

export default function Header({ headerText }: InputProps) {
  return (
    <div className="flex items-center ml-6 m-[10px] xl:hidden">
      <Image
        src="/icons/LeftArrow.svg"
        alt="LeftArrow icon"
        width={12}
        height={12}
        className="mr-4"
      />

      <span className="text-[color:var(--Dark-Grey,#2C2738)] text-2xl not-italic font-bold leading-[normal] font-family: IBM Plex Sans ; ">
        {headerText}
      </span>
    </div>
  );
}
