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

export const validatePassword = (password: string): boolean =>
  password.length >= 6;

export const validateName = (name: string): boolean => {
  const trimmedName = name.trim();

  return trimmedName.length >= 3 && trimmedName.length <= 100;
};

export const matchPasswords = (
  password: string,
  confirmPassword: string,
): boolean => password === confirmPassword;
