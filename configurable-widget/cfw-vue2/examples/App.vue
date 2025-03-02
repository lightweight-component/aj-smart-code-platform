<template>
  <div id="app"> <Button>Default</Button>
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <ListLoader ref="listLoader" :id="2" api-prefix="http://127.0.0.1:8888/iam" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ListLoader from '../src/iview/list/list-loader.vue';
import UI from "@ajaxjs/ui";

/**
 * 配置
 */
interface ConfigInterface {
    /**DS
     * DS
     */
    dsApiRoot: string;
    IAM_ApiRoot: string;
    loginUrl: string;
    thisPageUrl: string;
}
// 声明 window.config 并为其指定类型
declare const window: Window & {
    config: ConfigInterface;
};

UI.IAM.getLoginInfo(window.config.loginUrl, window.config.thisPageUrl);

export default Vue.extend({
  name: 'App',
  components: {
    ListLoader
  }
});
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
