<template>
    <div>
        <el-button type="primary" @click="GetComment">查询</el-button>
        <el-table :data="Comments" style="width: 100%; margin-top: 20px; " size="mini">
            <el-table-column v-for="(item,index) in TableList" :key="index" :label="item.label" :prop="item.prop">
            </el-table-column label="操作" width="200" heigth="100">
            <el-table-column>
                <template slot-scope="scope">
                    <el-button type="text" @click="TurnDetail(scope.row)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="text-align: left; margin: 20px;">
            <el-pagination background layout="total, prev, pager, next" :hide-on-single-page=true :total="RecordCount"
                :current-page.sync="GetCommentParam.PageIndex" :small=true :page-size="10" @current-change="CurrentChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import { GetBlogCommentRequest } from "../../api/api"
    export default {
        data() {
            return {
                GetCommentParam: {
                    "pageIndex": 1,
                    "pageSize": 10,
                    "sort": [
                        {
                            "field": "id",
                            "value": "desc"
                        }
                    ],
                    "filter": []
                },
                TableList: [
                    {
                        label: "博客标题",
                        prop: "blogId"
                    },
                    {
                        label: "备注",
                        prop: "content"
                    }
                ],
                Comments: [],
                RecordCount:0
            }
        },
        computed: {
            Email: function () {
                return 'mailto: 420994592@qq.com';
            }
        },
        methods: {
            CurrentChange: function (val) {
                this.PageIndex = val;
                this.GetComment();
            },
            TurnDetail: function(row){
                this.$router.push(`/blog/${row.blogId}#${row.id}`);
            },
            GetComment: function () {
                GetBlogCommentRequest(this.GetCommentParam).then(res => {
                    if (res.IsSuccess) {
                        this.Comments = res.TModel;
                        this.RecordCount = res.RecordCount;
                        this.$notify({
                            title: '成功',
                            message: "查询成功",
                            type: 'success'
                        });
                    } else {
                        this.$notify({
                            title: '失败',
                            message: res.Message,
                            type: 'error'
                        });
                    }
                });
            }
        }
    };
</script>

<style>

</style>