export function withQuery(
  path: string,
  params?: Record<string, string | number | undefined | null>,
) {
  if (!params) return path;

  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `${path}?${query}` : path;
}
