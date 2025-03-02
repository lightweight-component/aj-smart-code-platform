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

/**
 * 项目
 */
type DataService_Porject = {
    id: number;
    name: string;
    content: string;
    apiPrefixDev: string;
    apiPrefixProd: string;
    defaultConfig: any;
};

/**
 * 树节点
 */
type DS_TreeNode_Project = {
    title: string,
    contextmenu: boolean,
    expand?: boolean,
    loading: boolean,
    render: Function,
    projectData: any,
    children?: DS_TreeNode_Service[]
};

/**
 * 树节点（服务）
 */
type DS_TreeNode_Service = {
    title: string,
    contextmenu: boolean,
    expand?: boolean,
    /**
     * 是否创建的
     */
    isCreate?: boolean,
    data: any,
    id: string,
    parentNode: DS_TreeNode_Service | any,
    render?: Function,
    children?: DS_TreeNode_Service[]
};