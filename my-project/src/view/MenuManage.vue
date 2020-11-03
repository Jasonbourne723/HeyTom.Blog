<template>
    <div>
        <el-button type="primary" @click="AddMainMenuVisible=true">
            新增主菜单
        </el-button>

        <el-dialog title="新增主菜单" :visible.sync="AddMainMenuVisible" width="30%">
            <div class="divdialog">
                <el-input type="text" placeholder="菜单名称" v-model="MainMenu.title"></el-input>
                <el-input type="text" placeholder="菜单图标" v-model="MainMenu.icon"></el-input>
                <el-button type="primary" @click="AddMainMenu">确 定</el-button>
                <el-button @click="AddMainMenuVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="IsAddMenu?'新增子菜单':'编辑子菜单'" :visible.sync="AddSubMenuVisible" width="30%">
            <div class="divdialog">
                <el-input type="text" placeholder="菜单名称" v-model="SubMenu.title"></el-input>
                <el-input type="text" placeholder="路由路径" v-model="SubMenu.path"></el-input>
                <el-input type="text" placeholder="路由名称" v-model="SubMenu.name"></el-input>
                <el-input type="text" placeholder="文件名称" v-model="SubMenu.fileName"></el-input>
                <el-input type="text" placeholder="菜单图标" v-model="SubMenu.icon"></el-input>
                <p>图标需从<el-link type="primary" href="https://element.eleme.cn/#/zh-CN/component/icon"  target="_blank">element官方完档
                    </el-link> 中获取，eg：el-icon-platform-eleme</p>
                <div style="margin: 20px;"></div>
                <el-button type="primary" @click="AddSubMenu()">确 定</el-button>
                <el-button @click="AddSubMenuVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-table :data="TableData" row-key="id" style="width: 100%;margin-top: 20px;"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column v-for="(item,index) in TableList" :key="index" :label="item.label" :prop="item.prop">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click="AddSubMenuVisible=true,IsAddMenu=false,SubMenu=scope.row" type="text">编辑
                    </el-button>
                    <el-button @click="AddSubMenuVisible=true,IsAddMenu=true,SubMenu.parentId=scope.row.id"
                        v-show="scope.row.floor<2" type="text">新增子菜单
                    </el-button>
                    <el-popconfirm title="确认执行删除操作吗" @onConfirm="DeleteMenu(scope.row)">
                        <el-button type="text" slot="reference">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { GetAllMenuRequest, AddMainMenuRequest, RemoveMainMenuRequest, UpdateMainMenuRequest } from "../api/api"
    import { AddSubMenuRequest, RemoveSubMenuRequest, UpdateSubMenuRequest } from "../api/api"
    export default {
        data() {
            return {
                hasChild: true,
                TableList: [
                    {
                        label: "菜单名称",
                        prop: "title"
                    },
                    {
                        label: "路由名称",
                        prop: "name"
                    },
                    {
                        label: "路由路径",
                        prop: "path"
                    },
                    {
                        label: "文件名",
                        prop: "fileName"
                    },
                    {
                        label: "菜单图标",
                        prop: "icon"
                    }
                ],
                TableData: [],
                MainMenu: {
                    "title": "",
                    "icon": ""
                },
                SubMenu: {
                    "id": 0,
                    "name": "",
                    "path": "",
                    "title": "",
                    "fileName": "",
                    "parentId": 0,
                    "icon": ""
                },
                AddMainMenuVisible: false,
                AddSubMenuVisible: false,
                IsAddMenu: true
            };
        },
        methods: {
            AddSubMenu: function () {
                if (this.IsAddMenu) {
                    AddSubMenuRequest(this.SubMenu).then(res => {
                        if (res.IsSuccess) {
                            this.AddSubMenuVisible = false;
                            this.$notify({
                                title: '成功',
                                message: '新增成功',
                                type: 'success'
                            });
                            this.SubMenu = {};
                            this.GetMenus();
                        }
                        else {
                            this.$notify({
                                title: '失败',
                                message: res.Message,
                                type: 'error'
                            });
                        }
                    });
                } else {
                    if (this.SubMenu.floor == 0) {
                        UpdateMainMenuRequest(this.SubMenu).then(res => {
                            if (res.IsSuccess) {
                                this.AddSubMenuVisible = false;
                                this.$notify({
                                    title: '成功',
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.SubMenu = {};
                                this.GetMenus();
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
                        UpdateSubMenuRequest(this.SubMenu).then(res => {
                            if (res.IsSuccess) {
                                this.AddSubMenuVisible = false;
                                this.$notify({
                                    title: '成功',
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.SubMenu = {};
                                this.GetMenus();
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
            },
            DeleteMenu: function (row) {
                var params = {
                    "id": row.id
                };
                if (row.floor == 0) {
                    RemoveMainMenuRequest(params).then(res => {
                        if (res.IsSuccess) {
                            this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success'
                            });
                            this.GetMenus();
                        }
                        else {
                            this.$notify({
                                title: '失败',
                                message: res.Message,
                                type: 'error'
                            });
                        }
                    });
                } else {
                    RemoveSubMenuRequest(params).then(res => {
                        if (res.IsSuccess) {
                            this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success'
                            });
                            this.GetMenus();
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
            AddMainMenu: function () {
                AddMainMenuRequest(this.MainMenu).then(res => {
                    if (res.IsSuccess) {
                        this.AddMainMenuVisible = false;
                        this.$notify({
                            title: '成功',
                            message: '新增成功',
                            type: 'success'
                        });
                        this.GetMenus();
                    }
                    else {
                        this.$notify({
                            title: '失败',
                            message: res.Message,
                            type: 'error'
                        });
                    }
                });
            },
            GetMenus: function () {
                GetAllMenuRequest().then(res => {
                    if (res.IsSuccess) {
                        this.Menus = res.TModel;
                        var mainMenus = this.Menus.filter(item => item.parentId == 0);
                        mainMenus.forEach(mainMenu => {
                            mainMenu.floor = 0;
                            var firstMenus = this.Menus.filter(x => x.parentId == mainMenu.id);
                            firstMenus.forEach(subMenu => {
                                var secondMenu = this.Menus.filter(x => x.parentId == subMenu.id);
                                subMenu.floor = 1;
                                subMenu['children'] = secondMenu;
                            })
                            mainMenu['children'] = firstMenus;
                        });
                        this.TableData = mainMenus;
                    }
                    else {
                        this.$notity({
                            title: '失败',
                            message: res.Message,
                            type: 'error'
                        })
                    }
                }).catch(
                    error=>{
                        console.log(error);
                    }
                );
            }
        },
        created() {
            this.GetMenus();
        }
    };

</script>

<style>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .divdialog {
        margin: 10px;
    }
    .divdialog input,.divdialog p {
        margin: 10px;
    }
</style>