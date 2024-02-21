'use client';
import Image from 'next/image';
import React, { CSSProperties } from 'react';

type ButtonProps = {
  type: 'button' | 'submit' | 'reset' | undefined;
  text: string;
  style?: CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  isSubmitting?: boolean;
  id?: string;
};

export default function Button({
  type,
  text,
  style,
  onClick,
  disabled,
  isSubmitting,
  id,
}: ButtonProps) {
  const submittedButtonStyle: CSSProperties = {
    opacity: isSubmitting ? 0.7 : 1,
    ...style,
  };
  return (
    <button
      className="bg-blue text-[16px] text-white font-sans font-medium rounded-md h-[56px] shadow-[0px_4px_8px_0px_rgba(44,39,56,0.08),0px_2px_4px_0px_rgba(44,39,56,0.08)]"
      type={type}
      style={submittedButtonStyle}
      onClick={onClick}
      disabled={isSubmitting}
      id={id}
    >
      {isSubmitting ? (
        <div className="flex items-center">
          <Image
            src="/icons/blueProgress.svg"
            alt="Progress Indicator"
            width={10}
            height={10}
            style={{
              width: 'auto',
              height: 'auto',
              margin: '0 12px',
            }}
          />
          <span style={{ verticalAlign: 'middle' }}>Submitting</span>
        </div>
      ) : (
        text
      )}
    </button>
  );
}
