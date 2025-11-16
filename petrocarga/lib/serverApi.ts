import { cookies } from "next/headers";

export async function serverApi(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  const isJson =
    options.body && typeof options.body === "string";

  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
    ...(isJson ? { "Content-Type": "application/json" } : {}),
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(`Erro na serverApi: [${res.status}] ${path}`);
  }

  return res;
}
