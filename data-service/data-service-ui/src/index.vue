<template>
  <DataService />
</template>

<script>
import DataService from "./data-service/data-service.vue";
import aj from '@ajaxjs/ui/dist/';

aj.IAM.getLoginInfo(window.config.loginUrl, window.config.thisPageUrl);

export default {
  components: {
    DataService
  },
  methods: {
    routeTo(route) {
      location.hash = "#/" + route;
    },
    open(route) {
      window.open("#/" + route);
    },
  },
};
</script>

<style lang="less">
.home h2,
.home p {
  max-width: 800px;
  margin: 10px auto;
}

html,
body{
  overflow: hidden;
}

html,
body,
.main > .ivu-menu {
  height: 100%;
}

/* 分页控件有点问题，修改下 */
.ivu-mt.ivu-text-right {
  text-align: right;
  margin-top: 20px;
}

h1.page-title {
  margin: 0 0 2% 1%;
  padding-bottom: 1%;
  border-bottom: 1px solid #eee;
  color: #2f518c;
  letter-spacing: 2px;
  height: 9%;
  line-height: 100px;
}

h3 {
  padding: 30px 22px;
  box-sizing: border-box;
  color: #2f518c;
  width: 100%;
  border-right: 1px solid lightgray;
  font-size: 1.3em;
  font-weight: bold;
  letter-spacing: 1px;
  height: 9%;
}

.ivu-menu-submenu-title {
  border-top: 1px solid #eee;
}
</style>