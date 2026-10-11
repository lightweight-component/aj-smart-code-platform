<template>
    <span>
        <div class="search-panel ">
            <i-Input suffix="ios-search" placeholder="搜索……" style="width: 90%" />
        </div>

        <Tree ref="treeCmp" :data="treeData" :load-data="loadTreeData" style="height: 93%;overflow-y: auto;margin-left: 10px;"
            @on-contextmenu="handleContextMenu" @on-select-change="$parent.$parent.openLeft">
            <template slot="contextMenu">
                <span v-if="isProjectNode">
                    <Dropdown-Item @click.native="$parent.$parent.$refs.project.create" style="color:green">
                        <Icon type="ios-add" /> 新建项目
                    </Dropdown-Item>
                    <Dropdown-Item @click.native="$parent.$parent.$refs.project.update">
                        <Icon type="ios-create" /> 编辑项目
                    </Dropdown-Item>
                    <Dropdown-Item @click.native="$parent.$parent.$refs.project.deletePorject" style="color: #ed4014">
                        <Icon type="ios-trash" /> 删除项目
                    </Dropdown-Item>
                </span>
                <span v-if="!isProjectNode">
                    <Dropdown-Item style="color: #ed4014">删除服务</Dropdown-Item>
                </span>
            </template>
        </Tree>
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { requestResponse, type ApiResponse } from '../../api/http';

export default defineComponent({
    data() {
        return {
            treeData: [],
            isProjectNode: false, // 鼠标右键菜单用的
        };
    },

    created(): void {
        this.refreshTree();
    },
    methods: {
        handleContextMenu(data: any): void {
            if (!data.parentNode) {// it's a project
                this.isProjectNode = true;
                let { id, name, content, apiPrefixDev, apiPrefixProd, defaultConfig } = data.projectData;

                let project = this.$parent.$parent.$refs.project;
                project.$refs['editForm'].resetFields();
                project.data = { id, name, content, apiPrefixDev, apiPrefixProd, defaultConfig };
            } else
                this.isProjectNode = false;
        },
        /**
         * 更新根节点的数据
         */
        refreshTree(): void {
            this.loadTreeData(null, data => this.treeData = data);
        },

        // 异步加载树数据
        loadTreeData(item: null, callback: Function): void {
            requestResponse<any>(`${window.config.dsApiRoot}/common_api/ds_project/list?allow=1`).then((j: ApiResponse<any>) => {
                if (j.status) {
                    let data: DS_TreeNode_Project[] = [];

                    (j.data as []).forEach((project: DataService_Porject) => {
                        let projectTreeNode: DS_TreeNode_Project = {
                            title: project.name,
                            loading: false,
                            expand: true,
                            children: [],
                            contextmenu: true,
                            projectData: project,
                            render: renderProjectTreeNode
                        };

                        this.loadTreeProejct(/* Utils.isDebug() */true ? project.apiPrefixDev : project.apiPrefixProd, projectTreeNode)
                        data.push(projectTreeNode);
                    });

                    callback(data);
                }
            }).catch((error: unknown) => { this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
        },

        /**
         * 加载服务列表
         * 
         * @param apiPrefix 
         * @param projectTreeNode 
         */
        loadTreeProejct(apiPrefix: string, projectTreeNode: DS_TreeNode_Project): void {
            requestResponse<any>(`${apiPrefix}/common_api/ds_common_api/list?allow=1`).then((j: ApiResponse<any>) => {
                if (j.status) {
                    let base: any = {
                        title: '表单定义',
                        selected: false,
                        contextmenu: false,
                        parentNode: projectTreeNode.projectData,
                        render: renderCrudTreeNode
                    };

                    projectTreeNode.children = [
                        { ...base, title: "表单定义" },
                        { ...base, title: "列表定义" }
                    ];
                }
            }).catch((error: unknown) => { this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
        }
    }
});

const renderProjectTreeNode = (h: Function, { root, node, data }) => {
    return [
        h("span", { class: "http-method get" }, "P"),
        h("span", { style: 'font-weight:bold' }, data.title),
    ];
};

const renderCrudTreeNode = (h: Function, { root, node, data }) => {
    if (data.title == '表单定义')
        return [
            h("span", { class: "http-method put" }, 'F'),
            h("span", data.title),
        ];
    else if (data.title == '列表定义')
        return [
            h("span", { class: "http-method post" }, 'L'),
            h("span", data.title),
        ];
};
</script>

<style scoped>
.search-panel {
    border-bottom: 1px solid lightgray;
    background-image: linear-gradient(#fefefe, #e6e6e6);
    height: 69px;
    padding-top: 14px;
    text-align: center;
}
</style>

<style lang="less">
.search-panel {
    border-bottom: 1px solid lightgray;
    background-image: linear-gradient(#fefefe, #e6e6e6);
    height: 69px;
    padding-top: 14px;
    text-align: center;
}

.http-method {
    padding: 1px 6px;
    margin-right: 5px;
    border-radius: 3px;
    font-size: 8px;

    &.get {
        color: #3175fe;
        border: 1px solid #3175fe;
    }

    &.post {
        color: green;
        border: 1px solid green;
    }

    &.put {
        color: rgb(224, 60, 254);
        border: 1px solid rgb(224, 60, 254);
    }

    &.delete {
        color: red;
        border: 1px solid red;
    }
}
</style>