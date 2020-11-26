<template>
    <div>
        <el-form>
            <el-button type="primary" size="small" @click="GetUsers">查询</el-button>
        </el-form>

        <el-table :data=Users style="width: 100%; margin-top: 20px; " size="mini">
            <el-table-column v-for="(item,index) in TableList" :key="index" :label="item.label" :prop="item.prop">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { GetUsersRequest } from '../api/api'
    export default {
        data() {
            return {
                TableList: [
                    {
                        label: "编号",
                        prop: "id"
                    },
                    {
                        label: "昵称",
                        prop: "name"
                    },
                    {
                        label: "邮箱",
                        prop: "email"
                    },
                    {
                        label: "备注",
                        prop: "remark"
                    },
                    {
                        label: "状态",
                        prop: "status"
                    },
                    {
                        label: "注册时间",
                        prop: "createDate"
                    },
                    {
                        label: "头像",
                        prop: "icon"
                    },
                    {
                        label: "角色",
                        prop: "roleName"
                    }
                ],
                Users: [],
                GetUserParams: {
                    "pageIndex": 1,
                    "pageSize": 10,
                    "sort": [],
                    "filter": [],
                    "select": []
                }
            }
        },
        methods: {
            GetUsers: function () {
                GetUsersRequest(this.GetUserParams).then(res => {
                    if (res.IsSuccess) {
                        this.Users = res.TModel;
                    }
                    else {
                        this.$notify({
                            title: '失败',
                            message: res.Message,
                            type: 'error'
                        });
                    }
                });
            }
        }
    }
</script>

<style>

</style>