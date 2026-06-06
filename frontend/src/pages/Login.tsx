import { useMemo, useState, type CSSProperties, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Buttuon } from '../components/Buttuon';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const styles = {
  page: {
    alignItems: 'center',
    background:
      'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 52%, #F3F4F6 100%)',
    display: 'flex',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px',
  } satisfies CSSProperties,
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    boxShadow: '0 20px 50px rgba(17, 24, 39, 0.08)',
    maxWidth: '400px',
    padding: '32px',
    width: '100%',
  } satisfies CSSProperties,
  header: {
    marginBottom: '28px',
    textAlign: 'center',
  } satisfies CSSProperties,
  title: {
    color: '#111827',
    fontSize: '28px',
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
    gap: '16px',
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
    fontWeight: 600,
    padding: '0 0 0 4px',
  } satisfies CSSProperties,
};

export function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);

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
    <main style={styles.page}>
      <section aria-labelledby="login-title" style={styles.card}>
        <header style={styles.header}>
          <h1 id="login-title" style={styles.title}>
            Link Shortener
          </h1>
          <p style={styles.subtitle}>Faça login para continuar</p>
        </header>

        <form noValidate onSubmit={handleSubmit} style={styles.form}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError(null);
            }}
            error={emailError}
            disabled={isLoading}
            placeholder="voce@email.com"
            required
            autoComplete="email"
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError(null);
            }}
            error={passwordError}
            disabled={isLoading}
            placeholder="Sua senha"
            required
            autoComplete="current-password"
          />

          <Buttuon
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={!isFormValid}
          >
            Entrar
          </Buttuon>

          {formError && (
            <p role="alert" style={styles.error}>
              {formError}
            </p>
          )}
        </form>

        <div style={styles.footer}>
          <span>Não tem conta?</span>
          <button
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
