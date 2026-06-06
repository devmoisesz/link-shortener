import type { ApiResponse, RefreshResponse } from '../@types/auth';
import { API_URL, ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

let refreshTokenRequest: Promise<string | null> | null = null;

const buildUrl = (url: string): string => {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `${API_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

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
    // Ignore storage errors. The request can still continue with in-memory data.
  }
};

const removeAuthData = (): void => {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    window.localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    window.localStorage.removeItem(STORAGE_KEYS.USER);
  } catch {
    // Ignore storage errors while forcing the app back to the login flow.
  }
};

const handleLogout = (): void => {
  removeAuthData();
  window.dispatchEvent(new Event('logout'));
  window.location.href = '/login';
};

const getAccessTokenFromRefreshResponse = async (
  response: Response,
): Promise<string | null> => {
  try {
    const payload = (await response.json()) as
      | RefreshResponse
      | ApiResponse<RefreshResponse>;

    if ('accessToken' in payload) {
      return payload.accessToken;
    }

    return payload.data.accessToken;
  } catch {
    return null;
  }
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getStorageItem(STORAGE_KEYS.REFRESH_TOKEN);

  if (!refreshToken) {
    return null;
  }

  const response = await fetch(buildUrl(ENDPOINTS.REFRESH), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    return null;
  }

  const accessToken = await getAccessTokenFromRefreshResponse(response);

  if (!accessToken) {
    return null;
  }

  setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

  return accessToken;
};

const getRefreshTokenRequest = (): Promise<string | null> => {
  if (!refreshTokenRequest) {
    refreshTokenRequest = refreshAccessToken().finally(() => {
      refreshTokenRequest = null;
    });
  }

  return refreshTokenRequest;
};

const createHeaders = (
  optionsHeaders: RequestInit['headers'],
  accessToken?: string | null,
): Headers => {
  const headers = new Headers(optionsHeaders);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return headers;
};

export async function apiCall(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const accessToken = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
  const requestUrl = buildUrl(url);
  const requestOptions: RequestInit = {
    ...options,
    headers: createHeaders(options.headers, accessToken),
  };

  const response = await fetch(requestUrl, requestOptions);

  if (response.status !== 401 || url === ENDPOINTS.REFRESH) {
    return response;
  }

  try {
    const newAccessToken = await getRefreshTokenRequest();

    if (!newAccessToken) {
      handleLogout();
      return response;
    }

    return fetch(requestUrl, {
      ...options,
      headers: createHeaders(options.headers, newAccessToken),
    });
  } catch {
    handleLogout();
    return response;
  }
}
