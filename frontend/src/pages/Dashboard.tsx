import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  ApiError,
  ApiResponse,
  GetUrlsResponse,
  ShortenUrlResponse,
  ShortUrl,
} from '../@types/auth';
import { useAuth } from '../hooks/useAuth';
import { apiCall } from '../service/api';
import { API_URL, DEFAULT_PAGE_LIMIT, ENDPOINTS } from '../utils/constants';

const shortUrlBase = `${API_URL}/shortener`;

const isValidUrl = (value: string): boolean => {
  try {
    const url = new URL(value);

    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const getErrorMessage = async (
  response: Response,
  fallback: string,
): Promise<string> => {
  try {
    const payload = (await response.json()) as Partial<ApiError>;

    return payload.message || fallback;
  } catch {
    return fallback;
  }
};

const parseApiData = async <T,>(response: Response): Promise<T> => {
  const payload = (await response.json()) as T | ApiResponse<T>;

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data;
  }

  return payload as T;
};

const formatDate = (date: string): string =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));

const truncateUrl = (url: string, maxLength = 86): string =>
  url.length > maxLength ? `${url.slice(0, maxLength)}...` : url;

const getShortenResultUrl = (result: ShortenUrlResponse): string | null => {
  if (result.shortUrl) {
    return result.shortUrl;
  }

  const shortCode = result.shortCode || result.schortCode;

  return shortCode ? `${shortUrlBase}/${shortCode}` : null;
};

const styles = {
  page: {
    background:
      'radial-gradient(circle at 18% 10%, rgba(124, 58, 237, 0.08), transparent 28%), linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 44%, #F3F4F6 100%)',
    color: '#111827',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    minHeight: '100vh',
  } satisfies CSSProperties,
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB',
    boxShadow: '0 1px 0 #E5E7EB',
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr auto 1fr',
    padding: '18px 32px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  } satisfies CSSProperties,
  title: {
    color: '#7C3AED',
    fontFamily: "'Special Elite', 'Courier New', monospace",
    fontSize: '28px',
    fontWeight: 700,
    gridColumn: 2,
    letterSpacing: 0,
    lineHeight: 1.2,
    margin: 0,
    textAlign: 'center',
  } satisfies CSSProperties,
  logout: {
    display: 'flex',
    gridColumn: 3,
    justifyContent: 'flex-end',
  } satisfies CSSProperties,
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '26px',
    margin: '0 auto',
    maxWidth: '980px',
    padding: '32px 24px 48px',
  } satisfies CSSProperties,
  panel: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    boxShadow:
      '0 20px 50px rgba(17, 24, 39, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)',
    opacity: 0,
    padding: '28px',
    transform: 'translateY(-16px)',
    transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
  } satisfies CSSProperties,
  panelVisible: {
    opacity: 1,
    transform: 'translateY(0)',
  } satisfies CSSProperties,
  listPanel: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    boxShadow:
      '0 20px 50px rgba(17, 24, 39, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)',
    padding: '28px',
  } satisfies CSSProperties,
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 700,
    lineHeight: 1.3,
    margin: '0 0 20px',
  } satisfies CSSProperties,
  form: {
    display: 'grid',
    gap: '16px',
  } satisfies CSSProperties,
  field: {
    display: 'grid',
    gap: '7px',
  } satisfies CSSProperties,
  inputWrap: {
    position: 'relative',
  } satisfies CSSProperties,
  input: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #D1D5DB',
    borderRadius: '12px',
    boxSizing: 'border-box',
    color: '#111827',
    fontSize: '15px',
    lineHeight: 1.5,
    outline: 'none',
    padding: '23px 14px 10px',
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
  actionsRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-start',
  } satisfies CSSProperties,
  primaryButton: {
    alignItems: 'center',
    background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
    border: 'none',
    borderRadius: '10px',
    boxShadow: '0 14px 28px rgba(124, 58, 237, 0.18)',
    color: '#FFFFFF',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: '15px',
    fontWeight: 700,
    gap: '8px',
    justifyContent: 'center',
    lineHeight: 1.5,
    minHeight: '48px',
    overflow: 'hidden',
    padding: '11px 22px',
    position: 'relative',
    transition: 'transform 160ms ease, opacity 160ms ease, box-shadow 160ms ease',
  } satisfies CSSProperties,
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #D1D5DB',
    borderRadius: '10px',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: 1.5,
    padding: '9px 14px',
    transition: 'border-color 160ms ease, color 160ms ease, opacity 160ms ease',
  } satisfies CSSProperties,
  spinner: {
    animation: 'dashboard-spin 800ms linear infinite',
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
    margin: 0,
  } satisfies CSSProperties,
  result: {
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    display: 'grid',
    gap: '14px',
    marginTop: '20px',
    maxHeight: 0,
    opacity: 0,
    overflow: 'hidden',
    padding: '0 18px',
    transition: 'max-height 320ms ease, opacity 220ms ease, padding 220ms ease',
  } satisfies CSSProperties,
  resultVisible: {
    maxHeight: '220px',
    opacity: 1,
    padding: '18px',
  } satisfies CSSProperties,
  resultTop: {
    alignItems: 'center',
    display: 'flex',
    gap: '10px',
    justifyContent: 'space-between',
  } satisfies CSSProperties,
  badge: {
    backgroundColor: '#ECFDF5',
    border: '1px solid rgba(16, 185, 129, 0.22)',
    borderRadius: '999px',
    color: '#10B981',
    fontSize: '12px',
    fontWeight: 700,
    padding: '4px 9px',
  } satisfies CSSProperties,
  resultRow: {
    alignItems: 'center',
    display: 'flex',
    gap: '12px',
    justifyContent: 'space-between',
  } satisfies CSSProperties,
  shortLink: {
    color: '#7C3AED',
    fontSize: '15px',
    fontWeight: 700,
    overflowWrap: 'anywhere',
    textDecoration: 'none',
  } satisfies CSSProperties,
  listHeader: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '18px',
  } satisfies CSSProperties,
  muted: {
    color: '#6B7280',
    fontSize: '14px',
    lineHeight: 1.5,
    margin: 0,
  } satisfies CSSProperties,
  list: {
    display: 'grid',
    gap: '12px',
  } satisfies CSSProperties,
  item: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    display: 'grid',
    gap: '12px',
    opacity: 0,
    padding: '16px',
    transform: 'translateY(12px)',
    transition:
      'box-shadow 200ms ease, transform 200ms ease, border-color 200ms ease',
  } satisfies CSSProperties,
  itemTop: {
    alignItems: 'flex-start',
    display: 'flex',
    gap: '16px',
    justifyContent: 'space-between',
  } satisfies CSSProperties,
  itemInfo: {
    display: 'grid',
    gap: '6px',
    minWidth: 0,
  } satisfies CSSProperties,
  originalUrl: {
    color: '#374151',
    fontSize: '14px',
    lineHeight: 1.5,
    margin: 0,
    overflowWrap: 'anywhere',
  } satisfies CSSProperties,
  date: {
    color: '#6B7280',
    fontSize: '13px',
    lineHeight: 1.4,
    margin: 0,
  } satisfies CSSProperties,
  itemActions: {
    display: 'flex',
    flexShrink: 0,
    gap: '8px',
  } satisfies CSSProperties,
  smallButton: {
    border: '1px solid #D1D5DB',
    borderRadius: '9px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 700,
    lineHeight: 1.4,
    overflow: 'hidden',
    padding: '8px 11px',
    position: 'relative',
    transition:
      'background-color 160ms ease, border-color 160ms ease, color 160ms ease, transform 120ms ease',
  } satisfies CSSProperties,
  copyButton: {
    backgroundColor: '#F9FAFB',
    color: '#374151',
  } satisfies CSSProperties,
  copiedButton: {
    backgroundColor: '#ECFDF5',
    borderColor: 'rgba(16, 185, 129, 0.24)',
    color: '#10B981',
  } satisfies CSSProperties,
  deleteButton: {
    backgroundColor: '#FFFFFF',
    color: '#EF4444',
  } satisfies CSSProperties,
  pagination: {
    alignItems: 'center',
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '22px',
  } satisfies CSSProperties,
  empty: {
    alignItems: 'center',
    color: '#6B7280',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    justifyContent: 'center',
    padding: '34px 16px',
    textAlign: 'center',
  } satisfies CSSProperties,
  emptyIcon: {
    color: '#C4B5FD',
    height: '58px',
    width: '58px',
  } satisfies CSSProperties,
  toast: {
    backgroundColor: '#111827',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    bottom: '24px',
    boxShadow: '0 16px 40px rgba(17, 24, 39, 0.22)',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 700,
    left: '50%',
    padding: '13px 16px',
    position: 'fixed',
    transform: 'translateX(-50%) translateY(20px)',
    zIndex: 50,
  } satisfies CSSProperties,
  skeletonHeader: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB',
    boxShadow: '0 1px 0 #E5E7EB',
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    padding: '18px 32px',
  } satisfies CSSProperties,
  skeletonLine: {
    animation: 'dashboard-skeleton 1.3s ease-in-out infinite',
    background:
      'linear-gradient(90deg, #F3F4F6 0%, #FFFFFF 50%, #F3F4F6 100%)',
    backgroundSize: '220% 100%',
    borderRadius: '999px',
  } satisfies CSSProperties,
  skeletonPanel: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    boxShadow: '0 20px 50px rgba(17, 24, 39, 0.06)',
    display: 'grid',
    gap: '14px',
    padding: '28px',
  } satisfies CSSProperties,
};

interface FloatingUrlInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
}

function FloatingUrlInput({
  value,
  onChange,
  error,
  disabled = false,
}: FloatingUrlInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || value.length > 0;
  const hasError = Boolean(error);

  return (
    <div style={styles.field}>
      <div style={styles.inputWrap}>
        <input
          type="url"
          value={value}
          onChange={onChange}
          disabled={disabled}
          required
          maxLength={2048}
          autoComplete="url"
          aria-label="Cole a URL"
          aria-invalid={hasError}
          aria-describedby={hasError ? 'shorten-url-error' : undefined}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            ...styles.input,
            border: hasError
              ? '2px solid #EF4444'
              : isFocused
                ? '2px solid #7C3AED'
                : '1px solid #D1D5DB',
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
          Cole a URL
        </label>
      </div>
      {hasError && (
        <p id="shorten-url-error" role="alert" style={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={styles.empty}>
      <svg
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        style={styles.emptyIcon}
        viewBox="0 0 64 64"
      >
        <path d="M25 22l-4 4a10 10 0 0014 14l4-4" />
        <path d="M39 42l4-4a10 10 0 00-14-14l-4 4" />
        <path d="M22 48l20-32" />
      </svg>
      <p style={styles.muted}>Nenhum link criado ainda</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <main style={styles.page}>
      <header style={styles.skeletonHeader}>
        <div />
        <div style={{ ...styles.skeletonLine, height: '24px', width: '220px' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            style={{ ...styles.skeletonLine, height: '38px', width: '86px' }}
          />
        </div>
      </header>
      <div style={styles.content}>
        {[0, 1].map((panel) => (
          <section key={panel} style={styles.skeletonPanel}>
            <div
              style={{ ...styles.skeletonLine, height: '20px', width: '34%' }}
            />
            <div
              style={{ ...styles.skeletonLine, height: '54px', width: '100%' }}
            />
            <div
              style={{ ...styles.skeletonLine, height: '42px', width: '128px' }}
            />
          </section>
        ))}
      </div>
    </main>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading, isAuthenticated, logout } = useAuth();
  const [longUrl, setLongUrl] = useState('');
  const [shortenLoading, setShortenLoading] = useState(false);
  const [shortenError, setShortenError] = useState<string | null>(null);
  const [shortenResult, setShortenResult] =
    useState<ShortenUrlResponse | null>(null);
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [urlsLoading, setUrlsLoading] = useState(false);
  const [urlsError, setUrlsError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [showNewBadge, setShowNewBadge] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isShortenHovered, setIsShortenHovered] = useState(false);
  const toastTimers = useRef<number[]>([]);
  const copiedTimer = useRef<number | null>(null);
  const badgeTimer = useRef<number | null>(null);

  useEffect(() => {
    const animationTimer = window.setTimeout(() => {
      setIsPanelVisible(true);
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
      window.clearTimeout(animationTimer);
    };
  }, []);

  useEffect(
    () => () => {
      toastTimers.current.forEach((timer) => window.clearTimeout(timer));

      if (copiedTimer.current) {
        window.clearTimeout(copiedTimer.current);
      }

      if (badgeTimer.current) {
        window.clearTimeout(badgeTimer.current);
      }
    },
    [],
  );

  const isUrlValid = useMemo(
    () => longUrl.length <= 2048 && isValidUrl(longUrl),
    [longUrl],
  );
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_LIMIT));

  const showToast = useCallback((message: string) => {
    toastTimers.current.forEach((timer) => window.clearTimeout(timer));
    toastTimers.current = [];
    setToast(message);
    setIsToastVisible(true);

    const hideTimer = window.setTimeout(() => {
      setIsToastVisible(false);
    }, 2200);
    const removeTimer = window.setTimeout(() => {
      setToast(null);
    }, 2600);

    toastTimers.current = [hideTimer, removeTimer];
  }, []);

  const getShortUrl = useCallback(
    (shortCode: string) => `${shortUrlBase}/${shortCode}`,
    [],
  );

  const copyToClipboard = useCallback(
    async (value: string) => {
      try {
        await navigator.clipboard.writeText(value);
        setCopiedUrl(value);

        if (copiedTimer.current) {
          window.clearTimeout(copiedTimer.current);
        }

        copiedTimer.current = window.setTimeout(() => {
          setCopiedUrl(null);
        }, 2000);

        showToast('Copiado para a área de transferência!');
      } catch {
        showToast('Não foi possível copiar o link.');
      }
    },
    [showToast],
  );

  const loadUrls = useCallback(async (currentPage: number) => {
    setUrlsLoading(true);
    setUrlsError(null);

    try {
      const response = await apiCall(
        `${ENDPOINTS.GET_URLS}?page=${currentPage}&limit=${DEFAULT_PAGE_LIMIT}`,
      );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, 'Não foi possível carregar seus links.'),
        );
      }

      const data = await parseApiData<GetUrlsResponse>(response);
      setUrls(data.urls);
      setTotal(data.total);
      setPage(data.page);
    } catch (error) {
      setUrlsError(
        error instanceof Error
          ? error.message
          : 'Não foi possível carregar seus links.',
      );
    } finally {
      setUrlsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const timeoutId = window.setTimeout(() => {
        void loadUrls(page);
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }
  }, [isAuthenticated, loadUrls, page]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShortenError(null);

    if (!isUrlValid) {
      setShortenError('Informe uma URL válida com até 2048 caracteres.');
      return;
    }

    setShortenLoading(true);

    try {
      const response = await apiCall(ENDPOINTS.SHORTEN, {
        method: 'POST',
        body: JSON.stringify({ longUrl }),
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, 'Não foi possível encurtar a URL.'),
        );
      }

      const data = await parseApiData<ShortenUrlResponse>(response);
      setShortenResult(data);
      setShowNewBadge(true);
      setLongUrl('');
      await loadUrls(1);

      if (badgeTimer.current) {
        window.clearTimeout(badgeTimer.current);
      }

      badgeTimer.current = window.setTimeout(() => {
        setShowNewBadge(false);
      }, 3000);
    } catch (error) {
      setShortenError(
        error instanceof Error
          ? error.message
          : 'Não foi possível encurtar a URL.',
      );
    } finally {
      setShortenLoading(false);
    }
  };

  const handleDelete = async (shortCode: string) => {
    const confirmed = window.confirm('Tem certeza que deseja deletar este link?');

    if (!confirmed) {
      return;
    }

    try {
      const response = await apiCall(
        ENDPOINTS.DELETE_URL.replace(':shortCode', shortCode),
        { method: 'DELETE' },
      );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, 'Não foi possível deletar o link.'),
        );
      }

      showToast('Link deletado com sucesso.');
      await loadUrls(page);
    } catch (error) {
      setUrlsError(
        error instanceof Error
          ? error.message
          : 'Não foi possível deletar o link.',
      );
    }
  };

  const resetShortener = () => {
    setShortenResult(null);
    setShortenError(null);
    setLongUrl('');
    setShowNewBadge(false);
  };

  const createdShortUrl = shortenResult
    ? getShortenResultUrl(shortenResult)
    : null;

  if (isAuthLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <main style={styles.page}>
      <style>
        {`
          @keyframes dashboard-spin {
            to { transform: rotate(360deg); }
          }

          @keyframes dashboard-shimmer {
            0% { transform: translateX(-120%) skewX(-18deg); }
            100% { transform: translateX(220%) skewX(-18deg); }
          }

          @keyframes dashboard-skeleton {
            0% { background-position: 220% 0; }
            100% { background-position: -220% 0; }
          }

          @keyframes dashboard-card-in {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes dashboard-toast-in {
            from { opacity: 0; transform: translateX(-50%) translateY(20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
          }

          @keyframes dashboard-toast-out {
            from { opacity: 1; transform: translateX(-50%) translateY(0); }
            to { opacity: 0; transform: translateX(-50%) translateY(20px); }
          }

          .dashboard-primary-button::before,
          .dashboard-delete-button::before {
            content: "";
            height: 160%;
            left: 0;
            opacity: 0;
            position: absolute;
            top: -30%;
            transform: translateX(-120%) skewX(-18deg);
            width: 48%;
          }

          .dashboard-primary-button::before {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.46), transparent);
          }

          .dashboard-primary-button.is-loading::before {
            animation: dashboard-shimmer 1.15s ease-in-out infinite;
            opacity: 1;
          }

          .dashboard-logout:hover {
            border-color: #7C3AED;
            color: #7C3AED;
          }

          .dashboard-url-card {
            animation: dashboard-card-in 360ms ease-out forwards;
          }

          .dashboard-url-card:hover {
            border-color: #C4B5FD;
            box-shadow: 0 4px 16px rgba(124, 58, 237, 0.1);
            transform: translateY(-2px);
          }

          .dashboard-delete-button::before {
            background: linear-gradient(90deg, transparent, rgba(239,68,68,0.16), transparent);
          }

          .dashboard-delete-button:hover {
            background: #FEF2F2;
          }

          .dashboard-delete-button:hover::before {
            animation: dashboard-shimmer 1s ease-in-out infinite;
            opacity: 1;
          }

          .dashboard-delete-button:active {
            transform: scale(0.97);
          }

          .dashboard-toast-visible {
            animation: dashboard-toast-in 240ms ease-out forwards;
          }

          .dashboard-toast-hidden {
            animation: dashboard-toast-out 260ms ease-in forwards;
          }
        `}
      </style>

      <header style={styles.header}>
        <h1 style={styles.title}>𝑳𝒊𝒏𝒌 𝑺𝒉𝒐𝒓𝒕𝒆𝒏𝒆𝒓</h1>
        <div style={styles.logout}>
          <button
            className="dashboard-logout"
            type="button"
            onClick={logout}
            style={styles.secondaryButton}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={styles.content}>
        <section
          aria-labelledby="shorten-title"
          style={{
            ...styles.panel,
            ...(isPanelVisible ? styles.panelVisible : {}),
          }}
        >
          <h2 id="shorten-title" style={styles.sectionTitle}>
            Encurtar URL
          </h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <FloatingUrlInput
              value={longUrl}
              onChange={(event) => {
                setLongUrl(event.target.value);
                setShortenError(null);
              }}
              error={
                longUrl && !isUrlValid
                  ? 'Informe uma URL válida com até 2048 caracteres.'
                  : undefined
              }
              disabled={shortenLoading}
            />

            <div style={styles.actionsRow}>
              <button
                className={`dashboard-primary-button${
                  shortenLoading ? ' is-loading' : ''
                }`}
                type="submit"
                disabled={!isUrlValid || shortenLoading}
                onMouseEnter={() => setIsShortenHovered(true)}
                onMouseLeave={() => setIsShortenHovered(false)}
                style={{
                  ...styles.primaryButton,
                  cursor:
                    !isUrlValid || shortenLoading ? 'not-allowed' : 'pointer',
                  opacity: !isUrlValid || shortenLoading ? 0.56 : 1,
                  transform:
                    isShortenHovered && isUrlValid && !shortenLoading
                      ? 'scale(1.01)'
                      : 'scale(1)',
                }}
              >
                {shortenLoading && (
                  <span aria-hidden="true" style={styles.spinner} />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>
                  {shortenLoading ? 'Encurtando...' : 'Encurtar'}
                </span>
              </button>
            </div>

            {shortenError && (
              <p role="alert" style={styles.error}>
                {shortenError}
              </p>
            )}
          </form>

          {shortenResult && createdShortUrl && (
            <div style={{ ...styles.result, ...styles.resultVisible }}>
              <div style={styles.resultTop}>
                <p style={styles.muted}>
                  Link criado para {user?.name || 'você'}:
                </p>
                {showNewBadge && <span style={styles.badge}>Novo</span>}
              </div>
              <div style={styles.resultRow}>
                <a
                  href={createdShortUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.shortLink}
                >
                  {createdShortUrl}
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard(createdShortUrl)}
                  style={{ ...styles.smallButton, ...styles.copyButton }}
                >
                  ⧉ Copiar
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={resetShortener}
                  style={styles.secondaryButton}
                >
                  Encurtar Novo Link
                </button>
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="links-title" style={styles.listPanel}>
          <div style={styles.listHeader}>
            <h2 id="links-title" style={{ ...styles.sectionTitle, margin: 0 }}>
              Seus Links
            </h2>
            <p style={styles.muted}>
              Página {page} de {totalPages}
            </p>
          </div>

          {urlsLoading && (
            <div style={styles.list}>
              {[0, 1, 2].map((skeleton) => (
                <div key={skeleton} style={styles.skeletonPanel}>
                  <div
                    style={{
                      ...styles.skeletonLine,
                      height: '18px',
                      width: '46%',
                    }}
                  />
                  <div
                    style={{
                      ...styles.skeletonLine,
                      height: '16px',
                      width: '78%',
                    }}
                  />
                  <div
                    style={{
                      ...styles.skeletonLine,
                      height: '14px',
                      width: '28%',
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {urlsError && (
            <p role="alert" style={styles.error}>
              {urlsError}
            </p>
          )}

          {!urlsLoading && urls.length === 0 && !urlsError && <EmptyState />}

          {!urlsLoading && urls.length > 0 && (
            <div style={styles.list}>
              {urls.map((url, index) => {
                const shortUrl = getShortUrl(url.shortCode);
                const isCopied = copiedUrl === shortUrl;

                return (
                  <article
                    className="dashboard-url-card"
                    key={url._id}
                    style={{
                      ...styles.item,
                      animationDelay: `${index * 60}ms`,
                    }}
                  >
                    <div style={styles.itemTop}>
                      <div style={styles.itemInfo}>
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.shortLink}
                        >
                          {shortUrl}
                        </a>
                        <p title={url.longUrl} style={styles.originalUrl}>
                          {truncateUrl(url.longUrl)}
                        </p>
                        <p style={styles.date}>{formatDate(url.createdAt)}</p>
                      </div>

                      <div style={styles.itemActions}>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(shortUrl)}
                          style={{
                            ...styles.smallButton,
                            ...(isCopied
                              ? styles.copiedButton
                              : styles.copyButton),
                          }}
                        >
                          {isCopied ? '✓ Copiado!' : 'Copiar'}
                        </button>
                        <button
                          className="dashboard-delete-button"
                          type="button"
                          onClick={() => handleDelete(url.shortCode)}
                          style={{
                            ...styles.smallButton,
                            ...styles.deleteButton,
                          }}
                        >
                          Deletar
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div style={styles.pagination}>
            <button
              type="button"
              disabled={page <= 1 || urlsLoading}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              style={{
                ...styles.secondaryButton,
                cursor: page <= 1 || urlsLoading ? 'not-allowed' : 'pointer',
                opacity: page <= 1 || urlsLoading ? 0.4 : 1,
              }}
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={page >= totalPages || urlsLoading}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              style={{
                ...styles.secondaryButton,
                cursor:
                  page >= totalPages || urlsLoading ? 'not-allowed' : 'pointer',
                opacity: page >= totalPages || urlsLoading ? 0.4 : 1,
              }}
            >
              Próximo
            </button>
          </div>
        </section>
      </div>

      {toast && (
        <div
          className={
            isToastVisible ? 'dashboard-toast-visible' : 'dashboard-toast-hidden'
          }
          style={styles.toast}
        >
          {toast}
        </div>
      )}
    </main>
  );
}
