import { useState, type CSSProperties, type ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
  loadingText?: string;
}

const colors = {
  primary: '#7C3AED',
  primaryHover: '#6D28D9',
  white: '#FFFFFF',
  grayHover: '#F3F4F6',
} as const;

const baseButtonStyle: CSSProperties = {
  alignItems: 'center',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'inline-flex',
  fontSize: '16px',
  fontWeight: 600,
  gap: '8px',
  justifyContent: 'center',
  lineHeight: 1.5,
  padding: '12px 24px',
  transition:
    'background-color 160ms ease, border-color 160ms ease, color 160ms ease, opacity 160ms ease',
};

const spinnerStyle: CSSProperties = {
  animation: 'button-spin 800ms linear infinite',
  border: '2px solid currentColor',
  borderRightColor: 'transparent',
  borderRadius: '999px',
  height: '16px',
  width: '16px',
};

export function Buttuon({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  type = 'button',
  className,
  fullWidth = false,
  loadingText = 'Carregando...',
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isDisabled = disabled || loading;
  const isPrimary = variant === 'primary';

  const buttonStyle: CSSProperties = {
    ...baseButtonStyle,
    backgroundColor: isPrimary
      ? isHovered && !isDisabled
        ? colors.primaryHover
        : colors.primary
      : isHovered && !isDisabled
        ? colors.grayHover
        : colors.white,
    border: `1px solid ${colors.primary}`,
    color: isPrimary ? colors.white : colors.primary,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    pointerEvents: isDisabled ? 'none' : undefined,
    width: fullWidth ? '100%' : undefined,
  };

  return (
    <>
      <style>
        {'@keyframes button-spin { to { transform: rotate(360deg); } }'}
      </style>

      <button
        type={type}
        className={className}
        onClick={onClick}
        disabled={isDisabled}
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {loading && <span aria-hidden="true" style={spinnerStyle} />}
        {loading ? loadingText : children}
      </button>
    </>
  );
}
