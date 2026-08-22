export async function apiRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const requiresCsrf = !["GET", "HEAD", "OPTIONS"].includes(method);

  if (requiresCsrf) {
    await fetch("/sanctum/csrf-cookie", { credentials: "include" });
  }

  const csrfToken = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("XSRF-TOKEN="))
    ?.split("=")
    .slice(1)
    .join("=");

  const response = await fetch(path, {
    credentials: "include",
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-XSRF-TOKEN": decodeURIComponent(csrfToken) } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "Não foi possível concluir a solicitação.");
    error.status = response.status;
    error.fields = data.errors || {};
    throw error;
  }
  return data;
}
