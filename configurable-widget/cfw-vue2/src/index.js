// 动态引入组件
const requireComponent = require.context('./', true, /\.vue$/);

const components = {};

requireComponent.keys().forEach(fileName => {
    if (fileName != './App.vue') {
        const cmp = requireComponent(fileName).default || requireComponent(fileName);

        if (cmp.extendOptions && cmp.extendOptions.name)
            components[cmp.extendOptions.name] = cmp;
    }
});

// 插件
const install = (Vue) => {
    if (install.installed)
        return install.installed;

    requireComponent.keys().forEach(fileName => {
        if (fileName != './App.vue') {
            // 第i个组件
            const cmp = requireComponent(fileName).default || requireComponent(fileName);

            if (cmp.extendOptions && cmp.extendOptions.name) {
                // console.log(fileName, cmp.extendOptions.name);

                // 注册组件（组件名，组件）
                Vue.component(cmp.extendOptions.name, cmp);
            }
        }
    });

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