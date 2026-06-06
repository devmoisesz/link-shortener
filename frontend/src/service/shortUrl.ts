import { DEFAULT_PAGE_LIMIT, ENDPOINTS } from '../utils/constants';
import { apiCall } from './api';

async function shortenUrl(longUrl: string): Promise<Response> {
  return apiCall(ENDPOINTS.SHORTEN, {
    method: 'POST',
    body: JSON.stringify({ longUrl }),
  });
}

async function getUserUrls(
  page: number = 1,
  limit: number = DEFAULT_PAGE_LIMIT,
): Promise<Response> {
  return apiCall(`${ENDPOINTS.GET_URLS}?page=${page}&limit=${limit}`);
}

async function deleteUrl(shortCode: string): Promise<Response> {
  return apiCall(ENDPOINTS.DELETE_URL.replace(':shortCode', shortCode), {
    method: 'DELETE',
  });
}

export { deleteUrl, getUserUrls, shortenUrl };

export default {
  shortenUrl,
  getUserUrls,
  deleteUrl,
};
