<template>
    <div>
        <div class="blogitem" v-for="(item,index) in Blogs" :key="index">
            <el-link :underline="false" @click="GetOne(item.id)" style="font-size:20px;color:black">
                {{item.categoryName}}
                {{item.categoryName != null?":":""}} {{item.name}}</el-link>
            <p></p>
            <span> <i class="el-icon-edit"></i> 评论(1) </span>
            <span> <i class="el-icon-reading"></i> 阅读(2)</span>
            <el-divider content-position="right">{{ToDateTime(item.createDate)}}</el-divider>
        </div>
        <div>
            <el-pagination background layout="total, prev, pager, next" :hide-on-single-page=true :total="RecordCount"
                :current-page.sync="PageIndex" :small=true :page-size="PageSize" @current-change="CurrentChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import { GetBlogRequest } from "../api/api";
    export default {
        data() {
            return {
                Blogs: [{
                }],
                RecordCount: 0,
                CategoryId: 0,
                Name: "",
                PageIndex: 1,
                PageSize: 10
            }
        },
        //方法
        methods: {
            ToDateTime: function (createDate) {
                createDate = new Date(createDate);
                return `${createDate.getFullYear()}-${createDate.getMonth()}-${createDate.getDate()}`;
            },
            GetOne: function (id) {
                this.$router.push("Blog/" + id);
            },
            GetBlogs: function () {
                var param = {
                    "pageIndex": this.PageIndex,
                    "pageSize": this.PageSize,
                    "filter": [
                        {
                            "field": "isDel",
                            "value": "0",
                            "operator": "=",
                            "connector": "and"
                        }
                    ],
                    "sort": [
                        {
                            "field": "createDate",
                            "value": "desc"
                        }
                    ],
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
            },
            CurrentChange: function (val) {
                this.PageIndex = val;
                this.GetBlogs();
            }
        },
        //计算属性
        computed: {
            firstBlog: function () {
                return this.Blogs[0];
            }
        },
        mounted() {
            this.PageIndex = 1;
            this.CategoryId = this.$route.query.categoryId;
            this.Name = this.$route.query.name;
            this.GetBlogs();
        },
        watch: {
            '$route'(to, from) {
                console.log("aaaaa");
                this.PageIndex = 1;
                this.CategoryId = this.$route.query.categoryId;
                this.Name = this.$route.query.name;
                this.GetBlogs();
            }
        },
    };
</script>

<style>
</style>