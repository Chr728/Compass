'use client';
import {CSSProperties} from 'react'

type InputProps = {
    name: string;
    id: string;
    type:string;
    value: string;
    onChange?: React.ChangeEventHandler<HTMLElement>;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    style?: CSSProperties;
}

export default function Input({name, id, type, value, onChange, onBlur, style} : InputProps) {
  return (
    <input name={name} id={id} type={type} value={value} onChange={onChange} onBlur={onBlur} className="h-[52px] border border-solid border-lightgrey rounded-md text-grey p-2 focus:outline-blue shadow-[0_4px_8px_0_rgba(44,39,56,0.04)]" style={style}/>
  )
}
