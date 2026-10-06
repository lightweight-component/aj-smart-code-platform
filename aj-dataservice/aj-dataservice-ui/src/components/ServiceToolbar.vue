<template>
  <section class="toolbar">
    <div :disabled="!hasSelectedGroup" style="float: right;" class="tool" type="text" @click="$emit('reload-config')">
      <div class="tool-icon config">
        <Icon type="md-refresh" />
      </div><span>刷新配置</span>
    </div>
    <div class="tool" type="text" @click="$emit('create')">
      <div class="tool-icon new">
        <Icon type="md-add" />
      </div>
      <span>新建服务</span>
    </div>

    <div :disabled="!hasActiveTab" class="tool" type="text" @click="$emit('delete')">
      <div class="tool-icon delete">
        <Icon type="md-close" />
      </div><span>删除</span>
    </div>
    <div :disabled="!hasActiveTab" class="tool" type="text" @click="$emit('save')">
      <div class="tool-icon save">
        <Icon type="ios-create" />
      </div><span>保存</span>
    </div>
    <div class="tool" type="text" @click="$emit('refresh-tree')">
      <div class="tool-icon refresh">
        <Icon type="md-refresh" />
      </div><span>重新加载</span>
    </div>

  </section>
</template>

<script setup lang="ts">
defineProps<{ hasActiveTab: boolean; hasSelectedGroup: boolean }>();

defineEmits<{
  create: [];
  save: [];
  delete: [];
  "refresh-tree": [];
  "reload-config": [];
}>();
</script>

<style scoped lang="less">
.toolbar {
  min-height: 67px;
  padding: 12px 15px 2px;
  border-bottom: 1px solid white;
  background-color: #eaeaea;
  background-image: linear-gradient(#fefefe, #e6e6e6);
  color: gray;
  text-shadow: 1px 1px 1px white;
}

.tool {
  display: inline-block;
  width: 48px;
  text-align: center;
  margin-right: 20px;
  border: 0;
  padding: 0;
  color: gray;
  font-size: .72rem;
  white-space: nowrap;
  text-shadow: 1px 1px 1px #fff;
  cursor: pointer;

  &:hover {
    background-color: transparent;
  }

  .tool-icon {
    width: 30px;
    height: 26px;
    margin: 0 auto;
    margin-bottom: 5px;
    border: 1px solid lightgray;
    border-radius: 3px;
    box-shadow: 1px 1px 1px white;
    font-size: 25px;
    font-weight: 300;
    line-height: 1;
    padding-top: 3px;
    font-size: 19px;
  }
}

.tool:hover:not(:disabled) {
  color: black;
}

.tool:disabled {
  cursor: default;
  color: lightgray;
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
