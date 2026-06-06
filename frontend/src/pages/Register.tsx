import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FloatingFieldProps {
  label: string;
  type: 'text' | 'email' | 'password';
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  autoComplete?: string;
  isValid?: boolean;
  isConfirmPassword?: boolean;
  isPasswordMismatch?: boolean;
}

const styles = {
  page: {
    alignItems: 'center',
    background:
      'linear-gradient(120deg, #FFFFFF 0%, #F9FAFB 34%, rgba(124, 58, 237, 0.16) 66%, #FFFFFF 100%)',
    backgroundSize: '240% 240%',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh',
    overflow: 'hidden',
    padding: '24px',
    position: 'relative',
  } satisfies CSSProperties,
  ambient: {
    background:
      'radial-gradient(circle at 20% 18%, rgba(124, 58, 237, 0.18), transparent 30%), radial-gradient(circle at 80% 78%, rgba(147, 51, 234, 0.14), transparent 34%)',
    inset: 0,
    pointerEvents: 'none',
    position: 'absolute',
  } satisfies CSSProperties,
  card: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '18px',
    boxShadow:
      '0 8px 32px rgba(124, 58, 237, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
    maxWidth: '400px',
    opacity: 0,
    padding: '34px',
    position: 'relative',
    transform: 'translateY(24px)',
    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
    width: '100%',
    zIndex: 1,
  } satisfies CSSProperties,
  cardVisible: {
    opacity: 1,
    transform: 'translateY(0)',
  } satisfies CSSProperties,
  header: {
    marginBottom: '26px',
    textAlign: 'center',
  } satisfies CSSProperties,
  title: {
    color: '#111827',
    fontFamily: 'Inter',
    fontSize: '26px',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.2,
    margin: '0 0 8px',
  } satisfies CSSProperties,
  subtitle: {
    color: '#6B7280',
    fontSize: '15px',
    lineHeight: 1.5,
    margin: 0,
  } satisfies CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  } satisfies CSSProperties,
  field: {
    display: 'grid',
    gap: '7px',
    position: 'relative',
  } satisfies CSSProperties,
  inputWrap: {
    position: 'relative',
  } satisfies CSSProperties,
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    border: '1px solid rgba(209, 213, 219, 0.9)',
    borderRadius: '12px',
    boxSizing: 'border-box',
    color: '#111827',
    fontSize: '15px',
    lineHeight: 1.5,
    outline: 'none',
    padding: '22px 42px 9px 14px',
    transition:
      'border-color 160ms ease, box-shadow 160ms ease, opacity 160ms ease',
    width: '100%',
  } satisfies CSSProperties,
  label: {
    color: '#6B7280',
    fontSize: '15px',
    left: '14px',
    lineHeight: 1,
    pointerEvents: 'none',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    transition:
      'top 160ms ease, font-size 160ms ease, color 160ms ease, transform 160ms ease',
  } satisfies CSSProperties,
  labelFloating: {
    color: '#7C3AED',
    fontSize: '12px',
    top: '9px',
    transform: 'translateY(0)',
  } satisfies CSSProperties,
  validIcon: {
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: '999px',
    color: '#FFFFFF',
    display: 'flex',
    fontSize: '12px',
    fontWeight: 700,
    height: '20px',
    justifyContent: 'center',
    position: 'absolute',
    right: '13px',
    top: '50%',
    transform: 'translateY(-50%) scale(0)',
    transition: 'transform 160ms ease',
    width: '20px',
  } satisfies CSSProperties,
  validIconVisible: {
    transform: 'translateY(-50%) scale(1)',
  } satisfies CSSProperties,
  fieldError: {
    color: '#EF4444',
    fontSize: '13px',
    lineHeight: 1.35,
    margin: '0 2px',
  } satisfies CSSProperties,
  strength: {
    display: 'grid',
    gap: '6px',
    opacity: 0,
    transform: 'translateY(-4px)',
    transition: 'opacity 180ms ease, transform 180ms ease',
  } satisfies CSSProperties,
  strengthVisible: {
    opacity: 1,
    transform: 'translateY(0)',
  } satisfies CSSProperties,
  strengthTrack: {
    display: 'grid',
    gap: '6px',
    gridTemplateColumns: 'repeat(3, 1fr)',
  } satisfies CSSProperties,
  strengthSegment: {
    borderRadius: '999px',
    height: '5px',
    transition: 'background-color 160ms ease, opacity 160ms ease',
  } satisfies CSSProperties,
  strengthText: {
    color: '#6B7280',
    fontSize: '12px',
    lineHeight: 1.3,
    margin: 0,
  } satisfies CSSProperties,
  submitButton: {
    alignItems: 'center',
    background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
    border: 'none',
    borderRadius: '10px',
    boxShadow: '0 14px 28px rgba(124, 58, 237, 0.2)',
    color: '#FFFFFF',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '16px',
    fontWeight: 700,
    gap: '8px',
    justifyContent: 'center',
    lineHeight: 1.5,
    minHeight: '50px',
    overflow: 'hidden',
    padding: '12px 24px',
    position: 'relative',
    transition:
      'background 160ms ease, opacity 160ms ease, transform 160ms ease, box-shadow 160ms ease',
    width: '100%',
  } satisfies CSSProperties,
  spinner: {
    animation: 'register-spin 800ms linear infinite',
    border: '2px solid rgba(255, 255, 255, 0.75)',
    borderRightColor: 'transparent',
    borderRadius: '999px',
    height: '16px',
    width: '16px',
  } satisfies CSSProperties,
  error: {
    color: '#EF4444',
    fontSize: '14px',
    lineHeight: 1.5,
    margin: '0',
    textAlign: 'center',
  } satisfies CSSProperties,
  footer: {
    alignItems: 'center',
    color: '#6B7280',
    display: 'flex',
    fontSize: '14px',
    justifyContent: 'center',
    lineHeight: 1.5,
    marginTop: '24px',
  } satisfies CSSProperties,
  linkButton: {
    background: 'none',
    border: 0,
    color: '#7C3AED',
    cursor: 'pointer',
    font: 'inherit',
    fontWeight: 700,
    marginLeft: '4px',
    padding: '0 0 2px',
    position: 'relative',
  } satisfies CSSProperties,
};

function FloatingField({
  label,
  type,
  value,
  onChange,
  error,
  disabled = false,
  maxLength,
  autoComplete,
  isValid = false,
  isConfirmPassword = false,
  isPasswordMismatch = false,
}: FloatingFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || value.length > 0;
  const hasError = Boolean(error);

  const border = (() => {
    if (isPasswordMismatch) {
      return '2px solid #EF4444';
    }

    if (isConfirmPassword && isValid) {
      return '2px solid #10B981';
    }

    if (hasError) {
      return '2px solid #EF4444';
    }

    if (isFocused) {
      return '2px solid #7C3AED';
    }

    return '1px solid rgba(209, 213, 219, 0.9)';
  })();

  return (
    <div style={styles.field}>
      <div style={styles.inputWrap}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-label={label}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${label}-register-error` : undefined}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={isPasswordMismatch ? 'register-confirm-mismatch' : undefined}
          style={{
            ...styles.input,
            border,
            boxShadow: isFocused
              ? '0 0 0 4px rgba(124, 58, 237, 0.12)'
              : 'none',
            opacity: disabled ? 0.56 : 1,
          }}
        />
        <label
          style={{
            ...styles.label,
            ...(isFloating ? styles.labelFloating : {}),
            color: isConfirmPassword && isValid ? '#10B981' : undefined,
          }}
        >
          {label}
        </label>
        <span
          aria-hidden="true"
          style={{
            ...styles.validIcon,
            ...(isValid ? styles.validIconVisible : {}),
          }}
        >
          ✓
        </span>
      </div>

      {hasError && (
        <p id={`${label}-register-error`} style={styles.fieldError}>
          {error}
        </p>
      )}
    </div>
  );
}

export function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error: authError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  useEffect(() => {
    const mountAnimationId = window.setTimeout(() => {
      setIsMounted(true);
    }, 0);

    const fontId = 'font-special-elite';

    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Special+Elite&display=swap';
      document.head.appendChild(link);
    }

    return () => {
      window.clearTimeout(mountAnimationId);
    };
  }, []);

  const trimmedName = name.trim();

  const nameError = useMemo(() => {
    if (!wasSubmitted && !name) {
      return undefined;
    }

    if (trimmedName.length === 0) {
      return wasSubmitted ? 'Informe seu nome completo.' : undefined;
    }

    if (trimmedName.length < 3) {
      return 'O nome deve ter pelo menos 3 caracteres.';
    }

    if (trimmedName.length > 100) {
      return 'O nome deve ter no maximo 100 caracteres.';
    }

    return undefined;
  }, [name, trimmedName.length, wasSubmitted]);

  const emailError = useMemo(() => {
    if (!wasSubmitted && !email) {
      return undefined;
    }

    if (!email) {
      return wasSubmitted ? 'Informe seu email.' : undefined;
    }

    return emailRegex.test(email) ? undefined : 'Informe um email valido.';
  }, [email, wasSubmitted]);

  const passwordError = useMemo(() => {
    if (!wasSubmitted && !password) {
      return undefined;
    }

    if (!password) {
      return wasSubmitted ? 'Informe uma senha.' : undefined;
    }

    if (password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres.';
    }

    if (password.length > 50) {
      return 'A senha deve ter no maximo 50 caracteres.';
    }

    return undefined;
  }, [password, wasSubmitted]);

  const confirmPasswordError = useMemo(() => {
    if (!confirmPassword && !wasSubmitted) {
      return undefined;
    }

    if (!confirmPassword) {
      return wasSubmitted ? 'Confirme sua senha.' : undefined;
    }

    return confirmPassword === password ? undefined : 'Senhas não conferem';
  }, [confirmPassword, password, wasSubmitted]);

  const passwordStrength = useMemo(() => {
    const score =
      Number(password.length >= 6) +
      Number(/\d/.test(password)) +
      Number(/[A-Z]/.test(password));

    if (score <= 1) {
      return { color: '#EF4444', label: 'Senha fraca', score };
    }

    if (score === 2) {
      return { color: '#F59E0B', label: 'Senha média', score };
    }

    return { color: '#10B981', label: 'Senha forte', score };
  }, [password]);

  const isNameValid = trimmedName.length >= 3 && trimmedName.length <= 100;
  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = password.length >= 6 && password.length <= 50;
  const isConfirmPasswordValid =
    confirmPassword.length > 0 && confirmPassword === password;
  const isPasswordMismatch =
    confirmPassword.length > 0 && confirmPassword !== password;

  const isFormValid =
    trimmedName.length >= 3 &&
    trimmedName.length <= 100 &&
    emailRegex.test(email) &&
    password.length >= 6 &&
    password.length <= 50 &&
    confirmPassword === password;

  const formError = error || authError;

  const clearError = () => {
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWasSubmitted(true);
    setError(null);

    if (!isFormValid) {
      setError('Preencha os campos corretamente.');
      return;
    }

    try {
      await register(trimmedName, email, password, confirmPassword);
    } catch (registerError) {
      setError(
        registerError instanceof Error
          ? registerError.message
          : 'Nao foi possivel criar a conta.',
      );
    }
  };

  return (
    <main className="register-premium-page" style={styles.page}>
      <style>
        {`
          @keyframes register-gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes register-spin {
            to { transform: rotate(360deg); }
          }

          @keyframes register-shimmer {
            0% { transform: translateX(-120%) skewX(-18deg); }
            100% { transform: translateX(220%) skewX(-18deg); }
          }

          @keyframes register-error-pulse {
            0%, 100% { border-color: #EF4444; }
            50% { border-color: #FCA5A5; }
          }

          @keyframes register-shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-6px); }
            40% { transform: translateX(6px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
          }

          .register-premium-page {
            animation: register-gradient 12s ease-in-out infinite;
          }

          .register-submit-button::before {
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.46),
              transparent
            );
            content: "";
            height: 160%;
            left: 0;
            opacity: 0;
            position: absolute;
            top: -30%;
            transform: translateX(-120%) skewX(-18deg);
            width: 48%;
          }

          .register-submit-button.is-loading::before {
            animation: register-shimmer 1.15s ease-in-out infinite;
            opacity: 1;
          }

          .register-confirm-mismatch {
            animation: register-error-pulse 900ms ease-in-out infinite;
          }

          .register-login-link::after {
            background: #7C3AED;
            bottom: 0;
            content: "";
            height: 2px;
            left: 0;
            position: absolute;
            transition: width 160ms ease;
            width: 0;
          }

          .register-login-link:hover::after {
            width: 100%;
          }

          .register-error-message {
            animation: register-shake 360ms ease;
          }
        `}
      </style>

      <div style={styles.ambient} />

      <section
        aria-labelledby="register-title"
        style={{
          ...styles.card,
          ...(isMounted ? styles.cardVisible : {}),
        }}
      >
        <header style={styles.header}>
          <h1 id="register-title" style={styles.title}>
            Criar Conta
          </h1>
          <p style={styles.subtitle}>Registre-se para começar</p>
        </header>

        <form noValidate onSubmit={handleSubmit} style={styles.form}>
          <FloatingField
            label="Nome Completo"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearError();
            }}
            error={nameError}
            disabled={isLoading}
            maxLength={100}
            autoComplete="name"
            isValid={isNameValid}
          />

          <FloatingField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearError();
            }}
            error={emailError}
            disabled={isLoading}
            autoComplete="email"
            isValid={isEmailValid}
          />

          <FloatingField
            label="Senha"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              clearError();
            }}
            error={passwordError}
            disabled={isLoading}
            maxLength={50}
            autoComplete="new-password"
            isValid={isPasswordValid}
          />

          <div
            style={{
              ...styles.strength,
              ...(password ? styles.strengthVisible : {}),
            }}
          >
            <div aria-hidden="true" style={styles.strengthTrack}>
              {[1, 2, 3].map((segment) => (
                <span
                  key={segment}
                  style={{
                    ...styles.strengthSegment,
                    backgroundColor:
                      passwordStrength.score >= segment
                        ? passwordStrength.color
                        : '#E5E7EB',
                    opacity: password ? 1 : 0,
                  }}
                />
              ))}
            </div>
            <p style={styles.strengthText}>{passwordStrength.label}</p>
          </div>

          <FloatingField
            label="Confirmar Senha"
            type="password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              clearError();
            }}
            error={confirmPasswordError}
            disabled={isLoading}
            maxLength={50}
            autoComplete="new-password"
            isValid={isConfirmPasswordValid}
            isConfirmPassword
            isPasswordMismatch={isPasswordMismatch}
          />

          <button
            className={`register-submit-button${isLoading ? ' is-loading' : ''}`}
            type="submit"
            disabled={!isFormValid || isLoading}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            style={{
              ...styles.submitButton,
              background:
                isFormValid && !isLoading
                  ? 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)'
                  : 'linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%)',
              cursor: !isFormValid || isLoading ? 'not-allowed' : 'pointer',
              opacity: !isFormValid || isLoading ? 0.5 : 1,
              transform:
                isButtonHovered && isFormValid && !isLoading
                  ? 'scale(1.02)'
                  : 'scale(1)',
            }}
          >
            {isLoading && <span aria-hidden="true" style={styles.spinner} />}
            <span style={{ position: 'relative', zIndex: 1 }}>
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </span>
          </button>

          {formError && (
            <p
              className="register-error-message"
              role="alert"
              style={styles.error}
            >
              {formError}
            </p>
          )}
        </form>

        <div style={styles.footer}>
          <span>Já tem conta?</span>
          <button
            className="register-login-link"
            type="button"
            onClick={() => navigate('/login')}
            style={styles.linkButton}
          >
            Faça login
          </button>
        </div>
      </section>
    </main>
  );
}
