// 入口文件

// 动态引入组件
const requireComponent = require.context('./', true, /\.vue$/);
console.log(typeof requireComponent)

import FooAbc from './FooAbc.vue';
const components = [];

// requireComponent.keys().forEach(fileName => {
//     console.log(fileName);
//     const config = requireComponent(fileName).default || requireComponent(fileName);
//     components.push(config);
// });

// 插件
const install = Vue => {
    if (install.installed)
        return install.installed;

    requireComponent.keys().forEach(fileName => {
        // 第i个组件
        const config = requireComponent(fileName).default || requireComponent(fileName);
        console.log(fileName, config.extendOptions.name);
        console.log(config)
        // 注册组件（组件名，组件）
        Vue.component(config.extendOptions.name, config);
        components.push(config);
    });

    // components.forEach(cmp => {
    //     console.log(cmp.name);
    //     Vue.component(cmp.name, cmp);
    // });

    // console.log(FooAbc);

    // Vue.component("FooAbc", FooAbc);

    // 全局自定义指令
    Vue.directive('focus', {
        inserted: function (el) {
            el.focus();
        }
    });
}

// 环境检测
if (typeof window !== 'undefined' && window.Vue)
    install(window.Vue);

export default {
    install,
    ...components//组件也一样要暴露
}