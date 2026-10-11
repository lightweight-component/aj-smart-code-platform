import { requestResponse, type ApiResponse } from '../../api/http';
import { dateFormat } from './utils';

export default {
    afterDelete(cb?: Function): Function {
        return function (this: any, j: any) {
            if (j.status) {
                cb && cb(j);
                this.$Message.success('删除成功');
            }
            else
                this.$Message.info('删除失败。' + j.message);
        }
    },

    delInfo(this: any, index: number) {
        requestResponse<any>(`${this.API}/${this.list.data[index].id}`, { method: 'DELETE' }).then((j: any) => {
            if (j.status) {
                this.list.data.splice(index, 1);
                this.list.total--;
                this.$Message.success('删除成功');
            } else
                this.$Message.info('删除失败。' + j.message);
        }).catch((error: unknown) => { this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
    },

    /**
     * id 列
     */
    id: { title: '#', width: 60, key: 'id', align: 'center' },

    /**
     * 创建日期
     */
    createDate: {
        title: '创建日期',/*  key: 'createDate', */ width: 160, align: 'center', render(h: Function, params: any) {
            return h('div', dateFormat(params.row.createDate));
        }
    },

    /**
     * 分类标签
     */
    tags: { title: '分类标签', minWidth: 100, key: 'tagsNames', align: 'center', ellipsis: true },

    status: {
        title: '状态', width: 80,
        render(h: Function, params: any) {
            let str: string = '', color: string = '';

            switch (params.row.stat) {
                case -1:
                    str = '草稿';
                    color = 'gray';
                    break;
                case 2:
                    color = 'red';
                    str = '禁用';
                    break;
                case 1:
                    color = 'red';
                    str = '已删除';
                    break
                case null:
                case 0:
                default:
                    color = 'green';
                    str = "启用";
            }

            return h('div', {
                style: {
                    color: color
                }
            }, str);
        }
    },
    getPageList(self: any, listArray: iViewListData, callback?: Function) {
        return (j: ApiResponseResult) => {
            if (j.status) {
                listArray.total = j.data.totalCount as number;
                listArray.data = j.data.list as any[];

                callback && callback();
            } else
                self.$Message.warning(j.message || '获取数据失败');
        }
    },

    copyBeanClean(bean: {}): {} {
        const deepCopy: any = JSON.parse(JSON.stringify(bean));

        delete deepCopy.createDate;
        delete deepCopy.updateDate;
        delete deepCopy.updateDate;
        delete deepCopy.creatorId;
        delete deepCopy.updaterId;
        delete deepCopy.creator;
        delete deepCopy.updater;
        delete deepCopy.extend;

        return deepCopy;
    }
};