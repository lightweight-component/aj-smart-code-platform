<template>
  <main class="app-shell">
    <AppHeader :api-root="runtimeConfig.adminApiRoot" />
    <Split v-model="split1" class="workspace-layout">
      <template #left>
        <ProjectTree :loading="loading" :projects="tree" :selected-project-key="selectedProjectKey"
          @create-project="openCreateProject" @delete-project="deleteProject" @edit-project="openEditProject"
          @open-service="openService" @select-project="selectProject" />
      </template>
      <template #right>
        <section class="main-workspace">
          <ServiceToolbar :has-active-tab="Boolean(activeTab)" :selected-project="Boolean(selectedProject)"
            @create-crud="createService('CRUD')" @create-single="createService('SINGLE')" @delete="deleteActiveService"
            @refresh-tree="loadWorkspace" @reload-config="reloadConfig" @save="saveActiveService" />
          <WorkspaceTabs :active-key="activeKey" :tabs="tabs" @close="closeTab" @select="activeKey = $event" />
          <div v-if="activeTab" class="editor-host">
            <ServiceEditor :key="activeTab.key" :project="activeTab.project" :service="activeTab.draft" />
          </div>
          <section v-else class="welcome">
            <h1>欢迎使用 Data Service</h1>
            <p>在左侧选择项目和服务，或先新建一个 CRUD / 自定义 SQL 服务。</p>
            <p class="muted">当前管理端 API：{{ runtimeConfig.adminApiRoot }}</p>
          </section>
        </section>
      </template>
    </Split>
    <ProjectDialog :model="projectDraft" :open="projectDialogOpen" @close="projectDialogOpen = false"
      @save="saveProject" />
  </main>
</template>

<script setup lang="ts">
import { Message } from "view-ui-plus";
import { computed, onMounted, ref } from "vue";
import { dataServiceApi } from "./api/dataservice";
import AppHeader from "./components/AppHeader.vue";
import ProjectDialog from "./components/ProjectDialog.vue";
import ProjectTree from "./components/ProjectTree.vue";
import ServiceEditor from "./components/ServiceEditor.vue";
import ServiceToolbar from "./components/ServiceToolbar.vue";
import WorkspaceTabs from "./components/WorkspaceTabs.vue";
import { runtimeConfig } from "./config/runtime";
import type {
  DataServiceProject,
  ProjectTreeNode,
  ServiceConfig,
  ServiceTreeNode,
  WorkspaceTab,
} from "./types/dataservice";
import {
  buildProjectTree,
  cleanServiceForSave,
  createDraft,
  serviceLabel,
} from "./utils/service";

/** iView 吐司支持的反馈级别。 */
type NoticeType = "success" | "error" | "info";
/** iView Message 的运行时服务接口。 */
type MessageService = Record<
  NoticeType,
  (options: { content: string; duration: number }) => void
>;

/** 页面内统一使用的 iView 吐司服务。 */
const message = Message as unknown as MessageService;
/** 首次加载项目与服务树时的忙碌状态。 */
const loading = ref(false);
/** 左右工作区分栏比例，与旧版 iView Split 的默认值保持一致。 */
const split1 = ref(0.2);
/** 从管理端加载的全部项目。 */
const projects = ref<DataServiceProject[]>([]);
/** 从管理端加载的服务配置树根节点。 */
const services = ref<ServiceConfig[]>([]);
/** 当前在左侧树中选定、用于新建服务和刷新配置的项目。 */
const selectedProject = ref<DataServiceProject>();
/** 已在工作区打开的服务编辑标签。 */
const tabs = ref<WorkspaceTab[]>([]);
/** 当前激活的工作区标签键；未设置时显示首页。 */
const activeKey = ref<string>();
/** 项目新建/编辑弹窗的显示状态。 */
const projectDialogOpen = ref(false);
/** 传递给项目弹窗的编辑副本，避免直接修改树中的项目对象。 */
const projectDraft = ref<DataServiceProject>(emptyProject());
/** 由项目和服务配置实时组合出的左侧导航树。 */
const tree = computed<ProjectTreeNode[]>(() =>
  buildProjectTree(projects.value, services.value),
);
/** 当前项目在 iView Tree 中使用的稳定节点键。 */
const selectedProjectKey = computed(() =>
  selectedProject.value
    ? `project:${selectedProject.value.id ?? selectedProject.value.name}`
    : undefined,
);

/** 当前激活的服务编辑标签；首页激活时为空。 */
const activeTab = computed(() =>
  tabs.value.find((tab) => tab.key === activeKey.value),
);

onMounted(loadWorkspace);

/**
 * 创建用于新建项目的空表单模型。
 *
 * @returns 包含必填字段默认值的项目配置。
 */
function emptyProject(): DataServiceProject {
  return { name: "", content: "", apiPrefixDev: "", apiPrefixProd: "" };
}

/**
 * 展示 iView 吐司反馈。
 *
 * @param type 消息级别。
 * @param text 用户可见的反馈文案。
 * @returns 无返回值。
 */
function show(type: NoticeType, text: string): void {
  message[type]({ content: text, duration: type === "error" ? 4 : 2 });
}

/**
 * 执行业务异步操作，并将异常转换为统一错误吐司。
 *
 * @param action 待执行的异步业务动作。
 * @returns 操作完成后返回的 Promise；错误已在此处处理。
 */
async function safely(action: () => Promise<void>): Promise<void> {
  try {
    await action();
  } catch (error) {
    show("error", error instanceof Error ? error.message : "发生未知错误");
  }
}

/**
 * 并行加载项目列表和服务配置，并保持当前项目选择尽可能不变。
 *
 * @returns 加载结束后返回的 Promise。
 */
async function loadWorkspace(): Promise<void> {
  await safely(async () => {
    loading.value = true;
    const [projectList, serviceList] = await Promise.all([
      dataServiceApi.listProjects(),
      dataServiceApi.listServices(),
    ]);
    projects.value = projectList;
    services.value = serviceList;
    if (selectedProject.value)
      selectedProject.value =
        projectList.find(
          (project) => project.id === selectedProject.value?.id,
        ) ?? undefined;
  });
  loading.value = false;
}

/**
 * 将左侧树中选中的项目设为当前上下文。
 *
 * @param project 用户选中的项目。
 * @returns 无返回值。
 */
function selectProject(project: DataServiceProject): void {
  selectedProject.value = project;
}

/**
 * 打开已存在的服务编辑标签，若已打开则只切换到该标签。
 *
 * @param project 服务所属项目。
 * @param node 左侧树中被点击的服务节点。
 * @returns 无返回值。
 */
function openService(project: DataServiceProject, node: ServiceTreeNode): void {
  selectedProject.value = project;
  const key = `service:${project.id ?? project.name}:${node.service.id ?? node.service.namespace}`;
  let tab = tabs.value.find((item) => item.key === key);

  if (!tab) {
    tab = {
      key,
      label: serviceLabel(node.service),
      project,
      draft: structuredClone(node.service),
      isNew: false,
    };
    tabs.value.push(tab);
  }

  activeKey.value = tab.key;
}
/**
 * 在当前项目下打开一个新的、尚未保存的服务草稿标签。
 *
 * @param kind 要创建的服务类型。
 * @returns 无返回值；未选项目时显示提示。
 */
function createService(kind: ServiceConfig["type"]): void {
  const project = selectedProject.value;

  if (!project) {
    show("info", "请先在左侧选择一个项目");
    return;
  }

  const key = `new:${crypto.randomUUID()}`;
  tabs.value.push({
    key,
    label: kind === "CRUD" ? "新建 CRUD 服务" : "新建 SQL 服务",
    project,
    draft: createDraft(kind),
    isNew: true,
  });

  activeKey.value = key;
}

/**
 * 关闭服务标签，并在关闭当前标签时选择相邻标签或首页。
 *
 * @param key 待关闭的工作区标签键。
 * @returns 无返回值。
 */
function closeTab(key: string): void {
  const index = tabs.value.findIndex((tab) => tab.key === key);
  if (index < 0) return;
  tabs.value.splice(index, 1);

  if (activeKey.value === key)
    activeKey.value = tabs.value[index - 1]?.key ?? tabs.value[index]?.key;
}

/**
 * 校验并保存当前服务草稿；新草稿创建后会写回服务 ID。
 *
 * @returns 保存与树刷新完成后返回的 Promise。
 */
async function saveActiveService(): Promise<void> {
  const tab = activeTab.value;
  if (!tab) return;
  if (!tab.draft.namespace.trim()) {
    show("error", "命名空间不能为空");
    return;
  }

  await safely(async () => {
    const payload = cleanServiceForSave(tab.draft);

    if (tab.isNew) {
      tab.draft.id = await dataServiceApi.createService(tab.project, payload);
      tab.isNew = false;
      tab.label = serviceLabel(tab.draft);
    } else await dataServiceApi.updateService(tab.project, payload);

    await loadWorkspace();
    show("success", "服务已保存");
  });
}

/**
 * 删除当前已保存的服务，或直接关闭尚未保存的草稿标签。
 *
 * @returns 删除、关闭及树刷新完成后返回的 Promise。
 */
async function deleteActiveService(): Promise<void> {
  const tab = activeTab.value;
  if (!tab) return;
  if (tab.isNew) {
    closeTab(tab.key);
    return;
  }

  if (
    !tab.draft.id ||
    !window.confirm(`确定删除服务“${serviceLabel(tab.draft)}”吗？`)
  )
    return;

  const serviceId = tab.draft.id;
  await safely(async () => {
    await dataServiceApi.deleteService(tab.project, serviceId);
    closeTab(tab.key);
    await loadWorkspace();
    show("success", "服务已删除");
  });
}
/**
 * 请求当前项目运行端重新加载数据库中的服务配置。
 *
 * @returns 刷新请求结束后返回的 Promise。
 */
async function reloadConfig(): Promise<void> {
  const project = selectedProject.value ?? activeTab.value?.project;

  if (!project) {
    show("info", "请先选择一个项目");
    return;
  }

  await safely(async () => {
    await dataServiceApi.reloadConfig(project);
    show("success", "服务配置已刷新");
  });
}

/**
 * 初始化空项目草稿并打开新建项目弹窗。
 *
 * @returns 无返回值。
 */
function openCreateProject(): void {
  projectDraft.value = emptyProject();
  projectDialogOpen.value = true;
}

/**
 * 复制指定项目并打开编辑弹窗，避免取消时污染树状态。
 *
 * @param project 待编辑项目。
 * @returns 无返回值。
 */
function openEditProject(project: DataServiceProject): void {
  projectDraft.value = structuredClone(project);
  projectDialogOpen.value = true;
}

/**
 * 根据项目 ID 创建或更新项目，并在成功后刷新工作区。
 *
 * @param project 来自项目弹窗的表单数据。
 * @returns 保存与树刷新完成后返回的 Promise。
 */
async function saveProject(project: DataServiceProject): Promise<void> {
  await safely(async () => {
    if (project.id) await dataServiceApi.updateProject(project);
    else project.id = await dataServiceApi.createProject(project);
    projectDialogOpen.value = false;
    await loadWorkspace();
    selectedProject.value =
      projects.value.find((item) => item.id === project.id) ?? project;
    show("success", "项目已保存");
  });
}

/**
 * 经用户确认后删除项目，并清理该项目的当前选择。
 *
 * @param project 待删除项目。
 * @returns 删除与树刷新完成后返回的 Promise。
 */
async function deleteProject(project: DataServiceProject): Promise<void> {
  if (
    !project.id ||
    !window.confirm(`确定删除项目“${project.name}”及其服务吗？`)
  )
    return;

  const projectId = project.id;

  await safely(async () => {
    await dataServiceApi.deleteProject(projectId);

    if (selectedProject.value?.id === project.id)
      selectedProject.value = undefined;

    await loadWorkspace();
    show("success", "项目已删除");
  });
}
</script>

<style scoped lang="less">
.app-shell {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

.workspace-layout {
  min-height: 0;
  flex: 1;
  border-top: 1px solid lightgray;
}

.main-workspace {
  height: 100%;
  min-width: 0;
  padding-left: 5px;
  display: flex;
  flex-direction: column;
}

.editor-host {
  min-height: 0;
  flex: 1;
}

.welcome {
  padding: 15px 10px;
}

.welcome h1 {
  margin: 0;
  color: #555;
  font-size: 22px;
  font-weight: 400;
}
</style>
