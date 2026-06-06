import type { ShortUrl } from '../@types';

interface UrlItemProps {
  url: ShortUrl;
}

export function UrlItem({ url }: UrlItemProps) {
  return (
    <article>
      <a href={url.longUrl} target="_blank" rel="noreferrer">
        {url.shortCode}
      </a>
    </article>
  );
}
