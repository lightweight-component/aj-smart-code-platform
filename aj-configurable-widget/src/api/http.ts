/** 数据服务统一响应；保留额外响应字段供配置回调使用。 */
export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message?: string;
  [key: string]: unknown;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  /** 自动序列化为 JSON 的请求体。 */
  body?: unknown;
  /** GET 查询参数；数组按同名参数展开，空值跳过。 */
  params?: Record<string, unknown>;
}

function queryUrl(url: string, params?: Record<string, unknown>): string {
  if (!params) return url;
  const hashIndex = url.indexOf("#");
  const hash = hashIndex < 0 ? "" : url.slice(hashIndex);
  const base = hashIndex < 0 ? url : url.slice(0, hashIndex);
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item !== undefined && item !== null)
        query.append(key, item instanceof Date ? item.toISOString() : String(item));
    }
  }
  const encoded = query.toString();
  return encoded ? base + (base.includes("?") ? (/[?&]$/.test(base) ? "" : "&") : "?") + encoded + hash : url;
}

/** 获取完整业务响应，业务失败交由组件中的原有提示逻辑处理。 */
export async function requestResponse<T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { body, params, headers, ...init } = options;
  const requestHeaders = new Headers(headers);
  if (body !== undefined && !requestHeaders.has("Content-Type"))
    requestHeaders.set("Content-Type", "application/json");
  const response = await fetch(queryUrl(url, params), {
    credentials: "include",
    ...init,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok)
    throw new Error(`请求失败（${response.status}）`);
  const contentType = response.headers.get("content-type") ?? "";
  if (!/application\/(?:[\w.-]+\+)?json\b/i.test(contentType))
    throw new Error("接口未返回 JSON；请检查 VITE_DS_API_ROOT 或 VITE_DEV_PROXY_TARGET 配置");
  const result: unknown = await response.json();
  if (!result || typeof result !== "object" || typeof (result as ApiResponse<T>).status !== "boolean")
    throw new Error("接口响应格式错误：缺少 boolean 类型的 status 字段");
  return result as ApiResponse<T>;
}

/** 获取业务数据，HTTP、格式和业务错误均抛出异常。 */
export async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const result = await requestResponse<T>(url, options);
  if (!result.status)
    throw new Error(result.message || "服务端未完成请求");
  return result.data;
}
