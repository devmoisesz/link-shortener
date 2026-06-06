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
  type: 'email' | 'password';
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
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
      'radial-gradient(circle at 22% 18%, rgba(124, 58, 237, 0.18), transparent 30%), radial-gradient(circle at 78% 76%, rgba(147, 51, 234, 0.14), transparent 34%)',
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
    padding: '36px',
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
    marginBottom: '30px',
    textAlign: 'center',
  } satisfies CSSProperties,
  title: {
    color: '#7C3AED',
    fontFamily: "'Special Elite', 'Courier New', monospace",
    fontSize: '32px',
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.15,
    margin: '0 0 10px',
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
    gap: '18px',
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
    padding: '22px 14px 9px',
    transition: 'border-color 160ms ease, box-shadow 160ms ease',
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
  fieldError: {
    color: '#EF4444',
    fontSize: '13px',
    lineHeight: 1.35,
    margin: '0 2px',
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
      'transform 160ms ease, opacity 160ms ease, box-shadow 160ms ease',
    width: '100%',
  } satisfies CSSProperties,
  spinner: {
    animation: 'login-spin 800ms linear infinite',
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
    marginTop: '26px',
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
  autoComplete,
}: FloatingFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || value.length > 0;
  const hasError = Boolean(error);

  return (
    <div style={styles.field}>
      <div style={styles.inputWrap}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-label={label}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${type}-login-error` : undefined}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            ...styles.input,
            border: hasError
              ? '2px solid #EF4444'
              : isFocused
                ? '2px solid #7C3AED'
                : '1px solid rgba(209, 213, 219, 0.9)',
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
          }}
        >
          {label}
        </label>
      </div>

      {hasError && (
        <p id={`${type}-login-error`} style={styles.fieldError}>
          {error}
        </p>
      )}
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const emailError = useMemo(() => {
    if (!wasSubmitted || !email) {
      return undefined;
    }

    return emailRegex.test(email) ? undefined : 'Informe um email valido.';
  }, [email, wasSubmitted]);

  const passwordError = useMemo(() => {
    if (!wasSubmitted || password) {
      return undefined;
    }

    return 'Informe sua senha.';
  }, [password, wasSubmitted]);

  const isFormValid = emailRegex.test(email) && password.trim().length > 0;
  const formError = error || authError;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWasSubmitted(true);
    setError(null);

    if (!isFormValid) {
      setError('Preencha os campos corretamente.');
      return;
    }

    try {
      await login(email, password);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : 'Nao foi possivel fazer login.',
      );
    }
  };

  return (
    <main className="login-premium-page" style={styles.page}>
      <style>
        {`
          @keyframes login-gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes login-spin {
            to { transform: rotate(360deg); }
          }

          @keyframes login-shimmer {
            0% { transform: translateX(-120%) skewX(-18deg); }
            100% { transform: translateX(220%) skewX(-18deg); }
          }

          @keyframes login-shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-6px); }
            40% { transform: translateX(6px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
          }

          .login-premium-page {
            animation: login-gradient 12s ease-in-out infinite;
          }

          .login-submit-button::before {
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

          .login-submit-button.is-loading::before {
            animation: login-shimmer 1.15s ease-in-out infinite;
            opacity: 1;
          }

          .login-register-link::after {
            background: #7C3AED;
            bottom: 0;
            content: "";
            height: 2px;
            left: 0;
            position: absolute;
            transition: width 160ms ease;
            width: 0;
          }

          .login-register-link:hover::after {
            width: 100%;
          }

          .login-error-message {
            animation: login-shake 360ms ease;
          }
        `}
      </style>

      <div style={styles.ambient} />

      <section
        aria-labelledby="login-title"
        style={{
          ...styles.card,
          ...(isMounted ? styles.cardVisible : {}),
        }}
      >
        <header style={styles.header}>
          <h1 id="login-title" style={styles.title}>
            𝑳𝒊𝒏𝒌 𝑺𝒉𝒐𝒓𝒕𝒆𝒏𝒆𝒓
          </h1>
          <p style={styles.subtitle}>Faça login para continuar</p>
        </header>

        <form noValidate onSubmit={handleSubmit} style={styles.form}>
          <FloatingField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError(null);
            }}
            error={emailError}
            disabled={isLoading}
            autoComplete="email"
          />

          <FloatingField
            label="Senha"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError(null);
            }}
            error={passwordError}
            disabled={isLoading}
            autoComplete="current-password"
          />

          <button
            className={`login-submit-button${isLoading ? ' is-loading' : ''}`}
            type="submit"
            disabled={!isFormValid || isLoading}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            style={{
              ...styles.submitButton,
              cursor: !isFormValid || isLoading ? 'not-allowed' : 'pointer',
              opacity: !isFormValid || isLoading ? 0.62 : 1,
              transform:
                isButtonHovered && isFormValid && !isLoading
                  ? 'scale(1.02)'
                  : 'scale(1)',
            }}
          >
            {isLoading && <span aria-hidden="true" style={styles.spinner} />}
            <span style={{ position: 'relative', zIndex: 1 }}>
              {isLoading ? 'Carregando...' : 'Entrar'}
            </span>
          </button>

          {formError && (
            <p
              className="login-error-message"
              role="alert"
              style={styles.error}
            >
              {formError}
            </p>
          )}
        </form>

        <div style={styles.footer}>
          <span>Não tem conta?</span>
          <button
            className="login-register-link"
            type="button"
            onClick={() => navigate('/register')}
            style={styles.linkButton}
          >
            Registre-se
          </button>
        </div>
      </section>
    </main>
  );
}
