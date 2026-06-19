export type UserRole = "ADMIN" | "TRADER";

export type ApiUser = {
  id: string;
  email: string;
  fullName: string;
  age: number | null;
  photoUrl: string | null;
  role: UserRole;
  balanceBRL: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiCryptocurrency = {
  id: string;
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  initialPrice: string;
  currentPrice: string;
  totalSupply: string;
  availableSupply: string;
  categoryUid: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiCryptocurrencyList = {
  items: ApiCryptocurrency[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  age?: number;
  photoUrl?: string;
};

export type CreateTraderPayload = {
  fullName: string;
  email: string;
  password: string;
  age?: number;
  photoUrl?: string;
};

export type CreateCryptocurrencyPayload = {
  name: string;
  categoryUid: string;
  symbol: string;
  initialPrice: number;
  quantity: number;
  imageUrl: string;
  description: string;
};

type ApiRequestOptions = RequestInit & {
  cookieHeader?: string;
};

type ApiErrorBody = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly body?: ApiErrorBody,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { cookieHeader, ...fetchOptions } = options;
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (cookieHeader) {
    headers.set("Cookie", cookieHeader);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await response.json().catch(() => undefined);

  if (response.ok) {
    return body as T;
  }

  throw new ApiError(getApiErrorMessage(body), response.status, body);
}

export async function login(payload: LoginPayload) {
  return apiRequest<{ user: ApiUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerUser(payload: RegisterPayload) {
  return apiRequest<{ user: ApiUser }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  return apiRequest<void>("/auth/logout", {
    method: "POST",
  });
}

export async function getCurrentUser(cookieHeader?: string) {
  return apiRequest<ApiUser>("/auth/me", {
    cache: "no-store",
    cookieHeader,
  });
}

export async function createTrader(payload: CreateTraderPayload) {
  return apiRequest<ApiUser>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createCryptocurrency(
  payload: CreateCryptocurrencyPayload,
) {
  return apiRequest<ApiCryptocurrency>("/cryptocurrencies", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listCryptocurrencies(cookieHeader?: string) {
  return apiRequest<ApiCryptocurrencyList>(
    "/cryptocurrencies?page=1&pageSize=100",
    {
      cache: "no-store",
      cookieHeader,
    },
  );
}

export function getHomePathByRole(role: UserRole) {
  return role === "ADMIN" ? "/admin/home" : "/home";
}

export function getApiErrorMessage(errorBody: unknown): string {
  if (!isApiErrorBody(errorBody)) {
    return "Não foi possível concluir a operação";
  }

  if (Array.isArray(errorBody.message)) {
    return errorBody.message.join(", ");
  }

  return errorBody.message ?? "Não foi possível concluir a operação";
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return typeof value === "object" && value !== null;
}
