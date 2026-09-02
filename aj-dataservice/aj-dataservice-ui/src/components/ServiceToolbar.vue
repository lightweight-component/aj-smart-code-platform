<template>
  <section class="toolbar">
    <Button class="tool" type="text" @click="$emit('create-crud')"><span class="tool-icon new">
        <Icon type="md-add" />
      </span><span>新建服务</span></Button>
    <Button class="tool" type="text" @click="$emit('create-single')"><span class="tool-icon sql">S</span><span>新建
        SQL</span></Button>
    <Button :disabled="!hasActiveTab" class="tool" type="text" @click="$emit('delete')"><span class="tool-icon delete">
        <Icon type="md-close" />
      </span><span>删除</span></Button>
    <Button :disabled="!hasActiveTab" class="tool" type="text" @click="$emit('save')"><span class="tool-icon save">
        <Icon type="ios-create" />
      </span><span>保存</span></Button>
    <Button class="tool" type="text" @click="$emit('refresh-tree')"><span class="tool-icon refresh">
        <Icon type="md-refresh" />
      </span><span>重新加载</span></Button>
    <span class="toolbar-spacer" />
    <Button :disabled="!selectedProject" class="tool" type="text" @click="$emit('reload-config')"><span
        class="tool-icon config">
        <Icon type="md-refresh" />
      </span><span>刷新配置</span></Button>
  </section>
</template>

<script setup lang="ts">
defineProps<{ hasActiveTab: boolean; selectedProject: boolean }>();

defineEmits<{
  "create-crud": [];
  "create-single": [];
  save: [];
  delete: [];
  "refresh-tree": [];
  "reload-config": [];
}>();
</script>

<style scoped lang="less">
.toolbar {
  display: flex;
  min-height: 70px;
  align-items: start;
  gap: 20px;
  padding: 12px 15px 2px;
  border-top: 1px solid lightgray;
  border-bottom: 1px solid white;
  background-color: #eaeaea;
  background-image: linear-gradient(#fefefe, #e6e6e6);
  color: gray;
  text-shadow: 1px 1px 1px white;
}

.tool {
  display: flex;
  width: 50px;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border: 0;
  background: transparent;
  padding: 0;
  color: gray;
  font-size: .73rem;
  white-space: nowrap;
}

.tool:hover:not(:disabled) {
  color: black;
}

.tool:disabled {
  cursor: default;
  color: lightgray;
}

.tool-icon {
  display: inline-grid;
  width: 32px;
  height: 29px;
  place-content: center;
  border: 1px solid lightgray;
  border-radius: 3px;
  box-shadow: 1px 1px 1px white;
  background: #fff;
  font-size: 25px;
  font-weight: 300;
  line-height: 1;
}

.tool:hover:not(:disabled) .tool-icon {
  border-color: gray;
}

.new {
  color: green;
}

.sql {
  color: #9147b8;
  font-size: 16px;
  font-weight: bold;
}

.delete {
  color: red;
}

.save {
  color: #f90;
}

.refresh {
  color: #d4a026;
}

.config {
  color: darkcyan;
}

.toolbar-spacer {
  flex: 1;
}
</style>
