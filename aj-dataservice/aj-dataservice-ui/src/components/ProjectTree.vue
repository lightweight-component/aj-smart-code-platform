<template>
  <aside class="tree-panel">
    <div class="tree-actions">
      <Input v-model="keyword" aria-label="搜索 URL 分组" placeholder="搜索 URL 分组……" suffix="ios-search" />
      <Button icon="md-add" shape="circle" title="新建根分组" type="default" @click="openCreate(ROOT_PARENT_ID)" />
    </div>
    <div v-if="loading" class="tree-state">正在加载…</div>
    <div v-else-if="loadError" class="tree-state error">{{ loadError }}</div>
    <div v-else-if="visibleGroups.length === 0" class="tree-state">暂无 URL 分组</div>
    <Tree v-else :data="visibleGroups" class="group-tree" @on-contextmenu="onContextMenu" @on-select-change="onSelectChange">
      <template #contextMenu>
        <DropdownItem v-if="contextGroup" style="color:green" @click="openCreate(contextGroup.id)">
          <Icon type="ios-add" /> 新建子分组
        </DropdownItem>
        <DropdownItem v-if="contextGroup" @click="openEdit(contextGroup)">
          <Icon type="ios-create" /> 编辑 / 移动
        </DropdownItem>
        <DropdownItem v-if="contextGroup" style="color:#ed4014" @click="removeGroup(false)">
          <Icon type="ios-trash" /> 删除叶子节点
        </DropdownItem>
        <DropdownItem v-if="contextGroup" style="color:#ed4014" @click="removeGroup(true)">
          <Icon type="ios-trash" /> 删除节点及子节点
        </DropdownItem>
      </template>
    </Tree>

    <Modal :model-value="dialogOpen" :title="editingId ? '编辑 URL 分组' : '新建 URL 分组'" :mask-closable="false" ok-text="保存" @on-cancel="dialogOpen = false"
      @on-ok="save" @update:model-value="visibleChanged">
      <Form :model="draft" :label-width="90">
        <FormItem label="分组名称" prop="name" required>
          <Input v-model.trim="draft.name" autofocus maxlength="50" placeholder="请输入分组名称" />
        </FormItem>
        <FormItem label="URL 路径" prop="url" required>
          <Input v-model.trim="draft.url" maxlength="100" placeholder="例如 users，不含首尾斜杠" />
        </FormItem>
        <FormItem label="上级分组" prop="parentId" required>
          <Select v-model="draft.parentId">
            <Option :value="ROOT_PARENT_ID">根分组</Option>
            <Option v-for="item in parentOptions" :key="item.id" :value="item.id">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </aside>
</template>

<script setup lang="ts">
import { Message, Modal } from "view-ui-plus";
import { computed, onMounted, reactive, ref } from "vue";
import { dataServiceApi } from "../api/dataservice";
import type { UrlGroup } from "../types/dataservice";

const ROOT_PARENT_ID: number = -1;

const emit = defineEmits<{
  "select-group": [group: UrlGroup];
  "groups-loaded": [groups: UrlGroup[]];
}>();

type GroupTreeNode = UrlGroup & {
  id: number;
  title?: string;
  expand?: boolean;
  contextmenu?: boolean;
  children?: GroupTreeNode[];
};

type MessageService = Record<"success" | "error" | "warning", (options: { content: string; duration: number }) => void>;
type ModalService = {
  confirm: (options: { title: string; content: string; okText: string; cancelText: string; onOk: () => void }) => void;
};

const message = Message as unknown as MessageService;
const modal = Modal as unknown as ModalService;
const loading = ref<boolean>(false);
const loadError = ref<string>("");
const keyword = ref<string>("");
const groups = ref<GroupTreeNode[]>([]);
const contextGroup = ref<GroupTreeNode>();
const dialogOpen = ref<boolean>(false);
const editingId = ref<number>();
const draft = reactive<UrlGroup>(emptyGroup());

const normalizedKeyword = computed(() => keyword.value.trim().toLowerCase());
const visibleGroups = computed(() => filterGroups(groups.value, normalizedKeyword.value));
const parentOptions = computed(() => flattenGroups(groups.value, editingId.value));

onMounted(loadGroups);

function emptyGroup(parentId = ROOT_PARENT_ID): UrlGroup {
  return { name: "", url: "", parentId };
}

async function loadGroups(): Promise<void> {
  loading.value = true;
  loadError.value = "";

  try {
    groups.value = ((await dataServiceApi.listUrlGroups()) ?? []) as GroupTreeNode[];
    emit("groups-loaded", groups.value);
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : "加载 URL 分组失败";
  } finally {
    loading.value = false;
  }
}

function openCreate(parentId: number): void {
  editingId.value = undefined;
  Object.assign(draft, emptyGroup(parentId));
  dialogOpen.value = true;
}

function openEdit(group: GroupTreeNode): void {
  editingId.value = group.id;
  Object.assign(draft, { name: group.name, url: group.url, parentId: group.parentId, sortNo: group.sortNo });
  dialogOpen.value = true;
}

async function save(): Promise<void> {
  if (!draft.name || !draft.url) {
    message.warning({ content: "请输入分组名称和 URL 路径", duration: 2 });
    return;
  }

  const url = draft.url.replace(/^\/+|\/+$/g, "");

  if (!url) {
    message.warning({ content: "URL 路径不能只包含斜杠", duration: 2 });
    return;
  }

  try {
    const payload: UrlGroup = { name: draft.name, url, parentId: draft.parentId };
    const done = editingId.value
      ? await dataServiceApi.updateUrlGroup(editingId.value, payload)
      : await dataServiceApi.createUrlGroup(payload);

    if (!done)
      throw new Error("保存 URL 分组失败");

    dialogOpen.value = false;
    await loadGroups();
    message.success({ content: "URL 分组已保存", duration: 2 });
  } catch (error) {
    message.error({ content: error instanceof Error ? error.message : "保存 URL 分组失败", duration: 4 });
  }
}

function removeGroup(includeChildren: boolean): void {
  const group = contextGroup.value;
  if (!group)
    return;

  const scope = includeChildren ? "及其全部子分组" : "";
  modal.confirm({
    title: "确认删除",
    content: `确定删除 URL 分组“${escapeHtml(group.name)}”${scope}吗？`,
    okText: "删除",
    cancelText: "取消",
    onOk: () => void deleteGroup(group, includeChildren),
  });
}

async function deleteGroup(group: GroupTreeNode, includeChildren: boolean): Promise<void> {
  try {
    const done = await dataServiceApi.deleteUrlGroup(group.id, includeChildren);

    if (!done && !includeChildren)
      throw new Error("该分组包含子分组，请选择“删除节点及子节点”");

    if (!done)
      throw new Error("删除 URL 分组失败");

    contextGroup.value = undefined;
    await loadGroups();
    message.success({ content: "URL 分组已删除", duration: 2 });
  } catch (error) {
    message.error({ content: error instanceof Error ? error.message : "删除 URL 分组失败", duration: 4 });
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char] ?? char));
}

function onContextMenu(group: GroupTreeNode): void {
  contextGroup.value = group;
}

function onSelectChange(nodes: GroupTreeNode[]): void {
  const group: GroupTreeNode = nodes[0];

  if (group)
    emit("select-group", group);
}

function visibleName(group: UrlGroup): string {
  return group.title ?? group.name;
}

function filterGroups(nodes: GroupTreeNode[], value: string): GroupTreeNode[] {
  return nodes.flatMap((node) => {
    const children = filterGroups(node.children ?? [], value);

    if (value && !visibleName(node).toLowerCase().includes(value) && children.length === 0)
      return [];

    return [{ ...node, title: visibleName(node), expand: true, contextmenu: true, children }];
  });
}

function flattenGroups(nodes: GroupTreeNode[], excludedId?: number, depth = 0): Array<{ id: number; label: string }> {
  return nodes.flatMap((node) => {
    if (node.id === excludedId)
      return [];

    const current = { id: node.id, label: `${"　".repeat(depth)}${visibleName(node)}` };
    return [current, ...flattenGroups(node.children ?? [], excludedId, depth + 1)];
  });
}

function visibleChanged(visible: boolean): void {
  if (!visible)
    dialogOpen.value = false;
}
</script>

<style scoped lang="less">
.tree-panel {
  height: 100%;
  overflow: auto;
  background: #fff;
}

.tree-actions {
  display: flex;
  gap: 6px;
  height: 69px;
  align-items: start;
  padding: 14px 10px 0 15px;
  border-bottom: 1px solid white;
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
  border-top: 1px solid #dcdcdc;
}

.tree-state.error {
  color: #ed4014;
}

.group-tree {
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
</style>
