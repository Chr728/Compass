import React, { CSSProperties } from 'react';
import Image from 'next/image';

type ButtonProps = {
  type: 'button' | 'submit' | 'reset' | undefined;
  text: string;
  icon?: string; // Icon as image source
  style?: CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  isSubmitting?: boolean;
  outlined?: boolean;
  id?: string;
};

export default function Button({
  type,
  text,
  icon,
  style,
  onClick,
  disabled,
  isSubmitting,
  outlined,
  id,
}: ButtonProps) {
  const buttonStyle: CSSProperties = {
    ...style,
    border: outlined ? '1px solid #3182CE' : 'none',
    color: outlined ? '#3182CE' : 'white',
    backgroundColor: outlined ? 'transparent' : '#3182CE',
  };

  const disabledButtonStyle: CSSProperties = {
    ...buttonStyle,
    border: disabled ? '1px solid #D1D5DB' : buttonStyle.border,
    color: disabled ? '#D1D5DB' : buttonStyle.color,
    backgroundColor: disabled ? '#F3F4F6' : buttonStyle.backgroundColor,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const submittedButtonStyle: CSSProperties = {
    opacity: isSubmitting ? 0.7 : 1,
    ...buttonStyle,
  };

  return (
    <button
      className={`font-sans font-medium rounded-md h-[56px] shadow-[0px_4px_8px_0px_rgba(44,39,56,0.08),0px_2px_4px_0px_rgba(44,39,56,0.08)] ${
        outlined ? 'border border-blue text-blue' : 'bg-blue text-white'
      }`}
      type={type}
      style={
        disabled
          ? disabledButtonStyle
          : isSubmitting
          ? submittedButtonStyle
          : buttonStyle
      }
      onClick={onClick}
      disabled={isSubmitting || disabled}
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
        <>
          {icon && (
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
              <img src={icon} alt="Icon" />
              {text}
            </div>
          )}
          {!icon && text}
        </>
      )}
    </button>
  );
}
