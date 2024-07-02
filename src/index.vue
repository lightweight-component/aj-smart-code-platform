<template>
  <DataService />
</template>

<script>
import DataService from "./data-service/data-service.vue";
// import DataServiceIndex from "../components/data-service/index/index.vue";
import { setBaseQueryString } from '@ajaxjs/util/dist/util/xhr';

function getQueryParam(variable, isParent) {
  var query = (isParent ? parent.location : window.location).search.substring(
    1
  );
  var vars = query.split("&");

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");

    if (pair[0] == variable) return pair[1];
  }

  return false;
}

window.loginUrl = "http://127.0.0.1:8088/base/user/login?web_url=http://localhost:8081";
const token = getQueryParam("token");
let accessToken = localStorage.getItem("accessToken");

if (!accessToken && !token) {
  // alert("你未登录！");
  // location.assign(loginUrl);
}

if (token) {
  accessToken = decodeURIComponent(token);
  localStorage.setItem("accessToken", accessToken);

  // 只需要第一次的参数，之后不需要，现在清除
  const url = new URL(location.href); // 创建一个包含查询参数的URL
  const params = new URLSearchParams(url.search); // 获取URL中的查询参数
  params.delete("token"); // 删除名为'b'的参数
  url.search = params.toString(); // 更新URL的查询参数

  location.assign(url.href);
}

// window.JWT_TOKEN = JSON.parse(accessToken);

// 将JWT Token拆分为三个部分
// const tokenParts = window.JWT_TOKEN.id_token.split(".");
// const tokenParts = accessToken.split(".");
// const payload = JSON.parse(atob(tokenParts[1])); // 解析载荷
// console.log(payload.aud);

// // 租户 id
// const arr = payload.aud.match(/(?<=tenantId=)\d+/);

// if (arr) {
//     const tenantId = arr[0];
//     setBaseQueryString({ tenantId: tenantId });
// }

// 监听来自A域的网页发送的消息
window.addEventListener("message", function (event) {
  // if (event.origin === 'http://A域的网页地址') {
  console.log("收到来自A域的网页的消息：", event.data);

  if (event.data === "doLogout") {
    localStorage.removeItem("accessToken");
  }
  // }
});

export default {
  components: {
    DataService
  },
  data() {
    return {

    };
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