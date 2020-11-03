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
    </div>
</template>
<script>
    import { GetBlogByIdRequest } from "../api/api";
    export default {
        data() {
            return {
                Blog: {}
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
   .divblogname h1 {
        text-align: center;
    }

    .divsign {
        background-color: lightgrey;
        color: #606266;
        padding: 20px;
        border-radius: 10px;
    }

    .divsign li {
        margin: 10px;
    }

    .divacc{
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