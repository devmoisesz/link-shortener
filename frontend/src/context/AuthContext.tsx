import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ApiError, ApiResponse, LoginResponse, User } from '../@types/auth';
import { apiCall } from '../service/api';
import { ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  logout: () => void;
  error: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStorageItem = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setStorageItem = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors and keep the in-memory auth state usable.
  }
};

const removeAuthStorage = (): void => {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    window.localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    window.localStorage.removeItem(STORAGE_KEYS.USER);
  } catch {
    // Ignore storage errors while clearing the current session.
  }
};

const parseStoredUser = (storedUser: string | null): User | null => {
  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    return null;
  }
};

const parseLoginResponse = async (response: Response): Promise<LoginResponse> => {
  const payload = (await response.json()) as
    | LoginResponse
    | ApiResponse<LoginResponse>;

  if ('accessToken' in payload) {
    return payload;
  }

  return payload.data;
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

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(() => {
    removeAuthStorage();
    setUser(null);
    setError(null);
    window.location.href = '/login';
  }, []);

  useEffect(() => {
    const accessToken = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
    const storedUser = parseStoredUser(getStorageItem(STORAGE_KEYS.USER));

    if (accessToken && storedUser) {
      setUser(storedUser);
    } else if (!accessToken) {
      removeAuthStorage();
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      removeAuthStorage();
      setUser(null);
      setError(null);
      window.location.href = '/login';
    };

    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiCall(ENDPOINTS.LOGIN, {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error(
            await getErrorMessage(response, 'Nao foi possivel fazer login.'),
          );
        }

        const data = await parseLoginResponse(response);

        setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
        setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
        setStorageItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        setUser(data.user);
        window.location.href = '/dashboard';
      } catch (loginError) {
        const message =
          loginError instanceof Error
            ? loginError.message
            : 'Nao foi possivel fazer login.';

        setError(message);
        throw loginError;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      confirmPassword: string,
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        if (password !== confirmPassword) {
          throw new Error('As senhas nao conferem.');
        }

        const response = await apiCall(ENDPOINTS.REGISTER, {
          method: 'POST',
          body: JSON.stringify({ name, email, password, confirmPassword }),
        });

        if (!response.ok) {
          throw new Error(
            await getErrorMessage(response, 'Nao foi possivel criar a conta.'),
          );
        }

        await login(email, password);
      } catch (registerError) {
        const message =
          registerError instanceof Error
            ? registerError.message
            : 'Nao foi possivel criar a conta.';

        setError(message);
        throw registerError;
      } finally {
        setIsLoading(false);
      }
    },
    [login],
  );

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      error,
    }),
    [error, isLoading, login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
