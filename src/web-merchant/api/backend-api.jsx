/* Backend API clients for merchant web */

const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL || "/backend/auth";
const MERCHANT_API_BASE_URL = import.meta.env.VITE_MERCHANT_API_BASE_URL || "/backend/merchant";
const SESSION_KEY = "erumpay.merchant.session";
const PROFILE_KEY = "erumpay.merchant.profile";

// Remove tokens left by older builds that used persistent browser storage.
try {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(PROFILE_KEY);
} catch {
  // Storage may be unavailable in restricted browser contexts.
}

class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const readJson = async (response) => {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return response.ok ? text : { message: text };
  }
};

const request = async (baseUrl, path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const body = await readJson(response);

  if (!response.ok) {
    throw new ApiError(
      body?.message || "요청 처리 중 오류가 발생했습니다.",
      response.status,
      body?.code,
      body?.details || []
    );
  }
  return body;
};

const AuthSession = {
  get: () => {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || {};
    } catch {
      return {};
    }
  },
  set: (value) => sessionStorage.setItem(SESSION_KEY, JSON.stringify(value)),
  merge: (value) => AuthSession.set({ ...AuthSession.get(), ...value }),
  clear: () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(PROFILE_KEY);
  },
  isAuthenticated: () => {
    const session = AuthSession.get();
    return Boolean(session.accessToken && session.status === "ACTIVE");
  },
  getProfile: () => {
    try {
      return JSON.parse(sessionStorage.getItem(PROFILE_KEY));
    } catch {
      return null;
    }
  },
  setProfile: (profile) => sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile)),
};

const getAuthHeaders = () => {
  const { accessToken } = AuthSession.get();
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

const refreshAccessToken = async () => {
  const { refreshToken } = AuthSession.get();
  if (!refreshToken) {
    throw new ApiError("로그인 세션이 만료되었습니다.", 401, "REFRESH_TOKEN_REQUIRED");
  }

  const response = await request(AUTH_API_BASE_URL, "/api/v1/auth/token/refresh", {
    method: "POST",
    headers: { Authorization: `Bearer ${refreshToken}` },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  AuthSession.merge({
    accessToken: response.access_token,
    refreshToken: response.refresh_token || refreshToken,
  });
  return response.access_token;
};

let refreshPromise = null;

const getRefreshedAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken()
      .catch(error => {
        AuthSession.clear();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

const authorizedRequest = async (baseUrl, path, options = {}) => {
  const accessTokenAtRequest = AuthSession.get().accessToken;
  try {
    return await request(baseUrl, path, {
      ...options,
      headers: { ...getAuthHeaders(), ...options.headers },
    });
  } catch (error) {
    const currentSession = AuthSession.get();
    if (error.status !== 401 || !currentSession.refreshToken) throw error;

    let accessToken = currentSession.accessToken;
    if (!accessToken || accessToken === accessTokenAtRequest) {
      accessToken = await getRefreshedAccessToken();
    }

    return request(baseUrl, path, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      },
    });
  }
};

const AuthApi = {
  getKakaoAuthorizeUrl: () => {
    const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI || `${window.location.origin}/`;
    if (!clientId) throw new ApiError("VITE_KAKAO_CLIENT_ID가 설정되지 않았습니다.", 0, "KAKAO_CONFIG_REQUIRED");
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
    });
    return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
  },
  startKakaoLogin: () => {
    window.location.href = AuthApi.getKakaoAuthorizeUrl();
  },
  loginWithKakaoCode: async (code) => {
    const response = await request(AUTH_API_BASE_URL, "/api/v1/auth/merchant/kakao/login", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    AuthSession.merge({
      accountId: response.account_id,
      merchantId: response.merchant_id,
      status: response.status,
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      signupToken: response.signup_token,
    });
    return response;
  },
  refresh: refreshAccessToken,
  agreeTerms: async ({ serviceTermsAgreed, privacyPolicyAgreed, marketingAgreed }) => {
    const { signupToken } = AuthSession.get();
    return request(AUTH_API_BASE_URL, "/api/v1/auth/merchant/terms/agree", {
      method: "POST",
      headers: { Authorization: `Bearer ${signupToken}` },
      body: JSON.stringify({
        service_terms_agreed: serviceTermsAgreed,
        privacy_policy_agreed: privacyPolicyAgreed,
        marketing_agreed: marketingAgreed,
        terms_version: "2026-06-01",
      }),
    });
  },
  signup: async (form) => {
    const { signupToken } = AuthSession.get();
    const response = await request(AUTH_API_BASE_URL, "/api/v1/auth/merchant/signup", {
      method: "POST",
      headers: { Authorization: `Bearer ${signupToken}` },
      body: JSON.stringify({
        business_number: form.businessNumber,
        merchant_name: form.merchantName,
        mcc_code: form.mccCode,
        representative_name: form.representativeName,
        contact_email: form.contactEmail,
        contact_phone: form.contactPhone,
        business_address: [form.businessAddress, form.businessAddressDetail].filter(Boolean).join(" "),
        settlement_account: form.settlementAccount,
        bank_name: form.bankName,
        service_name: form.serviceName,
      }),
    });
    AuthSession.merge({ merchantId: response.merchant_id, status: response.status });
    return response;
  },
  logout: async () => {
    const session = AuthSession.get();
    try {
      if (session.refreshToken) {
        await request(AUTH_API_BASE_URL, "/api/v1/auth/merchant/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${session.refreshToken}` },
          body: JSON.stringify({
            refresh_token: session.refreshToken,
            access_token: session.accessToken,
          }),
        });
      }
    } finally {
      AuthSession.clear();
    }
  },
};

const MerchantBackendApi = {
  getMerchant: async (merchantId = AuthSession.get().merchantId) => {
    if (!merchantId) return null;
    const profile = await authorizedRequest(
      MERCHANT_API_BASE_URL,
      `/api/v1/pg-admin/merchants/${merchantId}`
    );
    AuthSession.setProfile(profile);
    return profile;
  },
  updateMerchant: async (merchantId, payload) => {
    const profile = await authorizedRequest(MERCHANT_API_BASE_URL, `/api/v1/pg-admin/merchants/${merchantId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    AuthSession.setProfile(profile);
    return profile;
  },
};

Object.assign(window, { ApiError, AuthApi, AuthSession, MerchantBackendApi });
