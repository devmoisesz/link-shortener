import { useMemo, useState, type CSSProperties, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Buttuon } from '../components/Buttuon';
import { Input } from '../components/Input';
import { useAuth } from '../hooks/useAuth';

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

export function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error: authError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);

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
    <main style={styles.page}>
      <section aria-labelledby="register-title" style={styles.card}>
        <header style={styles.header}>
          <h1 id="register-title" style={styles.title}>
            Criar Conta
          </h1>
          <p style={styles.subtitle}>Registre-se para começar</p>
        </header>

        <form noValidate onSubmit={handleSubmit} style={styles.form}>
          <Input
            label="Nome Completo"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearError();
            }}
            error={nameError}
            disabled={isLoading}
            placeholder="Seu nome"
            required
            maxLength={100}
            autoComplete="name"
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearError();
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
              clearError();
            }}
            error={passwordError}
            disabled={isLoading}
            placeholder="Minimo de 6 caracteres"
            required
            maxLength={50}
            autoComplete="new-password"
          />

          <Input
            label="Confirmar Senha"
            type="password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              clearError();
            }}
            error={confirmPasswordError}
            disabled={isLoading}
            placeholder="Repita sua senha"
            required
            maxLength={50}
            autoComplete="new-password"
          />

          <Buttuon
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            loadingText="Criando conta..."
            disabled={!isFormValid}
          >
            Criar Conta
          </Buttuon>

          {formError && (
            <p role="alert" style={styles.error}>
              {formError}
            </p>
          )}
        </form>

        <div style={styles.footer}>
          <span>Já tem conta?</span>
          <button
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
