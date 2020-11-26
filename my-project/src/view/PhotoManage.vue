<template>
    <div>
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" :router=true>
            <el-menu-item v-for="(item,index) in children" :key="index" :index="item.path">
                {{item.meta.title}}
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
                activeIndex: '',
                children: []
            };
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        },
        created() {
            var children = window.localStorage.getItem(this.$route.name);
            this.children = JSON.parse(children);
            if (this.children != null && this.children.length > 0) {
                console.log(this.children);
                this.activeIndex = this.children[0].path;
                this.$router.push({ path: this.activeIndex });
            }
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