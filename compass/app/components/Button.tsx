'use client';
import {CSSProperties} from 'react'

type ButtonProps = {
    type: "button" | "submit" | "reset" | undefined;
    text: string;
    style?: CSSProperties;
    onClick?:(e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Button({type, text, style, onClick} : ButtonProps) {
  return (
    <button className="bg-blue text-[16px] font-sans font-medium rounded-md h-[56px] shadow-[0px_4px_8px_0px_rgba(44,39,56,0.08),0px_2px_4px_0px_rgba(44,39,56,0.08)]" type={type} style={style}>{text}</button>
  )
}
