<template>
  <aside class="tree-panel">
    <div class="tree-actions">
      <Input v-model="keyword" aria-label="搜索数据服务" placeholder="搜索数据服务……" suffix="ios-search" />
      <Button icon="md-add" shape="circle" title="新建项目" type="default" @click="$emit('create-project')" />
    </div>
    <div v-if="loading" class="tree-state">正在加载…</div>
    <div v-else-if="visibleProjects.length === 0" class="tree-state">暂无项目或服务</div>
    <Tree v-else :data="treeData" class="service-tree" @on-contextmenu="onContextMenu"
      @on-select-change="onSelectChange">
      <template #contextMenu>
        <DropdownItem v-if="contextProject" style="color:green" @click="$emit('create-project')">
          <Icon type="ios-add" /> 新建项目
        </DropdownItem>
        <DropdownItem v-if="contextProject" @click="$emit('edit-project', contextProject)">
          <Icon type="ios-create" /> 编辑项目
        </DropdownItem>
        <DropdownItem v-if="contextProject" style="color:#ed4014" @click="$emit('delete-project', contextProject)">
          <Icon type="ios-trash" /> 删除项目
        </DropdownItem>
      </template>
    </Tree>
  </aside>
</template>

<script setup lang="ts">
import { computed, type h, ref } from "vue";
import type {
  DataServiceProject,
  ProjectTreeNode,
  ServiceTreeNode,
} from "../types/dataservice";

const props = defineProps<{
  projects: ProjectTreeNode[];
  loading: boolean;
  selectedProjectKey?: string;
}>();

const emit = defineEmits<{
  "select-project": [project: DataServiceProject];
  "open-service": [project: DataServiceProject, node: ServiceTreeNode];
  "create-project": [];
  "edit-project": [project: DataServiceProject];
  "delete-project": [project: DataServiceProject];
}>();

/** 
 * 用户输入的项目/服务搜索关键字。 
 */
const keyword = ref("");

/** 
 * 右键菜单当前关联的项目；服务节点不显示项目操作菜单。
 */
const contextProject = ref<DataServiceProject>();

/** 
 * 规范化后的搜索文本，供过滤逻辑复用。 
 */
const normalizedKeyword = computed(() => keyword.value.trim().toLowerCase());

/** 
 * 仅保留名称或子服务命中搜索关键字的项目。 
 */
const visibleProjects = computed(() => {
  if (!normalizedKeyword.value) return props.projects;

  return props.projects.filter(
    (project) =>
      project.project.name.toLowerCase().includes(normalizedKeyword.value) ||
      project.services.some((service) =>
        contains(service, normalizedKeyword.value),
      ),
  );
});

/** iView Tree 节点中保存的领域对象，用于选择和右键事件回调。 */
type TreePayload =
  | { kind: "project"; project: DataServiceProject }
  | { kind: "service"; project: DataServiceProject; node: ServiceTreeNode };

/** 供 iView Tree 渲染的视图节点结构。 */
type ViewTreeNode = {
  title: string;
  expand: boolean;
  selected?: boolean;
  contextmenu: boolean;
  payload: TreePayload;
  children?: ViewTreeNode[];
  render: (render: typeof h, context: { data: ViewTreeNode }) => unknown;
};

/** 
 * 将领域树转换为 iView Tree 所需的节点格式。
 */
const treeData = computed<ViewTreeNode[]>(() =>
  visibleProjects.value.map((project) => ({
    title: project.project.name,
    expand: true,
    selected: props.selectedProjectKey === project.key,
    contextmenu: true,
    payload: { kind: "project", project: project.project },
    render: renderProject,
    children: project.services.map((service) => toTreeNode(project.project, service)),
  })),
);

/**
 * 递归转换服务树节点。
 *
 * @param project 当前服务所属项目。
 * @param node 原始服务树节点。
 * @returns 可供 iView Tree 渲染的节点。
 */
function toTreeNode(
  project: DataServiceProject,
  node: ServiceTreeNode,
): ViewTreeNode {
  return {
    title: node.service.name || node.service.namespace,
    expand: true,
    contextmenu: true,
    payload: { kind: "service", project, node },
    render: renderService,
    children: node.children.map((child) => toTreeNode(project, child)),
  };
}

/**
 * 渲染项目节点前的 P 标识，保持旧版 iView Tree 的视觉语义。
 *
 * @param render Vue 渲染函数。
 * @param context iView Tree 提供的当前节点上下文。
 * @returns 项目节点的 VNode 列表。
 */
function renderProject(render: typeof h, { data }: { data: ViewTreeNode }) {
  return [
    render("span", { class: "http-method project" }, "P"),
    render("span", { style: "font-weight:bold" }, data.title),
  ];
}

/**
 * 根据服务类型渲染 CRUD 或 Single SQL 的节点标识。
 *
 * @param render Vue 渲染函数。
 * @param context iView Tree 提供的当前节点上下文。
 * @returns 服务节点的 VNode 列表。
 */
function renderService(render: typeof h, { data }: { data: ViewTreeNode }) {
  const service =
    data.payload.kind === "service" ? data.payload.node.service : undefined;
  return [
    render(
      "span",
      {
        class: ["http-method", service?.type === "SINGLE" ? "single" : "crud"],
      },
      service?.type === "SINGLE" ? "S" : "C",
    ),
    render("span", data.title),
  ];
}

/**
 * 将 iView Tree 的选择结果转换为项目选择或服务打开事件。
 *
 * @param nodes 当前选中的树节点数组。
 * @returns 无返回值。
 */
function onSelectChange(nodes: ViewTreeNode[]): void {
  const selected = nodes[0]?.payload;

  if (!selected) return;

  if (selected.kind === "project") emit("select-project", selected.project);
  else emit("open-service", selected.project, selected.node);
}

/**
 * 记录右键节点对应项目，以驱动 Tree 的上下文菜单。
 *
 * @param data 被右键点击的 iView Tree 节点。
 * @returns 无返回值。
 */
function onContextMenu(data: ViewTreeNode): void {
  contextProject.value =
    data.payload.kind === "project" ? data.payload.project : undefined;
}

/**
 * 判断服务节点或其任意子节点是否匹配搜索关键字。
 *
 * @param node 待检查的服务树节点。
 * @param value 已标准化的小写搜索词。
 * @returns 命中时返回 `true`。
 */
function contains(node: ServiceTreeNode, value: string): boolean {
  return (
    `${node.service.name ?? ""} ${node.service.namespace}`
      .toLowerCase()
      .includes(value) || node.children.some((child) => contains(child, value))
  );
}
</script>

<style scoped lang="less">
.tree-panel {
  height: 100%;
  overflow: auto;
  border-right: 1px solid lightgray;
  background: #fff;
}

.tree-actions {
  display: flex;
  gap: 6px;
  height: 69px;
  align-items: start;
  padding: 14px 10px 0 15px;
  border-bottom: 1px solid lightgray;
  background-image: linear-gradient(#fefefe, #e6e6e6);
}

:deep(.ivu-input-wrapper) {
  flex: 1;
}

:deep(.ivu-btn-circle) {
  width: 29px;
  height: 29px;
  padding: 0;
  color: green;
  font-size: 18px;
}

.tree-state {
  padding: 24px 12px;
  color: gray;
  text-align: center;
}

.service-tree {
  height: calc(100% - 69px);
  overflow-y: auto;
  margin-left: 10px;
}

:deep(.ivu-tree-title) {
  color: #555;
}

:deep(.ivu-tree-title-selected),
:deep(.ivu-tree-title:hover) {
  background: #e5f1f7;
}

:deep(.http-method) {
  margin-right: 5px;
  border: 1px solid;
  border-radius: 3px;
  padding: 0 2px;
  font-size: 8px;
  vertical-align: middle;
}

.project {
  color: #3175fe;
  border-color: #3175fe;
}

.crud {
  color: green;
  border-color: green;
}

.single {
  color: #b12fbc;
  border-color: #b12fbc;
}
</style>
