import type {
  ApiError,
  ApiResponse,
  GetUrlsResponse,
  ShortenUrlResponse,
} from '../@types';
import { DEFAULT_PAGE_LIMIT, ENDPOINTS } from '../utils/constants';
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

export async function shortenUrl(longUrl: string): Promise<ShortenUrlResponse> {
  const response = await apiCall(ENDPOINTS.SHORTEN, {
    method: 'POST',
    body: JSON.stringify({ longUrl }),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, 'Nao foi possivel encurtar a URL.'),
    );
  }

  return parseApiData<ShortenUrlResponse>(response);
}

export async function getUserUrls(
  page = 1,
  limit = DEFAULT_PAGE_LIMIT,
): Promise<GetUrlsResponse> {
  const response = await apiCall(
    `${ENDPOINTS.GET_URLS}?page=${page}&limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, 'Nao foi possivel carregar seus links.'),
    );
  }

  return parseApiData<GetUrlsResponse>(response);
}

export async function deleteUrl(shortCode: string): Promise<void> {
  const response = await apiCall(
    ENDPOINTS.DELETE_URL.replace(':shortCode', shortCode),
    { method: 'DELETE' },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, 'Nao foi possivel deletar o link.'),
    );
  }
}
