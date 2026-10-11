<template>
    <span>
        <Input readonly placeholder="请上传文件" v-model="_v" :on-change="fireData()">
        <template #append>
            <Space split :size="0">
                <Upload :action="uploadUrl" :before-upload="showFile" :show-upload-list="false" :on-success="onSuccess">
                    <Button icon="ios-cloud-upload" title="上传文件" @click="">上传文件</Button>
                </Upload>
                <Button icon="ios-cloud-download" title="上传文件" @click="downloadFile">下载文件</Button>
            </Space>
        </template>
        </Input>
        <div class="msg"></div>
    </span>
</template>

<script lang="ts">
export default {
    props: {
        value: {
            required: true
        },
        uploadUrl: {
            type: String,
            required: true
        }
    },
    data() {
        return { _v: this.value }
    },

    watch: {
        value(v) {
            this._v = v;
        }
    },
    methods: {
        downloadFile(): void {
            downloadFile(this._v);
        },
        showFile(file: any): void {
            console.log(file);
            // this.$Message.info(`已选择文件 ${file.name}`);
        },
        onSuccess(response: any, file: any): void {
            console.log(response);
            let size: number = file.size;
            size = size / 1024;
            const sizeStr: string = size.toFixed(2);

            this.$Message.success(`上传成功：${file.name}，大小：${sizeStr}kb`);

            if (response.status) {
                this._v = response.data.url;
            }
        },
        fireData() {
            if (this._v) {
                this.$emit('update:modelValue', this._v);
            }
        }
    }
};

/**
 * 通过创建临时 <a> 标签并模拟点击，从指定 URL 触发浏览器下载
 * 这个方式会直接让浏览器向 URL 发起请求，不会先将文件加载到内存
 * 
 * @param url - 文件的 URL 地址
 * @param filename - 可选：期望保存的文件名。将作为 download 属性的值。
 */
function downloadFile(url: string): void {
    const newWindow: Window | null = window.open(url, '_blank');

    if (!newWindow) {
        console.warn("Pop-up window was blocked. Please allow pop-ups for this site.");
        throw new Error("Download failed: Pop-up window was blocked by the browser.");
    }
}
</script>

<style lang="less" scoped></style>