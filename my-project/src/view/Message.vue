<template>
    <div>
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" :router=true>
            <el-menu-item index="/Message/CommentMessage">
                博客评论
            </el-menu-item>
            <el-menu-item index="/Message/SystemMessage">
                系统消息
            </el-menu-item>
        </el-menu>
        <div style="margin-top: 40px;">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeIndex: '/Message/CommentMessage'
            };
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        },
        created() {
          console.log(this.$route);
        },
        watch: {
            '$route'(to, from) {
                this.activeIndex = to.path;
            }
        }
    };
</script>

<style>

</style>