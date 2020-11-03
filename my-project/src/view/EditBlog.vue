<template>
    <div>
        <el-input type="text" placeholder="标题" v-model="Blog.name" />
        <div style="margin-top: 20px;margin-bottom: 20px;">
            <vue-tinymce v-model="Blog.content" :setting="Setting" />
        </div>
        <el-button type="primary" @click="AddBlog">发布</el-button>
        <el-button  plain>保存</el-button>
        <el-button  plain>取消</el-button>
    </div>
</template>

<script>
    import { AddBlogRequest,GetBlogByIdRequest } from "../api/api";
    export default {
        data() {
            return {
                Blog: {
                    id : 0,
                    name: "",
                    content: ""
                },
                Setting: {
                    height: 500,
                    menubar: false,
                    plugins: "codesample hr lists emoticons image",
                    toolbar: 'lineheight  undo redo| codesample hr | numlist bullist | styleselect alignleft  alignright | bold italic subscript superscript | formats removeformat newdocument | forecolor backcolor | emoticons image'
                }
            }
        },
        methods: {
            AddBlog: function () {
                if(this.Blog.id > 0)
                {


                }
                else
                {
                    AddBlogRequest(this.Blog).then(res => {
                    if (res.IsSuccess) {
                        this.$notify({
                            title: '成功',
                            message: '新增成功',
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
        created () {
           if( this.$route.query.id)
           {
                this.GetOne(this.$route.query.id);
           }
        }
    }
</script>
<style ></style>