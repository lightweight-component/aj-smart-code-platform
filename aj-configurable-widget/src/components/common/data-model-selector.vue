<template>
  <div style="width:900px;margin:0 auto;">
    1、数据源 <Select v-model="datasource.id" style="width:200px;margin-right: 20px;" placeholder="请先选择一个数据源">
      <Option v-for="item in datasource.list" :key="item.id" :value="item.id">{{ item.name }}</Option>
    </Select>
    <span v-if="database.isShow">数据库 </span>
    <Select v-if="database.isShow" v-model="database.name" style="width:200px;margin-right: 20px;" placeholder="选择数据库">
      <Option v-for="(item, index) in database.list" :key="index" :value="item">{{ item }}</Option>
    </Select>

    <div style="height:450px;margin: 20px auto">
      <div style="float:left">
        <div style="width:300px;">
          <Divider size="small">2、选择一张表</Divider>
        </div>
        <ul class="box even">
          <li v-for="item in tables" :key="item.tableName"><span class="right">
              <div class="notTooLong">{{ item.comment }}</div> &nbsp;&nbsp;<a href="javascript:void(9);"
                @click="selectedTableName = item.tableName; selectedTableComment = item.comment;">选择</a>
            </span>{{ item.tableName }}</li>
        </ul>
      </div>
      <img style="float:left;margin:180px 20px 0 20px"
        src="data:image/gif;base64,R0lGODlhNwBmANU/APLy8+7u7+jo6vDw8erq6/T09eLi4+zs7fLy9O/v8PDw8Ozr7Orq7OHh4////+Dg4v7+/uHh5P39/eTk5vb29+Dg4/z8/OLi5fv7+/n5+uHh4vr6+vb29vX19vr6++Xl5+Hg4/f39+bm5/n5+eHg4uPj5fj4+efn6ff3+Ojn6f39/ufn6Ozs7v7+/+bm6O3t7uXl5ujo6fj4+PX29/b19vv7/OLh5Pz7/Pz8/enp6uTk5+Xk5+Tj5ePj5OLi5P///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0MzQyLCAyMDEwLzAxLzEwLTE4OjA2OjQzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRGMjRCN0EyMzcwRDExRUNBMEIyQTM4MDcwNjA2OTY4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRGMjRCN0EzMzcwRDExRUNBMEIyQTM4MDcwNjA2OTY4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NEYyNEI3QTAzNzBEMTFFQ0EwQjJBMzgwNzA2MDY5NjgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NEYyNEI3QTEzNzBEMTFFQ0EwQjJBMzgwNzA2MDY5NjgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQBAAA/ACwAAAAANwBmAAAG/8CfcEgcOjKsVADjKDqf0KhU6Cg0GpErZ8rtTk0Pn1jc2HjPaMinMfZdIisIej6lkNrjB4DOdzoObGMXbRh9hj8qO4F4Pg05TYd0GYx4Dx2RdByLlA0TEphoNJucAZCgXBSjnBmnXZOUeA0ucq1SKh8RsG16prV+LKqchb5QIWG6YheOvcRDECnBjJbNTxsayG2e1EUOCdGxL8zUEhPfbSQm20Wa2GQitOo/DgvmYxUA4s0W7WNl8UMAjmFrECMfsWf13Dwo8E+Ih4RjPv3rBrEBC4O+JMDI1e5BuoYhKvBrIMJCwz8gRg7AWGsfx4EeGv4oIBBZgxQsW0HI8RLZQv+ZHviJKTEsnoMBIrEpYwFPnZqKFGTKqPjB5MQXEEEkyHlKQo+KrBp2qChAolECEEkgkImhJzKiJwfU1NXgQNNtT0duaWgCYgRtVyE+KNXQq1tYDYrGmwGxwgCZDtC2g9OCrQGhMU8GbNcghMwfEE7UaxBVZosco0s3pMlZdTwLBg5TMjPxQFKbLlQ0RNGYcDwI5UaOmDggJecFXDF5kA3LqlPRg7D9/Meac467zXDEHplZ3byKCpJHsjPyg9lt5CqimOgtus2L/zJcmwz4ueBL/xDMRfzoH2yhiU1Ez0j4/MOBBu7R9c4/6Y0kA3vzDRTOPyNUVB9eKwjm2jYA3IakTAQEiHeIBQ0kqIsBNUwkWUd7GLgfJ7MwyENFwxkVQIQ2bUUhjnRNoNtvImg40WacMSCiITckw49z2ziAGj8PrEVhRXGw9yIjDYQFZEIN6PjPBiPpgB01ISRUwXoyjTXQAUeOlxCT8Ukn5WcNUhLBCWN6NyAntH0mRAcvarCSn86U4FYDMOTZEAXG2fMRoUZ0mIsNIBQIKREOhBBDCTmgUJk6QQAAOw==" />
      <div style="float:left">
        <div style="width:300px;">
          <Divider size="small">3、选择<span v-if="selectedTableName">表 [{{ selectedTableName }}] 的</span>{{ isSingleSelect
            ? '一个' : '' }}字段</Divider>
        </div>
        <ul class="box odd" style="margin-bottom:10px">
          <li v-for="item in fields" :key="item.name">
            <label>
              <input type="checkbox" v-model="item.checked" />&nbsp;
              <span class="right notTooLong">{{ item.comment }}</span>{{ item.name }}: <span style="color:lightgray">{{
                item.type }}</span>
            </label>
          </li>
        </ul>

        <a v-if="!isSingleSelect" @click="selectAllField" style="padding-top:10px;">全选</a>
        <!-- | <a href="#" @click="getSelected">Test</a> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { requestResponse, type ApiResponse } from '../../api/http';

/**
 * 表信息
 */
interface TableInfo {
  tableName: string;
  comment: string;
}

export default defineComponent({
  props: {
    apiRoot: { type: String, required: true },  // 接口前缀
    isSingleSelect: { type: Boolean, default: false } // 是否只允许选择一个字段
  },
  data() {
    return {
      API: `${this.apiRoot}/datasource`,
      datasource: {
        id: 0,
        list: [],
        name: ''
      },
      database: {
        isShow: false,
        name: '',
        list: []
      },
      tables: [] as TableInfo[],
      selectedTableName: '', // 选中的表名
      selectedTableComment: '', // 选中的表的注释
      fields: [] as CheckableDataBaseColumnMeta[]
    };
  },

  mounted(): void {
    this.getDatasource();
  },

  methods: {
    /**
     * 获取数据源
     */
    getDatasource(): void {
      let params: any = { start: 0, limit: 999 };

      requestResponse<any>(this.API, { params: params }).then((j: ApiResponse<any>) => {
        if (j.status) {
          this.datasource.list = j.data;

          if (this.datasource.list[0])
            this.datasource.id = this.datasource.list[0].id; // 默认显示第一个数据源的
        } else
          this.$Message.error('获取数据源失败');
      }).catch((error: unknown) => { this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
    },

    /**
     * 获取表
     */
    getTables(): void {
      let url: string = `${this.API}/${this.datasource.id}/all_tables_comment`;

      if (this.database.isShow)
        url += '?dbName=' + this.database.name;

      requestResponse<any>(url).then((j: ApiResponse<any>) => {
        if (j.status) {
          let arr: TableInfo[] = j.data as TableInfo[];
          arr.sort(sortFn);
          this.tables = arr;

          if (this.tables[0]) {
            this.selectedTableName = this.tables[0].tableName;
            this.selectedTableComment = this.tables[0].comment;
          }
        } else
          this.$Message.error('获取表失败');
      }).catch((error: unknown) => { this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
    },

    /**
     * 获取字段
     */
    getFields(): void {
      let url: string = `${this.API}/${this.datasource.id}/table_all_column/${this.selectedTableName}`;

      if (this.database.isShow)
        url += '?dbName=' + this.database.name;

      requestResponse<any>(url).then((j: ApiResponse<any>) => {
        if (j.status) {
          let arr: any[] = j.data as any[];
          arr.sort(sortFn);

          this.fields = arr.map((item: CheckableDataBaseColumnMeta) => {
            let obj: any = item;
            item.isKey = obj.isKey === 'true';
            item.defaultValue = obj.default;
            (item as CheckableDataBaseColumnMeta).checked = false;

            return item;
          });
        } else
          this.$Message.error('获取字段列表失败');
      }).catch((error: unknown) => { this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
    },

    /**
     * 返回选择结果
     * 
     * @returns 
     */
    getSelected(): SelectedTable | null {
      const fields: CheckableDataBaseColumnMeta[] = this.fields.filter((item: CheckableDataBaseColumnMeta) => item.checked);
      const selectedTable: SelectedTable = {
        datasourceId: this.datasource.id, datasourceName: this.datasource.name,
        tableName: this.selectedTableName, comment: this.selectedTableComment
      };

      if (this.isSingleSelect) {
        if (fields.length > 1) {
          this.$Message.warning('请只选择一个字段');
          return null;
        }

        selectedTable.field = fields[0];
      } else
        selectedTable.fields = fields;

      return selectedTable;
    },

    /**
     * 全选字段
     */
    selectAllField(): void {
      this.fields.forEach((item: CheckableDataBaseColumnMeta) => item.checked = true);
    },
    getDatabase(id: number): void {
      requestResponse<any>(this.API + '/../data_service/getDatabases', { params: { datasourceId: id } }).then((j: ApiResponse<any>) => {
        if (j.status) {
          this.database.list = j.data;
          this.database.name = this.database.list[0]; // 默认显示第一个数据库的
        } else
          this.$Message.warning('获取数据库名失败');
      }).catch((error: unknown) => { this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
    }
  },
  watch: {
    'datasource.id'(v: number): void {
      this.getTables(); // 会重复执行，没有 库名 FIXME

      // 为了获取 getDatasourceName
      this.datasource.list.forEach((item: any) => {
        if (item.id == v) {
          this.datasource.name = item.name;

          if (item.crossDB) {// 显示选择库
            this.database.isShow = true;
            this.getDatabase(item.id);
          } else
            this.database.isShow = false;
        }
      });
    },
    selectedTableName(v: string): void {
      this.getFields();
    },
    'database.name'(dbName: string): void {
      this.getTables();
    }
  }
});

const sortFn = (a: any, b: any): number => {
  if (a.tableName > b.tableName)
    return 1;

  if (a.tableName < b.tableName)
    return -1;

  return 0;
}
</script>

<style lang="less" scoped>
.notTooLong {
  display: inline-block;
  color: gray;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 190px;
  white-space: nowrap;
  vertical-align: middle;
}

.box {
  width: 400px;
  height: 400px;
  // margin: 30px 0;
  border: 1px solid lightgray;
  overflow-x: auto;

  li {
    list-style: none;
    padding: 5px 15px;

    // background-color: #e3e3e3;
    &:hover {
      color: black;
    }

    span.right {
      float: right;
    }

    label {
      cursor: pointer;
    }
  }
}

.box.even {
  li:nth-child(even) {
    background-color: #f0f0f0;
  }
}

.box.odd {
  li:nth-child(odd) {
    background-color: #f0f0f0;
  }
}
</style>