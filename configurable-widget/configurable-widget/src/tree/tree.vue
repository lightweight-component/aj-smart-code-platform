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
                <Icon type="ios-add" /> 新建项目</Dropdown-Item>
              <Dropdown-Item @click.native="$parent.$parent.$refs.project.update">
                <Icon type="ios-create" /> 编辑项目</Dropdown-Item>
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

<script lang="ts" src="./tree.ts"></script>

<style lang="less" scoped>
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