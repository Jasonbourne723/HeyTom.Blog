<template>
    <div>
        <el-button type="primary" @click="GetRoles"> 查询 </el-button>
        <el-button @click=" Role={}, AddRoleVisible = true"> 新增 </el-button>
        <el-dialog title="编辑角色" :visible.sync="AddRoleVisible" width="30%">
            <div class="divdialog">
                <el-input type="text" placeholder="角色名称" v-model="Role.name"></el-input>
                <el-input type="text" placeholder="角色备注" v-model="Role.remark"></el-input>
                <el-button type="primary" @click="AddRole">确 定</el-button>
                <el-button @click="AddRoleVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="配置菜单权限" :visible.sync="SetMenuPermissionVisible" check-strictly=true width="30%">
            <div style="margin-left:20px;">
                <el-tree :data="MenuTree" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current
                    :props="defaultProps">
                </el-tree>
                <el-button type="primary" @click="SaveMenuPermission"> 设置</el-button>
                <el-button @click="SetMenuPermissionVisible=false">  取消</el-button>
            </div>
        </el-dialog>
        <el-table :data="Roles" style="width: 100%; margin-top: 20px; " size="mini" v-loading="loading">
            <el-table-column v-for="(item,index) in TableList" :key="index" :label="item.label" :prop="item.prop">
            </el-table-column>
            <el-table-column label="操作" width="200" heigth="100">
                <template slot-scope="scope">
                    <el-button type="text" :disabled="scope.row.type == 1"
                        @click="Role= scope.row, AddRoleVisible = true">编辑</el-button>
                    <el-button type="text" :disabled="scope.row.type == 1" @click="AlertSetMenuPermission(scope.row)">
                        配置菜单权限
                    </el-button>
                    <el-popconfirm title="确认执行删除操作吗" @onConfirm="DeleteRole(scope.row)">
                        <el-button type="text" :disabled="scope.row.type == 1" slot="reference">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {
        GetAllRoleRequest, AddRoleRequest,
        RemoveRoleRequest, UpdateRoleRequest,
        GetMenusByRoleRequest, GetAllMenuRequest, SetMenuPermissionsRequest
    } from '../api/api'
    export default {
        data() {
            return {
                TableList: [
                    {
                        label: "角色名称",
                        prop: "name"
                    },
                    {
                        label: "备注",
                        prop: "remark"
                    }
                ],
                Roles: [],
                Role: {

                },
                loading: false,
                AddRoleVisible: false,
                SetMenuPermissionVisible: false,
                MenuTree: [],
                defaultProps: {
                    children: 'children',
                    label: 'title'
                },
                Menus:[],
                RoleId: 0
            }
        },
        methods: {
            SaveMenuPermission: function () {
                var menuIds = this.$refs.tree.getCheckedKeys();
                if (menuIds.length > 0) {
                    SetMenuPermissionsRequest({ roleId: this.RoleId, menuIds: menuIds }).then(res => {
                        if (res.IsSuccess) {
                            this.$notify({
                                title: '成功',
                                message: '设置成功',
                                type: 'success'
                            });
                            this.SetMenuPermissionVisible = false;
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
            },
            AlertSetMenuPermission: function (row) {
                this.SetMenuPermissionVisible = true;
                GetMenusByRoleRequest({ roleId: row.id }).then(res => {
                    this.RoleId = row.id;
                    if (res.IsSuccess) {
                        if (res.TModel != null && res.TModel.length > 0) {
                            this.$nextTick(() => {
                                var checkedKeys = new Array();
                                res.TModel.forEach(ea => {
                                    checkedKeys.push(ea.id);
                                });
                                this.$refs.tree.setCheckedKeys(checkedKeys);
                            });
                        }
                    }
                    else {
                        this.$notify({
                            title: '失败',
                            message: res.Message,
                            type: 'error'
                        });
                    }
                })
            },
            AddRole: function () {
                if (this.Role.id > 0) {
                    UpdateRoleRequest(this.Role).then(res => {
                        if (res.IsSuccess) {
                            this.GetRoles();
                            this.AddRoleVisible = false;
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
                else {
                    AddRoleRequest(this.Role).then(res => {
                        if (res.IsSuccess) {
                            this.GetRoles();
                            this.AddRoleVisible = false;
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
                this.Role = {};
            },
            GetRoles: function () {
                this.loading = true;
                GetAllRoleRequest().then(res => {
                    if (res.IsSuccess) {
                        this.Roles = res.TModel;
                    }
                    else {
                        this.$notify({
                            title: '失败',
                            message: res.Message,
                            type: 'error'
                        });
                    }
                });
                this.loading = false;
            },
            DeleteRole: function (row) {
                RemoveRoleRequest({ roleId: row.id }).then(res => {
                    if (res.IsSuccess) {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                        this.GetRoles();
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
        },
        created() {
            GetAllMenuRequest().then(res => {
                if (res.IsSuccess) {
                    var menu = res.TModel;
                    this.Menus = menu;
                    if (menu != null && menu.length > 0) {
                        menu.filter(x => x.parentId == 0).forEach(item => {
                            var menuObj = {
                                id: item.id,
                                title: item.title,
                                children: []
                            };
                            menu.filter(x => x.parentId == item.id).forEach(ea => {
                                var menuSecond = {
                                    id: ea.id,
                                    title: ea.title,
                                    children: []
                                };
                                menu.filter(x => x.parentId == ea.id).forEach(child => {
                                    menuSecond.children.push({
                                        id: child.id,
                                        title: child.title,
                                    });
                                });
                                menuObj.children.push(menuSecond);
                            });
                            this.MenuTree.push(menuObj);
                        });
                    }
                } else {
                    this.$notify({
                        title: '失败',
                        message: res.Message,
                        type: 'error'
                    });
                }
            });
        }
    }
</script>

<style>

</style>