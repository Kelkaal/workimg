export const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.staging.soma.emerj.net/api/v1";

export async function apiRequest(
  url: string,
  options: RequestInit = {},
  token?: string
) {
  const res = await fetch(`${BACKEND_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}
