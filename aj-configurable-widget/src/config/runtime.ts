export interface RuntimeConfig {
  /** 
   * 管理端 API 根路径，例如 /api 或 https://host/dataservice_api
   */
  adminApiRoot: string;
}

declare global {
  interface Window {
    __AJ_DATASERVICE_CONFIG__?: Partial<RuntimeConfig>;
  }
}

/**
 * 规范化 API 根路径，避免后续拼接时出现重复斜杠。
 *
 * @param value 原始根路径。
 * @returns 去除末尾斜杠后的根路径。
 */
const normalizeRoot = (value: string): string => value.replace(/\/$/, "");

/**
 * 当前运行环境的服务地址与环境选择配置。
 */
export const runtimeConfig: RuntimeConfig = {
  adminApiRoot: normalizeRoot(window.__AJ_DATASERVICE_CONFIG__?.adminApiRoot ?? import.meta.env.VITE_DS_API_ROOT ?? "/api")
};