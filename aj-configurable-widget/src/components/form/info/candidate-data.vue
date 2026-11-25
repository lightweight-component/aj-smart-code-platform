<template>
  <div>
    <RadioGroup v-model="type">
      <div>
        <Radio :label="1">
          从 API 接口获取数据
          <Tooltip content="指定 URL 读取列表，并填写返回数据中用于显示和保存的字段名。" placement="right">
            <i class="ivu-icon ivu-icon-ios-help-circle-outline"></i>
          </Tooltip>
        </Radio>
      </div>

      <div v-show="type === 1" class="box">
        <div>
          <label>
            API 接口：<Input size="small" class="api-url" v-model.trim="extAttribs.api" placeholder="接口 URL" />
          </label>
        </div>
        <div>
          <label>
            外显字段：<Input size="small" class="api-field" v-model.trim="extAttribs.keyField" placeholder="如 name" />
          </label>
          <label>
            值字段：<Input size="small" class="api-field" v-model.trim="extAttribs.valueField" placeholder="如 id" />
          </label>
        </div>
      </div>

      <div>
        <Radio :label="2">
          指定数据 <Tooltip content="相当于静态数据" placement="right"><i class="ivu-icon ivu-icon-ios-help-circle-outline" />
          </Tooltip>
        </Radio>
      </div>
    </RadioGroup>

    <div v-show="type === 2" class="box">
      <ul>
        <li>
          <div class="id"><b>值</b></div>
          <div class="name"><b>外显名称</b></div>
          <div class="isChecked"><b>删除</b></div>
        </li>
        <li v-for="(item, index) in extAttribs.candidateData" :key="index">
          <div class="id">
            <input v-model="item.value" />
          </div>
          <div class="name"><input v-model="item.name" /></div>
          <div class="isChecked">
            <!--  <div>
              <input type="checkbox" v-model="item.checked" />
            </div> -->
            <div><a title="删除数据" @click="del(index)">⨯</a></div>
          </div>
        </li>
      </ul>
      <button type="button" class="plus" aria-label="添加数据" title="添加数据" @click="add">✚</button>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * 候选数据
 */
import { defineComponent, type PropType } from 'vue';
import type { CandidateSettings } from '../../../types/candidate-data';

export default defineComponent({
  props: {
    extAttribs: { type: Object as PropType<CandidateSettings>, required: true }
  },
  computed: {
    type: {
      get(): number {
        return Number(this.extAttribs.type) === 1 ? 1 : 2;
      },
      set(value: number) {
        this.extAttribs.type = value;
      }
    }
  },
  methods: {
    add(): void {
      if (!Array.isArray(this.extAttribs.candidateData))
        this.extAttribs.candidateData = [];

      this.extAttribs.candidateData.push({ value: "", name: "" });

      // 输入框获取焦点
      this.$nextTick(() => {
        const inputs = this.$el?.querySelectorAll(".id input");
        inputs?.[inputs.length - 1]?.focus();
      });
    },

    /**
     * 删除
     *
     * @param index
     */
    del(index: number): void {
      if (Array.isArray(this.extAttribs.candidateData))
        this.extAttribs.candidateData.splice(index, 1);
    },
  },
});
</script>

<style lang="less" scoped>
ul {
  width: 350px;
  max-height: 400px;
  // margin: 30px 0;
  border: 1px solid lightgray;
  overflow-x: auto;
}

li {
  list-style: none;

  &:hover {
    color: black;

    .isChecked {
      a {
        display: inline;
      }
    }
  }

  &:nth-child(odd) {
    background-color: #f0f0f0;
  }

  &>div {
    display: inline-block;
    width: 33%;
    text-align: center;

    div {
      width: 20px;
      display: inline-block;
    }

    input {
      border: none;
      text-align: center;
      width: 90%;
      background-color: transparent;
      outline: none;
    }
  }

  .isChecked {
    a {
      // display: none;
      color: red;
    }
  }
}

.box {
  position: relative;

  .plus {
    color: green;
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
    padding: 0;
  }

}

.api-url {
  width: 220px;
}

.api-field {
  width: 80px;
}
</style>
