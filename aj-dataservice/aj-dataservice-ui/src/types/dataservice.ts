/** 服务配置支持的两种编辑模式。 */
export type ServiceKind = "CRUD" | "SINGLE";

/** 与后端 `HttpMethod` 枚举保持一致的 HTTP 请求方法。 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS" | "PATCH" | "TRACE" | "CONNECT";
export type ActionType = "VALUE" | "INFO" | "LIST" | "PAGE_LIST" | "CREATE" | "UPDATE" | "DELETE";

/** `ds_endpoint` 表及后端 `EndpointEntity` 对应的前端模型。 */
export interface EndpointEntity {
  id?: number;
  groupId: number;
  method: HttpMethod;
  url: string;
  sql?: string;
  name: string;
  content?: string;
  actionType: ActionType;
  isAutoSql: boolean;
  tableName?: string;
  isAutoIns: boolean;
  idField?: string;
  stat?: number;
  creator?: string;
  creatorId?: number;
  createDate?: string;
  updater?: string;
  updaterId?: number;
  updateDate?: string;
}

/** 后端通用响应信封。 */
export interface ApiResponse<T> {
  /** 业务操作是否成功。 */
  status: boolean;
  /** 业务失败时供用户展示的错误消息。 */
  message?: string;
  /** 成功响应中的实际业务数据。 */
  data: T;
  /** 可选的业务错误码。 */
  code?: number;
}

/** URL 分组树节点；根节点的 {@link parentId} 固定为 -1。 */
export interface UrlGroup {
  /** 分组主键；新建时为空。 */
  id?: number;
  /** 分组名称。 */
  name: string;
  /** 当前分组在最终端点 URL 中使用的路径片段，不包含首尾斜杠。 */
  url: string;
  /** 父分组主键，根节点为 -1。 */
  parentId: number;
  /** 可选排序号。 */
  sortNo?: number;
  /** 后端为 iView Tree 补充的展示标题。 */
  title?: string;
  /** 子分组。 */
  children?: UrlGroup[];
}

/**
 * 旧服务编辑器使用的运行端上下文。
 *
 * @deprecated 左侧树的选择状态请使用 {@link UrlGroup}；该类型仅用于未迁移的服务编辑器。
 */
export interface DataServiceProject {
  id?: number;
  name: string;
  content?: string;
  apiPrefixDev: string;
  apiPrefixProd: string;
  defaultConfig?: unknown;
}

/** 数据库中 `common_api` 服务配置对应的前端模型。 */
export interface ServiceConfig {
  /** 服务主键；新建服务为空。 */
  id?: number;
  /** 父服务 ID，根服务通常为 -1。 */
  pid?: number;
  /** 用于树和标签页展示的说明名称。 */
  name?: string;
  /** 服务 URL 命名空间。 */
  namespace: string;
  /** 服务端点允许的 HTTP 请求方法。 */
  method?: HttpMethod;
  /** 服务编辑模式。 */
  type: ServiceKind;
  /** CRUD 服务对应的数据库表。 */
  tableName?: string;
  /** 服务详细说明。 */
  content?: string;
  /** 可选的 Java Bean 全限定类名。 */
  clzName?: string;
  /** 主键字段名称。 */
  idField?: string;
  /** 创建日期字段名称。 */
  createDate?: string;
  /** 修改日期字段名称。 */
  updateDate?: string;
  /** 创建人字段名称。 */
  createUser?: string;
  /** 修改人字段名称。 */
  updateUser?: string;
  /** 新建记录的主键生成策略。 */
  idType?: number;
  /** 是否逻辑删除；后端可能返回布尔值或 0/1。 */
  hasIsDeleted?: boolean | number;
  /** 逻辑删除标记字段名称。 */
  delField?: string;
  /** 是否启用；后端可能返回布尔值或 0/1。 */
  enable?: boolean | number;
  /** Single SQL 服务的完整 SQL。 */
  sql?: string;
  /** CRUD 详情操作的自定义 SQL。 */
  infoSql?: string;
  /** CRUD 列表操作的自定义 SQL。 */
  listSql?: string;
  /** CRUD 创建操作的自定义 SQL。 */
  createSql?: string;
  /** CRUD 更新操作的自定义 SQL。 */
  updateSql?: string;
  /** CRUD 删除操作的自定义 SQL。 */
  deleteSql?: string;
  /** 子服务配置。 */
  children?: ServiceConfig[];
}

/** 前端服务导航树节点。 */
export interface ServiceTreeNode {
  /** 用于渲染和 Tab 去重的稳定键。 */
  key: string;
  /** 节点对应的服务配置。 */
  service: ServiceConfig;
  /** 已转换的子服务节点。 */
  children: ServiceTreeNode[];
}

/** 前端项目导航树根节点。 */
export interface ProjectTreeNode {
  /** 用于 Tree 选择状态的稳定键。 */
  key: string;
  /** 节点对应的项目配置。 */
  project: DataServiceProject;
  /** 项目下的服务树根节点。 */
  services: ServiceTreeNode[];
}

/** 工作区中一个已打开服务编辑器的状态。 */
export interface WorkspaceTab {
  /** 工作区标签稳定键。 */
  key: string;
  /** 标签页显示名称。 */
  label: string;
  /** 当前端点所属的 URL 分组。 */
  group: UrlGroup;
  /** 分组树拼接得到的完整 URL 前缀。 */
  urlPrefix: string;
  /** 当前工作区内维护的端点列表。 */
  endpoints: EndpointEntity[];
  /** 当前在端点列表中选中的端点下标。 */
  activeEndpointIndex: number;
  /** 是否是尚未提交到后端的新服务批次。 */
  isNew: boolean;
}
