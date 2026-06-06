import { useId, type ChangeEvent, type CSSProperties } from 'react';

interface InputProps {
  label: string;
  type: 'text' | 'email' | 'password' | 'url';
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  autoComplete?: string;
}

type InputStyleProperties = CSSProperties & {
  '--input-border': string;
  '--input-focus': string;
  '--input-error': string;
  '--input-text': string;
  '--input-muted': string;
  '--input-bg': string;
};

const styles = {
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
    '--input-border': '#D1D5DB',
    '--input-focus': '#7C3AED',
    '--input-error': '#EF4444',
    '--input-text': '#111827',
    '--input-muted': '#6B7280',
    '--input-bg': '#FFFFFF',
  } satisfies InputStyleProperties,
  label: {
    color: 'var(--input-text)',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1.4,
  } satisfies CSSProperties,
  input: {
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid var(--input-border)',
    borderRadius: '8px',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--input-text)',
    fontSize: '16px',
    lineHeight: 1.5,
    outline: 'none',
    padding: '10px 12px',
    transition:
      'border-color 160ms ease, box-shadow 160ms ease, opacity 160ms ease',
  } satisfies CSSProperties,
  errorText: {
    color: 'var(--input-error)',
    fontSize: '13px',
    lineHeight: 1.4,
    margin: 0,
  } satisfies CSSProperties,
};

export function Input({
  label,
  type,
  value,
  onChange,
  error,
  disabled = false,
  placeholder,
  required = false,
  maxLength,
  autoComplete,
}: InputProps) {
  const generatedId = useId();
  const inputId = `input-${generatedId}`;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(error);

  const inputStyle: CSSProperties = {
    ...styles.input,
    borderColor: hasError ? 'var(--input-error)' : 'var(--input-border)',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
  };

  return (
    <div style={styles.field}>
      <label htmlFor={inputId} style={styles.label}>
        {label}
      </label>

      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-label={label}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        style={inputStyle}
        onFocus={(event) => {
          event.currentTarget.style.borderColor = 'var(--input-focus)';
          event.currentTarget.style.boxShadow =
            '0 0 0 3px rgba(124, 58, 237, 0.14)';
        }}
        onBlur={(event) => {
          event.currentTarget.style.borderColor = hasError
            ? 'var(--input-error)'
            : 'var(--input-border)';
          event.currentTarget.style.boxShadow = 'none';
        }}
      />

      {hasError && (
        <p id={errorId} role="alert" style={styles.errorText}>
          {error}
        </p>
      )}
    </div>
  );
}
