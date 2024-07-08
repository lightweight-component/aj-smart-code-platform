<template>
    <div class="area">
       <Menu class="left-panel" :open-names="['portal-1', 'portal-2']">
            <h3>模型</h3>
            <Submenu name="portal-1" >
                <template slot="title">API 管理</template>
                <MenuItem name="1-1" @click.native="load = 'WebsiteConfig'">数据源管理</MenuItem>
                <MenuItem name="1-2" @click.native="load = 'OrgIndex'">数据服务</MenuItem>
            </Submenu>

            <Submenu name="portal-2">
                <template slot="title">内容管理</template>
                <MenuItem name="2-1" @click.native="showList(103, '图文')">模型设计</MenuItem>
                <MenuItem name="8-5" @click.native="routeTo('list?id=103&title=图文')">列表生成器</MenuItem>
                <MenuItem name="2-2" @click.native="showList(123)">表单生成器</MenuItem>
            </Submenu>
        </Menu>
        <div class="right-panel">
            <iframe src="workbeanch.html"></iframe>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            load: ''
        };
    },
    methods: {
        showList() {
            
        }
    }
}
</script>

<style lang="less" scoped src="./menu.less"></style>