<template>
    <div>
        <div class="divblogname">
            <h1> {{Blog.name}}</h1>
        </div>
        <el-divider></el-divider>
        <div class="divacc">
            <span>分类：{{Blog.categoryName}}</span>
        </div>
        <div>
            <p v-html="Blog.content"></p>
        </div>
        <el-divider></el-divider>
        <div class="divacc">
            <span>发布于 {{postDate}} </span>
        </div>
        <div class="divsign">
            <ul>
                <li>作者 ：唐磊</li>
                <li>版权声明：自由转载-非商用-非衍生-保持署名（创意共享3.0许可证）</li>
            </ul>
        </div>

        <div v-show="Comments.length >0">
            <h4>评论列表</h4>
            <el-divider></el-divider>
            <div v-for="(item,index) in Comments" :key="index">
                <div style="font-size: smaller;">
                    <el-button type="text" style="float: right;">回复</el-button>
                    <span># {{item.createDate}}</span>
                    <span>{{item.userName}}</span>
                </div>
                <div v-if="item.parent" style=" margin-top: 10px;">
                    <span style="font-size: smaller;"> @{{item.parent.userName}} {{item.parent.content}}</span>
                </div>
               <a :name="item.id"> <div v-html="item.content" style="color: gray;"></div></a>
                <el-divider></el-divider>
            </div>
        </div>
        <div class="diveditcomment">
            <el-form>
                <div style="margin-top: 20px;margin-bottom: 20px;">
                    <vue-tinymce v-model="CommentParam.content" :setting="Setting" />
                </div>
                <el-button type="primary" style="margin: 20px; float: right;">提交评论</el-button>
            </el-form>
        </div>
    </div>
</template>
<script>
    import { GetBlogByIdRequest } from "../api/api";
    export default {
        data() {
            return {
                Blog: {},
                CommentParam: {},
                Comments: [
                    {
                        id: 1,
                        content: "<html>aa<html>",
                        createDate: "2020-10-10 09:36",
                        userId: 1,
                        userName: "星语心愿"
                    }
                ],
                Setting: {
                    height: 300,
                    menubar: false,
                    plugins: "codesample hr lists emoticons image",
                    toolbar: 'lineheight  undo redo| codesample hr | numlist bullist | styleselect alignleft  alignright | bold italic subscript superscript | formats removeformat newdocument | forecolor backcolor | emoticons image'
                }
            }
        },
        methods: {
            GetOne: function (id) {
                var param = {
                    "id": parseInt(id)
                };
                GetBlogByIdRequest(param).then(res => {
                    if (res.IsSuccess) {
                        this.Blog = res.TModel;
                    }
                    else {
                        Blog = {
                            "name": "无搜索结果"
                        }
                    }
                });
            }
        },
        mounted() {
            var id = this.$route.params.Id;
            this.GetOne(id);
        },
        computed: {
            postDate: function () {
                var createDate = new Date(this.Blog.createDate);
                return `${createDate.getFullYear()}年${createDate.getMonth()}月${createDate.getDate()}日`;
            }
        }
    }
</script>
<style>
    .diveditcomment {
        margin-top: 30px;
    }

    .divblogname h1 {
        text-align: center;
    }

    .divsign {
        background-color: lightgrey;
        color: #606266;
        padding: 20px;
        margin: 20px;
        border-radius: 10px;
    }

    .divsign li {
        margin: 10px;
    }

    .divacc {
        margin-bottom: 10px;
        text-align: right;
    }

    [class*=language-] {
        background: #f5f2f0;
        padding: 10px;
        font-size: 1em;
        border: 1px cornflowerblue solid;
    }
</style>