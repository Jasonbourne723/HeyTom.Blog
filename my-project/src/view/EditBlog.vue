<template>
    <div>
        <el-input type="text" placeholder="标题" v-model="Blog.name" />
        <div style="margin-top: 20px;margin-bottom: 20px;">
            <vue-tinymce v-model="Blog.content" :setting="Setting" />
        </div>

        <div>
            <p>分类： <el-radio v-model="Blog.categoryId" v-for="(item,index) in Categorys" :key="index" :label="item.id">
                    {{item.name}}</el-radio>
            </p>
        </div>
        <div>
            <span>是否发布： <el-radio v-model="Blog.status" v-for="(item,index) in PostStatus" :key="index" :label="item.id">
                    {{item.name}}</el-radio>
            </span>
            <span style="margin-left: 20px;">是否置顶： <el-radio v-model="Blog.isTop" v-for="(item,index) in IsTop" :key="index" :label="item.id">
                    {{item.name}}</el-radio>
            </span>
        </div>
        <el-button type="primary" size="small"  style="margin-top: 20px;" @click="AddBlog">发布</el-button>
    </div>
</template>

<script>
    import { AddBlogRequest, GetBlogByIdRequest, UpdateBlogRequest, GetCategoryRequest } from "../api/api";
    export default {
        data() {
            return {
                Blog: {
                    id: 0,
                    name: "",
                    content: "",
                    categoryId: "",
                    status: 0,
                    isTop: 0
                },
                Setting: {
                    height: 600,
                    menubar: false,
                    plugins: "codesample hr lists emoticons image preview nonbreaking",
                    toolbar: 'nonbreaking lineheight  undo redo| codesample hr | numlist bullist | styleselect alignleft  alignright | bold italic subscript superscript | formats removeformat newdocument | forecolor backcolor | emoticons image preview',
                    nonbreaking_force_tab: true
                },
                Categorys: [],
                PostStatus: [{
                    id: 0,
                    name: "否"
                }, {
                    id: 1,
                    name: "是"
                }],
                IsTop: [
                    {
                        id: 0,
                        name: "否"
                    }, {
                        id: 1,
                        name: "是"
                    }
                ]
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
            AddBlog: function () {
                if (this.Blog.id > 0) {
                    UpdateBlogRequest(this.Blog).then(res => {
                        if (res.IsSuccess) {
                            this.$notify({
                                title: '成功',
                                message: '修改成功',
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
                else {
                    AddBlogRequest(this.Blog).then(res => {
                        if (res.IsSuccess) {
                            this.$notify({
                                title: '成功',
                                message: '发布成功',
                                type: 'success'
                            });
                            this.$router.push("/blogmanage");
                        } else {
                            this.$notify({
                                title: '失败',
                                message: res.Message,
                                type: 'error'
                            });
                        }
                    });
                }
            },
            GetOne: function (id) {
                var param = {
                    "id": parseInt(id)
                };
                GetBlogByIdRequest(param).then(res => {
                    if (res.IsSuccess) {
                        this.Blog = res.TModel;
                    }
                    else {

                    }
                });
            }
        },
        created() {
            if (this.$route.query.id) {
                this.GetOne(this.$route.query.id);
            }
            this.GetCatetory();
        }
    }
</script>
<style></style>