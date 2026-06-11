/* Backend API clients for PG admin web */

const PG_AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL || "/backend/auth";
const PG_MERCHANT_API_BASE_URL = import.meta.env.VITE_MERCHANT_API_BASE_URL || "/backend/merchant";
const PG_SESSION_KEY = "erumpay.pg.session";

class PgApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = "PgApiError";
    this.status = status;
    this.code = code;
  }
}

const pgReadBody = async response => {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return response.ok ? text : { message: text };
  }
};

const pgRequest = async (baseUrl, path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const body = await pgReadBody(response);
  if (!response.ok) {
    throw new PgApiError(
      body?.message || "요청 처리 중 오류가 발생했습니다.",
      response.status,
      body?.code
    );
  }
  return body;
};

const PgSession = {
  get: () => {
    try {
      return JSON.parse(sessionStorage.getItem(PG_SESSION_KEY)) || {};
    } catch {
      return {};
    }
  },
  set: value => sessionStorage.setItem(PG_SESSION_KEY, JSON.stringify(value)),
  clear: () => sessionStorage.removeItem(PG_SESSION_KEY),
  isAuthenticated: () => Boolean(PgSession.get().accessToken),
  authHeaders: () => {
    const { accessToken } = PgSession.get();
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  },
};

const PgAdminApi = {
  login: async ({ loginId, password, totpCode }) => {
    const response = await pgRequest(PG_AUTH_API_BASE_URL, "/api/v1/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({
        login_id: loginId,
        password,
        totp_code: totpCode,
      }),
    });
    PgSession.set({
      loginId,
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      role: response.role,
    });
    return response;
  },
  logout: async () => {
    const { refreshToken } = PgSession.get();
    try {
      if (refreshToken) {
        await pgRequest(PG_AUTH_API_BASE_URL, "/api/v1/auth/admin/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
      }
    } finally {
      PgSession.clear();
    }
  },
  getPendingMerchants: async () => {
    const response = await pgRequest(
      PG_MERCHANT_API_BASE_URL,
      "/api/v1/pg-admin/merchants?page=0&size=100&sort=createdAt,desc",
      { headers: PgSession.authHeaders() }
    );
    return (response?.content || []).filter(merchant => merchant.status === "PENDING");
  },
  approveMerchant: merchantId => pgRequest(
    PG_AUTH_API_BASE_URL,
    `/api/v1/pg-admin/merchants/${merchantId}/approve`,
    {
      method: "PATCH",
      headers: PgSession.authHeaders(),
    }
  ),
  getAuditLogs: async (page = 0, size = 20) => pgRequest(
    PG_AUTH_API_BASE_URL,
    `/api/v1/pg-admin/audit-logs?page=${page}&size=${size}`,
    { headers: PgSession.authHeaders() }
  ),
};

Object.assign(window, { PgApiError, PgSession, PgAdminApi });
