<template>
    <div>
        <div style="margin-bottom: 10px;">
            <el-button type="primary" size="small" @click="GetBlogs">查询</el-button>
        </div>
        <div style="margin-bottom: 10px;">
            <el-input placeholder="文章标题" v-model="Name" style="width: 200px;"></el-input>
            <span style="margin: 20px;"></span>
            <el-select v-model="CategoryId" placeholder="分类" :clearable="true">
                <el-option v-for="item in Categorys" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
            <span style="margin: 20px;"></span>
            <el-select v-model="Status" placeholder="发布状态" :clearable="true">
                <el-option v-for="item in PostStatus" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
        </div>
        <el-table :data="Blogs" style="width: 100%" size="large">
            <el-table-column prop="name" label="标题" width="400">
            </el-table-column>
            <el-table-column prop="categoryName" label="分类" width="200">
            </el-table-column>
            <el-table-column :formatter="CreateTime" label="发布日期" width="300">
            </el-table-column>
            <el-table-column :formatter="StatusName" label="发布状态" width="200">
            </el-table-column>
            <el-table-column :formatter="IsTop" label="置顶" width="200">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="text" @click="HandleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="text" @click="HandleShow(scope.$index, scope.row)">查看</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-popconfirm title="确认执行此操作吗" @onConfirm="HandleDelete(scope.$index, scope.row)">
                        <el-button type="text" slot="reference">
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
    import { GetBlogRequest, UpdateBlogRequest, DeleteBlogRequest, GetCategoryRequest } from "../api/api";
    export default {

        data() {
            return {
                Blogs: [],
                RecordCount: 0,
                CategoryId: '',
                Name: "",
                PageIndex: 1,
                Categorys: [],
                PostStatus: [
                    {
                        "id": 0,
                        "name": "未发布"
                    },
                    {
                        "id": 1,
                        "name": "已发布"
                    },
                    {
                        "id": 2,
                        "name": "全部"
                    }
                ],
                Status: 2
            }
        },
        methods: {
            GetCatetory: function () {
                GetCategoryRequest().then(res => {
                    if (res.IsSuccess) {
                        this.Categorys = res.TModel;
                    }
                });
            },
            StatusName: function (row, column) {
                if (row.status == 0) {
                    return "未发布";
                }
                else {
                    return "已发布"
                }
            },
            IsTop: function (row, column) {
                if (row.isTop == 0) {
                    return "否";
                }
                else {
                    return "是"
                }
            },
            CreateTime: function (row, column) {
                var createDate = new Date(row.createDate);
                return this.$utils.ToDateTime(createDate);
            },
            CurrentChange: function (val) {
                this.PageIndex = val;
                this.GetBlogs();
            },
            HandleShow(index, row) {
                this.$router.push({ path: `/Blog/${row.id}` });
            },
            HandleEdit(index, row) {
                this.$router.push({ path: "/EditBlog", query: { id: row.id } });
            },
            HandleDelete(index, row) {
                console.log(index, row);
                DeleteBlogRequest({ id: row.id }).then(res => {
                    if (res.IsSuccess) {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                        this.GetBlogs();
                    }
                    else {
                        this.$notify({
                            title: '失败',
                            message: res.message,
                            type: 'error'
                        });
                    }
                });
            },
            GetBlogs: function () {
                // console.log("category:"+this.CategoryId);
                var param = {
                    "pageIndex": this.PageIndex,
                    "pageSize": 10,
                    "filter": [],
                    "sort": [{
                        "field": "isDel",
                        "value": "asc"
                    }, {
                        "field": "id",
                        "value": "desc"
                    }]
                };
                if (this.CategoryId > 0) {
                    param.filter.push(
                        {
                            "field": "categoryId",
                            "value": this.CategoryId.toString(),
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
                if (this.Status < 2) {
                    param.filter.push(
                        {
                            "field": "status",
                            "value": this.Status.toString(),
                            "operator": "=",
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
            this.GetCatetory();
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