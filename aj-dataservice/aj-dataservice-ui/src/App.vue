<template>
  <main class="app-shell">
    <AppHeader :api-root="runtimeConfig.adminApiRoot" />
    <Split v-model="split1" class="workspace-layout">
      <template #left>
        <ProjectTree :key="treeVersion" @groups-loaded="urlGroups = $event" @select-group="selectUrlGroup" />
      </template>
      <template #right>
        <section class="main-workspace">
          <ServiceToolbar :has-active-tab="Boolean(activeTab)" :has-selected-group="Boolean(selectedUrlGroup)" @create="createService"
            @delete="deleteActiveEndpoint" @refresh-tree="treeVersion++" @reload-config="refreshSelectedGroup" @save="saveActiveEndpoints" />
          <WorkspaceTabs :active-key="activeKey" :tabs="tabs" @close="closeTab" @select="activeKey = $event" />
          <div v-if="activeTab" class="editor-host">
            <ServiceEditor :key="activeTab.key" :active-index="activeTab.activeEndpointIndex" :endpoints="activeTab.endpoints" :url-prefix="activeTab.urlPrefix"
              @add-endpoint="addEndpoint(activeTab)" @delete-endpoint="deleteActiveEndpoint" @select-endpoint="activeTab.activeEndpointIndex = $event" />
          </div>
          <section v-else class="welcome">
            <h1>欢迎使用 Data Service</h1>
            <p>请在左侧选择 URL 分组；点击“新建服务”会以该分组的完整路径创建一组 CRUD Endpoint。</p>
            <p class="muted">当前管理端 API：{{ runtimeConfig.adminApiRoot }}</p>
          </section>
        </section>
      </template>
    </Split>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Message, Modal } from "view-ui-plus";
import { dataServiceApi } from "./api/dataservice";
import AppHeader from "./components/AppHeader.vue";
import ProjectTree from "./components/ProjectTree.vue";
import ServiceEditor from "./components/ServiceEditor.vue";
import ServiceToolbar from "./components/ServiceToolbar.vue";
import WorkspaceTabs from "./components/WorkspaceTabs.vue";
import { runtimeConfig } from "./config/runtime";
import type { EndpointEntity, UrlGroup, WorkspaceTab } from "./types/dataservice";

type NoticeType = "success" | "error" | "info" | "warning";
type MessageService = Record<NoticeType, (options: { content: string; duration: number }) => void>;
type ModalService = { confirm: (options: { title: string; content: string; okText: string; cancelText: string; onOk: () => void }) => void };

const message = Message as unknown as MessageService;
const modal = Modal as unknown as ModalService;
const split1 = ref(0.2);
const treeVersion = ref(0);
const urlGroups = ref<UrlGroup[]>([]);
const selectedUrlGroup = ref<UrlGroup>();
const tabs = ref<WorkspaceTab[]>([]);
const activeKey = ref<string>();
const activeTab = computed(() => tabs.value.find((tab) => tab.key === activeKey.value));

function show(type: NoticeType, content: string): void {
  message[type]({ content, duration: type === "error" ? 4 : 2 });
}

function endpoint(groupId: number, method: EndpointEntity["method"], url: string, name: string, actionType: EndpointEntity["actionType"]): EndpointEntity {
  return { groupId, method, url, name, actionType, isAutoSql: true, isAutoIns: actionType === "CREATE", idField: "id", tableName: "" };
}

function crudEndpoints(groupId: number): EndpointEntity[] {
  return [
    endpoint(groupId, "GET", "/{id}", "实体详情", "INFO"),
    endpoint(groupId, "GET", "/list", "实体列表", "LIST"),
    endpoint(groupId, "POST", "/", "新增实体", "CREATE"),
    endpoint(groupId, "PUT", "/", "修改实体", "UPDATE"),
    endpoint(groupId, "DELETE", "/{id}", "删除实体", "DELETE"),
  ];
}

function findGroup(id: number, nodes = urlGroups.value): UrlGroup | undefined {
  for (const group of nodes) {
    if (group.id === id) return group;
    const child = findGroup(id, group.children ?? []);
    if (child) return child;
  }
}

function groupUrlPrefix(group: UrlGroup): string {
  const parts: string[] = [];
  const visited = new Set<number>();
  let current: UrlGroup | undefined = group;

  while (current && current.id !== undefined && !visited.has(current.id)) {
    visited.add(current.id);
    parts.unshift(current.url.replace(/^\/+|\/+$/g, ""));
    current = current.parentId === -1 ? undefined : findGroup(current.parentId);
  }

  return `/${parts.filter(Boolean).join("/")}`;
}

async function selectUrlGroup(group: UrlGroup): Promise<void> {
  selectedUrlGroup.value = group;
  const existing = tabs.value.find((tab) => tab.key === `group:${group.id}`);

  if (existing) {
    activeKey.value = existing.key;
    return;
  }

  try {
    const endpoints = await dataServiceApi.listEndpoints(group.id!);
    const tab: WorkspaceTab = {
      key: `group:${group.id}`,
      label: group.name,
      group,
      urlPrefix: groupUrlPrefix(group),
      endpoints,
      activeEndpointIndex: 0,
      isNew: false,
    };
    tabs.value.push(tab);
    activeKey.value = tab.key;
  } catch (error) {
    show("error", error instanceof Error ? error.message : "加载分组 Endpoint 失败");
  }
}

function createService(): void {
  const group = selectedUrlGroup.value;
  if (!group?.id) {
    show("warning", "请先在左侧选择一个 URL 分组");
    return;
  }

  const tab: WorkspaceTab = {
    key: `new:${crypto.randomUUID()}`,
    label: `新建服务 - ${group.name}`,
    group,
    urlPrefix: groupUrlPrefix(group),
    endpoints: crudEndpoints(group.id),
    activeEndpointIndex: 0,
    isNew: true,
  };
  tabs.value.push(tab);
  activeKey.value = tab.key;
}

function addEndpoint(tab: WorkspaceTab): void {
  tab.endpoints.push(endpoint(tab.group.id!, "GET", "/", "新建 Endpoint", "INFO"));
  tab.activeEndpointIndex = tab.endpoints.length - 1;
}

function closeTab(key: string): void {
  const index = tabs.value.findIndex((tab) => tab.key === key);
  if (index < 0) return;
  tabs.value.splice(index, 1);
  if (activeKey.value === key) activeKey.value = tabs.value[index - 1]?.key ?? tabs.value[index]?.key;
}

function validateEndpoint(item: EndpointEntity): string | undefined {
  if (!item.name.trim()) return "Endpoint 名称不能为空";
  if (!item.url.trim()) return "Endpoint 访问路径不能为空";
  if (item.isAutoSql && !item.tableName?.trim()) return `“${item.name}”使用自动 SQL 时必须填写数据库表名`;
}

async function saveActiveEndpoints(): Promise<void> {
  const tab = activeTab.value;
  if (!tab) return;
  if (tab.endpoints.length === 0) {
    show("warning", "请至少新增一个 Endpoint");
    return;
  }
  const error = tab.endpoints.map(validateEndpoint).find(Boolean);
  if (error) {
    show("error", error);
    return;
  }

  try {
    for (const item of tab.endpoints) {
      item.groupId = tab.group.id!;
      if (item.id)
        await dataServiceApi.updateEndpoint(item);
      else
        item.id = await dataServiceApi.createEndpoint(item);
    }
    tab.isNew = false;
    tab.label = tab.group.name;
    show("success", "Endpoint 已逐条保存");
  } catch (error) {
    show("error", error instanceof Error ? error.message : "保存 Endpoint 失败");
  }
}

function deleteActiveEndpoint(): void {
  const tab = activeTab.value;
  const item = tab?.endpoints[tab.activeEndpointIndex];
  if (!tab || !item) return;
  modal.confirm({
    title: "确认删除",
    content: `确定删除 Endpoint“${escapeHtml(item.name || item.url)}”吗？`,
    okText: "删除",
    cancelText: "取消",
    onOk: () => void removeEndpoint(tab, item),
  });
}

async function removeEndpoint(tab: WorkspaceTab, item: EndpointEntity): Promise<void> {
  try {
    if (item.id) await dataServiceApi.deleteEndpoint(item.id);
    const index = tab.endpoints.indexOf(item);
    if (index >= 0) tab.endpoints.splice(index, 1);
    tab.activeEndpointIndex = Math.min(tab.activeEndpointIndex, tab.endpoints.length - 1);
    show("success", "Endpoint 已删除");
  } catch (error) {
    show("error", error instanceof Error ? error.message : "删除 Endpoint 失败");
  }
}

async function refreshSelectedGroup(): Promise<void> {
  if (selectedUrlGroup.value) await selectUrlGroup(selectedUrlGroup.value);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char] ?? char));
}
</script>

<style scoped lang="less">
.app-shell { display: flex; height: 100%; flex-direction: column; background: white; }
.workspace-layout { min-height: 0; flex: 1; border-top: 1px solid lightgray; }
.main-workspace { display: flex; height: 100%; min-width: 0; flex-direction: column; padding-left: 5px; }
.editor-host { min-height: 0; flex: 1; }.welcome { padding: 15px 10px; }.welcome h1 { margin: 0; color: #555; font-size: 22px; font-weight: 400; }.muted { color: #999; }
</style>
