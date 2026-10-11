<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="brand">可配置组件管理</div>
      <nav aria-label="管理菜单">
        <RouterLink to="/list" class="menu-item" active-class="is-active">
          <Icon type="ios-list" size="20" />列表管理
        </RouterLink>
        <RouterLink to="/form" class="menu-item" active-class="is-active">
          <Icon type="ios-paper-outline" size="20" />表单管理
        </RouterLink>
      </nav>
    </aside>
    <main class="admin-main">
      <header class="page-header">{{ route.meta.title || '可配置组件管理' }}</header>
      <section class="page-content">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
const route = useRoute();
</script>

<style scoped lang="less">
.admin-layout {
  display: flex;
  height: 100%;
  background: #f5f7f9;
}

.admin-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: #17233d;
  color: white;
  overflow-y: auto;
}

.brand {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  font-size: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, .1);
}

nav {
  padding: 16px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 24px;
  color: #c5c8ce;
  transition: background .15s;
}

.menu-item:hover {
  background: #253657;
  color: white;
}

.menu-item.is-active {
  background: #2d8cf0;
  color: white;
}

.menu-item:focus-visible {
  outline: 2px solid white;
  outline-offset: -3px;
}

.admin-main {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}

.page-header {
  height: 64px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background: white;
  border-bottom: 1px solid #e8eaec;
  font-size: 18px;
}

.page-content {
  flex: 1;
  min-height: 0;
  padding: 24px;
  overflow: auto;
}
</style>
