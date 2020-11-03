<template>
    <div>
        <el-table :data="Blogs" style="width: 100%" size="large" :row-class-name="tableRowClassName">
            <el-table-column prop="name" label="标题" width="500">
            </el-table-column>
            <el-table-column prop="createDate" label="发布日期" width="300">
            </el-table-column>
            <el-table-column prop="status" label="发布状态">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-popconfirm title="确认执行此操作吗" @onConfirm="handleDelete(scope.$index, scope.row)">
                        <el-button size="mini" slot="reference">
                            {{scope.row.isDel == 1?"还原":"删除"}}
                        </el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <div style="text-align: left; margin: 20px;">
            <el-pagination background layout="total, prev, pager, next" :hide-on-single-page=true :total="RecordCount"
                :current-page.sync="PageIndex" :small=true :page-size="10" @current-change="CurrentChange">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import { GetBlogRequest } from "../api/api";
    export default {

        data() {
            return {
                Blogs: [],
                RecordCount: 0,
                CategoryId: 0,
                Name: "",
                PageIndex: 1
            }
        },
        methods: {
            tableRowClassName({ row, rowIndex }) {
                if (row.isDel === 1) {
                    return 'warning-row';
                } else if (row.status === 0) {
                    return 'info-row';
                }
                return '';
            },
            CurrentChange: function (val) {
                this.PageIndex = val;
                this.GetBlogs();
            },
            handleEdit(index, row) {
                this.$router.push({path:"/EditBlog",query:{id:row.id}});
            },
            handleDelete(index, row) {
                console.log(index, row);
            },
            GetBlogs: function () {
                var param = {
                    "pageIndex": this.PageIndex,
                    "pageSize": 10,
                    "filter": []
                };
                if (this.CategoryId > 0) {
                    param.filter.push(
                        {
                            "field": "categoryId",
                            "value": this.CategoryId,
                            "operator": "=",
                            "connector": "and"
                        })
                }
                if (this.Name != null && this.Name != undefined && this.Name != '') {
                    param.filter.push(
                        {
                            "field": "name",
                            "value": `%${this.Name}%`,
                            "operator": "like",
                            "connector": "and"
                        })
                }
                GetBlogRequest(param).then(
                    res => {
                        if (res.IsSuccess) {
                            this.Blogs = res.TModel;
                            this.RecordCount = res.RecordCount;
                        }
                    }
                )
            }
        },
        created() {
            this.PageIndex = 1;
            this.CategoryId = this.$route.query.categoryId;
            this.Name = this.$route.query.name;
            this.GetBlogs();
        },
        mounted() {
        },
        watch: {
            '$route'(to, from) {
                this.PageIndex = 1;
                this.CategoryId = this.$route.query.categoryId;
                this.Name = this.$route.query.name;
                this.GetBlogs();
            }
        },
        computed: {

        }
    }
</script>
<style>
    .el-table .warning-row {
        background: #575353;
    }

    .el-table .info-row {
        background: #909399;
    }
</style>