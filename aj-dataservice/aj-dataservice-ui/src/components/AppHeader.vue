<template>
  <header class="app-header">
    <div class="brand"><img alt="" src="../assets/icon.png" /> 数据服务 Data Service</div>
    <div class="header-actions">
      <span v-if="apiRoot">数据源：</span><a href="https://dev.ajaxjs.com/docs/data-service/" rel="noreferrer"
        target="_blank">帮助</a><span>|</span><a href="#" @click.prevent>关于</a>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{ apiRoot: string }>();
</script>

<style scoped lang="less">
.app-header {
  height: 30px;
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border-bottom: 1px solid white;
  background-color: #e3e3e3;
  background-image: linear-gradient(#fefefe, #d8d8d8);
  color: #555;
  text-shadow: 1px 1px 1px white;
  font-size: 14px;
}

.brand {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.brand img {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.header-actions {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 13px;
}

.header-actions span:first-child {
  color: #666;
}

a {
  color: #3576a9;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
