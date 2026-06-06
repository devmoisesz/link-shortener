import {
  useCallback,
  useEffect,
  useMemo,
  useState,
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
import { Buttuon } from '../components/Buttuon';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
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

const truncateUrl = (url: string, maxLength = 80): string =>
  url.length > maxLength ? `${url.slice(0, maxLength)}...` : url;

const styles = {
  page: {
    background:
      'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 48%, #F3F4F6 100%)',
    color: '#111827',
    fontFamily:
      'Outfit, Poppins, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    minHeight: '100vh',
  } satisfies CSSProperties,
  header: {
    alignItems: 'center',
    borderBottom: '1px solid #E5E7EB',
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr auto 1fr',
    padding: '20px 32px',
  } satisfies CSSProperties,
  title: {
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
    gap: '28px',
    margin: '0 auto',
    maxWidth: '920px',
    padding: '32px 24px 48px',
  } satisfies CSSProperties,
  panel: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    boxShadow: '0 20px 50px rgba(17, 24, 39, 0.06)',
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
  actionsRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-start',
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
    borderRadius: '8px',
    display: 'grid',
    gap: '14px',
    marginTop: '20px',
    padding: '16px',
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
    fontWeight: 600,
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
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    display: 'grid',
    gap: '12px',
    padding: '16px',
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
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1.4,
    padding: '8px 12px',
    transition: 'background-color 160ms ease, opacity 160ms ease',
  } satisfies CSSProperties,
  copyButton: {
    backgroundColor: '#F9FAFB',
    color: '#374151',
  } satisfies CSSProperties,
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    color: '#DC2626',
  } satisfies CSSProperties,
  pagination: {
    alignItems: 'center',
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '20px',
  } satisfies CSSProperties,
  toast: {
    backgroundColor: '#111827',
    borderRadius: '8px',
    bottom: '24px',
    boxShadow: '0 16px 40px rgba(17, 24, 39, 0.22)',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 600,
    left: '50%',
    padding: '12px 16px',
    position: 'fixed',
    transform: 'translateX(-50%)',
    zIndex: 50,
  } satisfies CSSProperties,
};

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

  const isUrlValid = useMemo(
    () => longUrl.length <= 2048 && isValidUrl(longUrl),
    [longUrl],
  );
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_LIMIT));

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  const getShortUrl = useCallback(
    (shortCode: string) => `${shortUrlBase}/${shortCode}`,
    [],
  );

  const copyToClipboard = useCallback(
    async (value: string) => {
      try {
        await navigator.clipboard.writeText(value);
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
      void loadUrls(page);
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
      setLongUrl('');
      await loadUrls(1);
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
  };

  if (isAuthLoading) {
    return (
      <main style={styles.page}>
        <div style={styles.content}>
          <p style={styles.muted}>Carregando...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Link Shortener</h1>
        <div style={styles.logout}>
          <Buttuon variant="secondary" onClick={logout}>
            Logout
          </Buttuon>
        </div>
      </header>

      <div style={styles.content}>
        <section aria-labelledby="shorten-title" style={styles.panel}>
          <h2 id="shorten-title" style={styles.sectionTitle}>
            Encurtar URL
          </h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <Input
              label="Cole a URL"
              type="url"
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
              placeholder="https://exemplo.com/pagina"
              required
              maxLength={2048}
              autoComplete="url"
            />

            <div style={styles.actionsRow}>
              <Buttuon
                type="submit"
                variant="primary"
                loading={shortenLoading}
                loadingText="Encurtando..."
                disabled={!isUrlValid}
              >
                Encurtar
              </Buttuon>
            </div>

            {shortenError && (
              <p role="alert" style={styles.error}>
                {shortenError}
              </p>
            )}
          </form>

          {shortenResult && (
            <div style={styles.result}>
              <p style={styles.muted}>Link criado para {user?.name || 'você'}:</p>
              <div style={styles.resultRow}>
                <a
                  href={getShortUrl(shortenResult.shortCode)}
                  target="_blank"
                  rel="noreferrer"
                  style={styles.shortLink}
                >
                  {getShortUrl(shortenResult.shortCode)}
                </a>
                <Buttuon
                  variant="primary"
                  onClick={() =>
                    copyToClipboard(getShortUrl(shortenResult.shortCode))
                  }
                >
                  Copiar
                </Buttuon>
              </div>
              <div>
                <Buttuon variant="secondary" onClick={resetShortener}>
                  Encurtar Novo Link
                </Buttuon>
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="links-title" style={styles.panel}>
          <div style={styles.listHeader}>
            <h2 id="links-title" style={{ ...styles.sectionTitle, margin: 0 }}>
              Seus Links
            </h2>
            <p style={styles.muted}>
              Página {page} de {totalPages}
            </p>
          </div>

          {urlsLoading && <p style={styles.muted}>Carregando links...</p>}

          {urlsError && (
            <p role="alert" style={styles.error}>
              {urlsError}
            </p>
          )}

          {!urlsLoading && urls.length === 0 && !urlsError && (
            <p style={styles.muted}>Nenhum link criado ainda</p>
          )}

          {!urlsLoading && urls.length > 0 && (
            <div style={styles.list}>
              {urls.map((url) => {
                const shortUrl = getShortUrl(url.shortCode);

                return (
                  <article key={url._id} style={styles.item}>
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
                          style={{ ...styles.smallButton, ...styles.copyButton }}
                        >
                          Copiar
                        </button>
                        <button
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
            <Buttuon
              variant="secondary"
              disabled={page <= 1 || urlsLoading}
              onClick={() => setPage((currentPage) => currentPage - 1)}
            >
              Anterior
            </Buttuon>
            <Buttuon
              variant="secondary"
              disabled={page >= totalPages || urlsLoading}
              onClick={() => setPage((currentPage) => currentPage + 1)}
            >
              Próximo
            </Buttuon>
          </div>
        </section>
      </div>

      {toast && <div style={styles.toast}>{toast}</div>}
    </main>
  );
}
