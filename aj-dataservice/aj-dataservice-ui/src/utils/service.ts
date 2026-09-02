import type {
  DataServiceProject,
  ProjectTreeNode,
  ServiceConfig,
  ServiceTreeNode,
} from "../types/dataservice";

/** 后端约定：该字符串表示采用框架默认 SQL 逻辑。 */
export const EMPTY_SQL = "__NULL_STRING__";

/**
 * 深度标准化服务及子服务，避免树节点共享同一个 `children` 引用。
 *
 * @param service 原始服务配置。
 * @returns 可安全用于界面状态的服务配置副本。
 */
export function normalizeService(service: ServiceConfig): ServiceConfig {
  return {
    ...service,
    children: service.children?.map(normalizeService),
  };
}

/**
 * 将服务配置转换为前端树节点。
 *
 * @param project 服务所属项目。
 * @param service 原始服务配置。
 * @returns 包含稳定键和子节点的服务树节点。
 */
function toServiceNode(
  project: DataServiceProject,
  service: ServiceConfig,
): ServiceTreeNode {
  const normalized = normalizeService(service);
  return {
    key: `${project.id ?? project.name}:${normalized.id ?? normalized.namespace}`,
    service: normalized,
    children: (normalized.children ?? []).map((child) =>
      toServiceNode(project, child),
    ),
  };
}

/**
 * 将项目列表和服务列表组合为左侧导航树。
 *
 * @param projects 项目配置列表。
 * @param services 服务配置列表。
 * @returns 按项目组织的树节点数组。
 */
export function buildProjectTree(
  projects: DataServiceProject[],
  services: ServiceConfig[],
): ProjectTreeNode[] {
  return projects.map((project) => ({
    key: `project:${project.id ?? project.name}`,
    project,
    services: services.map((service) => toServiceNode(project, service)),
  }));
}

/**
 * 创建尚未保存的服务草稿。
 *
 * @param kind 服务类型，CRUD 或单 SQL。
 * @param parentId 可选的父服务 ID；默认挂在根节点。
 * @returns 包含默认字段值的服务草稿。
 */
export function createDraft(
  kind: ServiceConfig["type"],
  parentId?: number,
): ServiceConfig {
  return {
    pid: parentId ?? -1,
    type: kind,
    namespace: "",
    name: "",
    tableName: "",
    idType: 1,
    hasIsDeleted: false,
    enable: true,
    sql: "",
    infoSql: EMPTY_SQL,
    listSql: EMPTY_SQL,
    createSql: EMPTY_SQL,
    updateSql: EMPTY_SQL,
    deleteSql: EMPTY_SQL,
  };
}

/**
 * 清理仅用于界面展示的字段，并转换后端要求的布尔值格式。
 *
 * @param service 编辑中的服务草稿。
 * @returns 可直接发送给后端的服务配置副本。
 */
export function cleanServiceForSave(service: ServiceConfig): ServiceConfig {
  const cleaned = { ...service } as Record<string, unknown>;
  delete cleaned.children;
  for (const [key, value] of Object.entries(cleaned)) {
    if (value === null || value === undefined || value === "")
      delete cleaned[key];
    if (typeof value === "boolean") cleaned[key] = value ? 1 : 0;
  }
  return cleaned as unknown as ServiceConfig;
}

/**
 * 获取服务在树和标签页中展示的名称。
 *
 * @param service 服务配置。
 * @returns 优先使用说明名称，缺失时回退到命名空间或占位文本。
 */
export function serviceLabel(service: ServiceConfig): string {
  return service.name || service.namespace || "未命名服务";
}
