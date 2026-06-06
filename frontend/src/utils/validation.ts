export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);

    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

export const validateRequired = (value: string): boolean =>
  value.trim().length > 0;

export const validateMinLength = (value: string, minLength: number): boolean =>
  value.trim().length >= minLength;

export const validateMaxLength = (value: string, maxLength: number): boolean =>
  value.length <= maxLength;
