import { Xhr, Utils } from "@ajaxjs/util";

declare const window: Window & {
    config: ConfigInterface;
};

export default {
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
            Xhr.xhr_get(`${window.config.dsApiRoot}/common_api/project/list`, (j: RepsonseResult) => {
                if (j.status) {
                    let data: DS_TreeNode_Project[] = [];

                    j.data.forEach((project: DataService_Porject) => {
                        let projectTreeNode: DS_TreeNode_Project = {
                            title: project.name,
                            loading: false,
                            expand: true,
                            children: [],
                            contextmenu: true,
                            projectData: project,
                            render: renderProjectTreeNode
                        };

                        this.loadTreeProejct(Utils.isDebug() ? project.apiPrefixDev : project.apiPrefixProd, projectTreeNode)
                        data.push(projectTreeNode);
                    });

                    callback(data);
                }
            });
        },

        /**
         * 加载服务列表
         * 
         * @param apiPrefix 
         * @param projectTreeNode 
         */
        loadTreeProejct(apiPrefix: string, projectTreeNode: DS_TreeNode_Project): void {
            Xhr.xhr_get(`${apiPrefix}/common_api/common_api/list`, (j: RepsonseResult) => {
                if (j.status) {
                    let base: any = {
                        title: '表单定义',
                        selected: false,
                        contextmenu: false, parentNode: projectTreeNode.projectData, render: renderCrudTreeNode
                    };
                    let data = [
                        { ...base, title: "表单定义" },
                        { ...base, title: "列表定义" }
                    ];

                    projectTreeNode.children = data;
                }
            });
        }
    }
};

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