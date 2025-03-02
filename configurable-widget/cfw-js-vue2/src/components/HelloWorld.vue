<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>

      <OpacityBanner style="width:300px;margin:0 auto">
        <li><img src="https://img1.mydrivers.com/img/topimg/20220315/192429144.jpg" /></li>
        <li><img src="https://img1.mydrivers.com/img/topimg/20220315/192403940.jpg" /></li>
        <li><img src="https://img1.mydrivers.com/img/topimg/20220315/192314256.jpg" /></li>
        <li><a target="iframepage" href="../job/job.jsp">招聘管理</a></li>
      </OpacityBanner>

      <Expander :close-height="50" style="width: 300px;margin:5% auto;">
        Lorem Ipsum，也称乱数假文或者哑元文本， 是印刷及排版领域所常用的虚拟文字。
        由于曾经一台匿名的打印机刻意打乱了一盒印刷字体从而造出一本字体样品书， Lorem Ipsum从西元15世纪起就被作为此领域的标准文本使用。
        <div class="mask-layer"></div>
      </Expander>

    </p>
    <FooAbc></FooAbc>
    <HelloWorld />
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
// import HelloWorld from '@ajaxjs/configurable-widget-vue2/';
// import  Calendar  from "@ajaxjs/widgets";
// console.log(Calendar);

export default {
  // components: { Calendar },
  name: "HelloWorld2",
  // components:{HelloWorld},
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
