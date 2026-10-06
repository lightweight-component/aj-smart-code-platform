import { joinUrl, runtimeConfig } from "../config/runtime";
import type { DataServiceProject, EndpointEntity, ServiceConfig, UrlGroup } from "../types/dataservice";
import { request } from "./http";

/** Java boolean 的 Jackson 属性名与前端模型之间的兼容结构。 */
type EndpointWire = EndpointEntity & { autoSql?: boolean; autoIns?: boolean };

function fromEndpointWire(endpoint: EndpointWire): EndpointEntity {
  return {
    ...endpoint,
    isAutoSql: endpoint.isAutoSql ?? endpoint.autoSql ?? false,
    isAutoIns: endpoint.isAutoIns ?? endpoint.autoIns ?? false,
  };
}

function toEndpointWire(endpoint: EndpointEntity): EndpointWire {
  return { ...endpoint, autoSql: endpoint.isAutoSql, autoIns: endpoint.isAutoIns };
}

/**
 * 构造管理端接口地址。
 *
 * @param path 管理端相对路径。
 * @returns 完整管理端接口 URL。
 */
const admin = (path: string): string =>
  joinUrl(runtimeConfig.adminApiRoot, path);

/**
 * 根据当前构建环境选择项目的开发或生产 API 前缀。
 *
 * @param project 当前数据服务项目。
 * @returns 用于读写服务配置的 API 根路径。
 */
const projectApiRoot = (project: DataServiceProject): string =>
  runtimeConfig.useProductionApi ? project.apiPrefixProd : project.apiPrefixDev;

/**
 * 构造某项目数据服务运行端的接口地址。
 *
 * @param project 所属项目。
 * @param path `common_api` 下的相对路径。
 * @returns 完整服务端接口 URL。
 */
const serviceUrl = (project: DataServiceProject, path: string): string =>
  joinUrl(projectApiRoot(project), `common_api/${path}`);

/** 数据服务管理端与运行端的请求集合。 */
export const dataServiceApi = {
  /** @returns 从根节点或指定节点开始加载的 URL 分组树。 */
  listUrlGroups: (parentId = -1) =>
    request<UrlGroup[] | null>(admin(`ds_tree/list/${parentId}`)),
  /** @param group 待创建的 URL 分组。 */
  createUrlGroup: (group: UrlGroup) =>
    request<boolean>(admin("ds_tree/"), { method: "POST", body: group }),
  /** @param id 待更新的分组主键。@param group 更新后的分组数据。 */
  updateUrlGroup: (id: number, group: UrlGroup) =>
    request<boolean>(admin(`ds_tree/${id}`), { method: "PUT", body: group }),
  /** @param id 待删除的分组主键。@param includeChildren 是否递归删除子分组。 */
  deleteUrlGroup: (id: number, includeChildren = false) =>
    request<boolean>(admin(`ds_tree/${id}?isDelSubNode=${includeChildren}`), { method: "DELETE" }),
  /** @returns 指定 URL 分组下的所有端点。 */
  listEndpoints: (groupId: number) =>
    request<EndpointWire[] | null>(admin(`ds_endpoint/group/${groupId}`)).then((items) => (items ?? []).map(fromEndpointWire)),
  /** @returns 新建端点的主键。 */
  createEndpoint: (endpoint: EndpointEntity) =>
    request<number>(admin("ds_endpoint"), { method: "POST", body: toEndpointWire(endpoint) }),
  /** 更新指定端点。 */
  updateEndpoint: (endpoint: EndpointEntity) =>
    request<boolean>(admin(`ds_endpoint/${endpoint.id}`), { method: "PUT", body: toEndpointWire(endpoint) }),
  /** 删除指定端点。 */
  deleteEndpoint: (id: number) =>
    request<boolean>(admin(`ds_endpoint/${id}`), { method: "DELETE" }),
  /** @returns 全部项目配置。 */
  listProjects: () =>
    request<DataServiceProject[]>(admin("common_api/project/list")),

  /** @param project 待创建的项目。@returns 新建项目 ID。 */
  createProject: (project: DataServiceProject) =>
    request<number>(admin("common_api/project"), {
      method: "POST",
      body: project,
    }),

  /** @param project 待更新的项目，必须携带 ID。@returns 更新完成后的空响应。 */
  updateProject: (project: DataServiceProject) =>
    request<void>(admin("common_api/project"), {
      method: "PUT",
      body: project,
    }),
  /** @param id 项目 ID。@returns 删除完成后的空响应。 */
  deleteProject: (id: number) =>
    request<void>(admin(`common_api/project/${id}`), { method: "DELETE" }),
  /** @returns 管理端中的服务配置树根节点。 */
  listServices: () =>
    request<ServiceConfig[]>(admin("common_api/common_api/list")),
  /** @param project 服务所属项目。@param service 待创建服务。@returns 新建服务 ID。 */
  createService: (project: DataServiceProject, service: ServiceConfig) =>
    request<number>(serviceUrl(project, "common_api"), {
      method: "POST",
      body: service,
    }),
  /** @param project 服务所属项目。@param service 待更新服务。@returns 更新完成后的空响应。 */
  updateService: (project: DataServiceProject, service: ServiceConfig) =>
    request<void>(serviceUrl(project, "common_api"), {
      method: "PUT",
      body: service,
    }),
  /** @param project 服务所属项目。@param id 服务 ID。@returns 删除完成后的空响应。 */
  deleteService: (project: DataServiceProject, id: number) =>
    request<void>(serviceUrl(project, `common_api/${id}`), {
      method: "DELETE",
    }),
  /** @param project 要重新加载配置的项目。@returns 后端刷新是否成功。 */
  reloadConfig: (project: DataServiceProject) =>
    request<boolean>(serviceUrl(project, "reload_config")),
};
