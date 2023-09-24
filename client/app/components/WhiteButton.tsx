'use client';
import React from 'react';
import { CSSProperties, MouseEventHandler } from 'react';

type ButtonProps = {
  type: "button" | "submit" | "reset" | undefined;
  text: string;
  style?: CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
}

export default function Button({type, text, style, onClick, disabled} : ButtonProps) {
  return (
    <button className="bg-white border-slateblue hover:border-blue border-2 hover:border-3 text-[16px] text-slateblue hover:text-blue font-sans font-medium rounded-md h-[56px] shadow-[0px_4px_8px_0px_rgba(44,39,56,0.08),0px_2px_4px_0px_rgba(44,39,56,0.08)]" type={type} style={style} onClick={onClick} disabled={disabled}>{text}</button>
  )
}
