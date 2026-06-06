import type { CSSProperties } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

const typeColors = {
  success: '#10B981',
  error: '#EF4444',
  info: '#3B82F6',
  warning: '#F59E0B',
} as const;

const toastStyle: CSSProperties = {
  borderRadius: '8px',
  boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
  color: '#FFFFFF',
  fontSize: '14px',
  fontWeight: 600,
  padding: '12px 16px',
};

export function Toast({ message, type = 'info' }: ToastProps) {
  return (
    <div role="status" style={{ ...toastStyle, backgroundColor: typeColors[type] }}>
      {message}
    </div>
  );
}
