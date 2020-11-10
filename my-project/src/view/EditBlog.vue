<template>
    <div>
        <el-input type="text" placeholder="标题" v-model="Blog.name" />
        <div style="margin-top: 20px;margin-bottom: 20px;">
            <vue-tinymce v-model="Blog.content" :setting="Setting" />
        </div>

      <div>
          <p>分类： <el-radio v-model="Blog.categoryId"  v-for="(item,index) in Categorys" :key="index" :label="item.id">{{item.name}}</el-radio></p> 
      </div>
        <!-- <el-select v-model="Blog.categoryId" filterable placeholder="请选择" :clearable="true">
            <el-option v-for="item in Categorys" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
        </el-select> -->
        <el-button type="primary" @click="AddBlog">发布</el-button>
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
                    categoryId: ""
                },
                Setting: {
                    height: 600,
                    menubar: false,
                    plugins: "codesample hr lists emoticons image",
                    toolbar: 'lineheight  undo redo| codesample hr | numlist bullist | styleselect alignleft  alignright | bold italic subscript superscript | formats removeformat newdocument | forecolor backcolor | emoticons image'
                },
                Categorys: []
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