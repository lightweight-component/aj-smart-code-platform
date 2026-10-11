<template>
    <Modal :title="(isCreate ? '新建' : '编辑') + '项目'" :loading="loading" v-model="isShow" ok-text="保存"
        @on-ok="saveProject" cancel-text="" width="600">
        <i-Form ref="editForm" :model="data" :rules="rules" :label-width="180" style="margin-right:100px">
            <form-item label="项目名称" prop="name">
                <i-Input v-model="data.name" placeholder="项目名称" />
            </form-item>
            <form-item label="项目简介" prop="content">
                <i-Input type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" placeholder="项目简介，可选的"
                    v-model="data.content" />
            </form-item>
            <form-item label="API 前缀-开发阶段" prop="apiPrefixDev">
                <i-Input v-model="data.apiPrefixDev" placeholder="以 http(s)...开头" />
            </form-item>
            <form-item label="API 前缀-生产环境" prop="apiPrefixProd">
                <i-Input v-model="data.apiPrefixProd" placeholder="以 http(s)...开头" />
            </form-item>
        </i-Form>
    </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { requestResponse, type ApiResponse } from '../../api/http';

export default defineComponent({
    data() {
        return {
            loading: true,
            isShow: false,
            isCreate: true,
            rules: {
                name: [
                    { required: true, message: '项目名称不能为空', trigger: 'blur' }
                ],
                apiPrefixDev: [
                    { required: true, message: 'API 前缀-开发阶段 不能为空', trigger: 'blur' }
                ],
                apiPrefixProd: [
                    { required: true, message: 'API 前缀-生产环境 不能为空', trigger: 'blur' }
                ],
            },
            data: {} as DataService_Porject
        };
    },
    methods: {
        saveProject(): void {
            this.loading = false;

            (this.$refs['editForm'] as any).validate((valid: boolean) => {
                if (valid) {
                    if (this.isCreate) {
                        requestResponse<any>(`${window.config.dsApiRoot}/common_api/project`, { method: 'POST', body: this.data }).then((j: ApiResponse<any>) => {
                            if (j.status) {
                                this.$Message.success('创建项目成功');
                                this.$parent.refreshTree();
                            } else
                                this.$Message.error(j.message);

                            this.loading = true;
                        }).catch((error: unknown) => { this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
                    } else {
                        requestResponse<any>(`${window.config.dsApiRoot}/common_api/project`, { method: 'PUT', body: this.data }).then((j: ApiResponse<any>) => {
                            if (j.status) {
                                this.$Message.success('修改项目成功');
                                this.$parent.refreshTree();
                            }
                            else
                                this.$Message.error(j.message);

                            this.loading = true;
                        }).catch((error: unknown) => { this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
                    }
                }
                else
                    this.loading = false;
            });
        },
        update(): void {
            this.isCreate = false;
            this.isShow = true;
        },

        create(): void {
            this.isCreate = true;
            this.isShow = true;
            this.data = {};
        },

        deletePorject(): void {
            this.$Modal.confirm({
                title: '确定删除吗？',
                content: `<p>删除<b>工程 ${this.data.name}</b> 以及其所有的<b>服务</b>？</p>`,
                onOk: () => {
                    requestResponse<any>(`${window.config.dsApiRoot}/common_api/project/${this.data.id}`, { method: 'DELETE' }).then((j: ApiResponse<any>) => {
                        if (j.status) {
                            this.$Message.info('删除成功');
                            this.$parent.refreshTree();
                        }
                    }).catch((error: unknown) => { this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
                }
            });
        },
    }
});
</script>