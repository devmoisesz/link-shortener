import type {
  ApiError,
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterRequest,
} from '../@types';
import { ENDPOINTS } from '../utils/constants';
import { apiCall } from './api';

const parseApiData = async <T>(response: Response): Promise<T> => {
  const payload = (await response.json()) as T | ApiResponse<T>;

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data;
  }

  return payload as T;
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

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiCall(ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, 'Nao foi possivel fazer login.'));
  }

  return parseApiData<LoginResponse>(response);
}

export async function register(
  data: RegisterRequest,
): Promise<LoginResponse | void> {
  const response = await apiCall(ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, 'Nao foi possivel criar a conta.'),
    );
  }

  if (response.status === 204) {
    return undefined;
  }

  return parseApiData<LoginResponse>(response);
}

export async function refresh(refreshToken: string): Promise<RefreshResponse> {
  const response = await apiCall(ENDPOINTS.REFRESH, {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, 'Nao foi possivel renovar a sessao.'),
    );
  }

  return parseApiData<RefreshResponse>(response);
}
