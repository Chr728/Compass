"use client";
import { CSSProperties } from "react";

type ButtonProps = {
  type: "button" | "submit" | "reset" | undefined;
  text: string;
  style?: CSSProperties;
  onClick?: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function Button({ type, text, style, onClick }: ButtonProps) {
  return (
    <button
      className="text-[color:var(--Dark-Grey,#2C2738)] text-center text-base not-italic font-medium leading-[normal] h-[48px] w-[200px] shrink-0 font-family: IBM Plex Sans border-[color:var(--Red,#FF7171)] rounded-md border-[3px] border-solid"
      type={type}
      style={style}
    >
      {text}
    </button>
  );
}
