<template>
  <div>
    <Input v-model="value" :placeholder="placeholder" @on-change="emit('onChange', value)">
    <template #prepend>
      <button class="icon-trigger" type="button" aria-label="选择图标" @click="openPicker">
        <Icon :type="value || 'ios-apps'" />
      </button>
    </template>
    </Input>

    <Modal v-model="modal" title="选择图标" :width="800">
      <Input v-model="iconName" suffix="ios-search" placeholder="请输入图标名称" />
      <ul v-if="filteredIcons.length" class="icon-list">
        <li v-for="icon in filteredIcons" :key="icon">
          <button class="icon-option" type="button" @click="selectedIcon(icon)">
            <Icon :type="icon" :size="18" />
            <span>{{ icon }}</span>
          </button>
        </li>
      </ul>
      <p v-else class="empty-icons">没有找到匹配的图标</p>
      <template #footer>
        <Button @click="modal = false">取消</Button>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
import iconStyles from "view-ui-plus/src/styles/common/iconfont/_ionicons-icons.less?raw";

const iconNames = [...new Set(
  Array.from(iconStyles.matchAll(/\.ivu-icon-([a-z0-9-]+)::?before\s*\{\s*content:/g), ([, name]) => name),
)];
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

defineOptions({ name: "compIcons" });

const props = withDefaults(defineProps<{ data?: string; placeholder?: string }>(), {
  data: "",
  placeholder: "",
});
const emit = defineEmits<{ onChange: [name: string] }>();
const value = ref(props.data);
const modal = ref(false);
const iconName = ref("");

watch(() => props.data, (name) => value.value = name);

const filteredIcons = computed(() => {
  const query: string = iconName.value.trim().toLowerCase();
  
  return query ? iconNames.filter((name) => name.includes(query)) : iconNames;
});

function openPicker(): void {
  iconName.value = "";
  modal.value = true;
}

function selectedIcon(name: string): void {
  value.value = name;
  modal.value = false;
  emit("onChange", name);
}
</script>

<style scoped>
.icon-trigger,
.icon-option {
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.icon-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  max-height: 450px;
  margin-top: 16px;
  overflow-y: auto;
  list-style: none;
}

.icon-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 8px;
  text-align: left;
}

.icon-option:hover,
.icon-option:focus-visible {
  background: #f0f5ff;
}

.empty-icons {
  margin-top: 16px;
}
</style>
