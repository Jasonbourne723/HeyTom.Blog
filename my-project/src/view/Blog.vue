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

        <div v-show="Comments && Comments.length > 0">
            <h4>评论列表</h4>
            <el-divider></el-divider>
            <div v-for="(item,index) in Comments" :key="index">
                <div style="font-size: smaller;">
                    <el-button type="text" style="float: right;" @click="ReplyComment(item)"> 回复</el-button>
                    <span># {{ToDateTime(item.createDate)}}</span>
                    <span>{{item.userName}}</span>
                </div>
                <!-- <div v-if="item.backId > 0" style=" margin-top: 10px;">
                    <span style="font-size: smaller;">
                        <el-link :underline=false type="primary">@ {{item.backuserName}}</el-link>
                    </span>
                </div> -->
                <a :name="item.id">
                    <div v-html="item.content" style="color: gray;"></div>
                </a>
                <el-divider></el-divider>
            </div>
            <div style="text-align: left; margin: 20px;">
                <el-pagination background layout="total, prev, pager, next" :hide-on-single-page=true
                    :total="CommentCount" :current-page.sync="GetBlogCommentsParam.pageIndex" :small=true :page-size="5"
                    @current-change="CurrentChange">
                </el-pagination>
            </div>
        </div>
        <div class="diveditcomment" id="test">
            <el-form>
                <div style="margin-top: 20px;margin-bottom: 20px;">
                    <vue-tinymce v-model="CommentContent" :setting="Setting" ref="editcomment" />
                </div>
                <el-button type="primary" style="margin: 20px; float: right;" @click="AddBlogComment()">提交评论
                </el-button>
            </el-form>
        </div>
    </div>
</template>
<script>
    import { GetBlogByIdRequest, GetBlogCommentRequest, AddBlogCommentRequest, RemoveBlogCommentRequest } from "../api/api";
    export default {
        data() {
            return {
                Blog: {},
                CommentContent: "",
                CommentCount: 0,
                GetBlogCommentsParam: {
                    "pageIndex": 1,
                    "pageSize": 5,
                    "sort": [
                        {
                            "field": "createDate",
                            "value": "desc"
                        }
                    ],
                    "filter": []
                },
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
                },
                AddCommentParam: {
                    "blogId": 0,
                    "backId": 0,
                    "content": "",
                    "userId": 0,
                    "userName": "",
                    "backuserId": 0,
                    "backuserName": ""
                }
            }
        },
        methods: {
            ReplyComment: function (item) {
                this.CommentContent = `<a style="color:blue;">@${item.userName}</a>`;
                this.AddCommentParam.backId = item.id;
                this.AddCommentParam.backuserId = item.userId;
                this.AddCommentParam.backuserName = item.userName;
                document.getElementById("test").scrollIntoView(true);
            },
            ToDateTime: function (createDate) {
                createDate = new Date(createDate);
                return this.$utils.ToDateTime(createDate);
            },
            CurrentChange: function (val) {
                this.GetBlogCommentsParam.pageIndex = val;
                this.GetBlogComments(0);
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
                        Blog = {
                            "name": "无搜索结果"
                        }
                    }
                });
            },
            GetBlogComments: function (id) {
                if (id > 0) {
                    this.GetBlogCommentsParam.filter = [{
                        "field": "blogId",
                        "value": id,
                        "operator": "=",
                        "connector": "and"
                    }]
                }
                GetBlogCommentRequest(this.GetBlogCommentsParam).then(res => {
                    if (res.IsSuccess) {
                        this.Comments = res.TModel;
                        this.CommentCount = res.RecordCount;
                    }
                });
            },
            AddBlogComment: function () {

                var userInfoStr = localStorage.getItem("userInfo");
                var userInfo = JSON.parse(userInfoStr);
                if (userInfo == null) {
                    this.$notify({
                        title: '失败',
                        message: "评论需要先点击右上角登录",
                        type: 'error'
                    });
                }
                var param = {
                    "blogId": this.Blog.id,
                    "backId": 0,
                    "content": this.CommentContent,
                    "userId": userInfo.id,
                    "userName": userInfo.name,
                    "backuserId": 0,
                    "backuserName": ""
                };
                param.backId = this.AddCommentParam.backId;
                param.backuserId = this.AddCommentParam.backuserId;
                param.backuserName = this.AddCommentParam.backuserName;

                AddBlogCommentRequest(param).then(res => {
                    if (res.IsSuccess) {
                        this.$notify({
                            title: '成功',
                            message: '新增成功',
                            type: 'success'
                        });
                        this.GetBlogComments(0);
                    }
                    else {
                        this.$notify({
                            title: '失败',
                            message: res.message,
                            type: 'error'
                        });
                    }
                });

                this.AddCommentParam = {
                    "blogId": 0,
                    "backId": 0,
                    "content": "",
                    "userId": 0,
                    "userName": "",
                    "backuserId": 0,
                    "backuserName": ""
                };

            }
        },
        mounted() {
            var id = this.$route.params.Id;
            this.GetOne(id);
            this.GetBlogComments(id.toString());
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