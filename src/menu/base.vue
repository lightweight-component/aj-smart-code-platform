<template>
    <div style="height:100%;">
       <Menu class="left-panel" :open-names="['portal-1', 'portal-2']">
            <h3>Base</h3>
            <Submenu name="portal-1" >
                <template slot="title">网站管理</template>
                <MenuItem name="1-1" @click.native="load = 'WebsiteConfig'">站点管理</MenuItem>
                <MenuItem name="1-2" @click.native="load = 'OrgIndex'">栏目管理</MenuItem>
            </Submenu>

            <Submenu name="portal-2">
                <template slot="title">内容管理</template>
                <MenuItem name="2-1" @click.native="showList(103, '图文')">图文列表</MenuItem>
                <MenuItem name="8-5" @click.native="routeTo('list?id=103&title=图文')">CMS 图文</MenuItem>
                <MenuItem name="2-2" @click.native="showList(123)">附件列表</MenuItem>
                <MenuItem name="2-3" @click.native="load = 'TagMgr'">标签/点赞/收藏管理</MenuItem>
            </Submenu>
        </Menu>
        <div class="right-panel"></div>
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