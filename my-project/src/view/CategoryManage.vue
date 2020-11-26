<template>
    <div>
        <el-button type="primary" size="small" @click="
        AddOrUpdate=0,Categroy={}, AddCategoryVisible=true">
            新增
        </el-button>
        <el-dialog :title="CategroyOperateType" :visible.sync="AddCategoryVisible" width="30%" :close-on-click-modal="false">
            <el-input type="text" placeholder="名称" v-model="Categroy.name"></el-input>
            <div style="margin: 20px 0;"></div>
            <el-input type="textarea" placeholder="备注" v-model="Categroy.remark"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="AddCateGroy">确 定</el-button>
                <el-button @click="AddCategoryVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-table :data="Categorys" style="width: 100%; margin-top: 20px; " size="mini" v-loading="loading">
            <el-table-column prop="name" label="名称" width="500">
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="300">
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-popconfirm title="确认执行删除操作吗" @onConfirm="handleDelete(scope.$index, scope.row)">
                        <el-button type="text" slot="reference">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import { GetCategoryRequest, AddCategoryRequest, DeleteCategoryRequest, UpdateCategoryRequest } from '../api/api';
    export default {
        data() {
            return {
                loading: true,
                Categorys: [],
                AddCategoryVisible: false,
                Categroy: {
                    name: "",
                    remark: "",
                    id: 0,
                },
                AddOrUpdate: 0
            }
        },
        methods: {
            GetCatetory: function () {
                GetCategoryRequest().then(res => {
                    if (res.IsSuccess) {
                        this.Categorys = res.TModel;
                        this.loading = false;
                    }
                });
            },
            AddCateGroy: function () {
                if (this.AddOrUpdate == 0) {
                    AddCategoryRequest(this.Categroy).then(res => {
                        if (res.IsSuccess) {
                            this.$notify({
                                title: '成功',
                                message: '新增成功',
                                type: 'success'
                            });
                            this.AddCategoryVisible = false;
                            this.GetCatetory();
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
                    UpdateCategoryRequest(this.Categroy).then(res => {
                        if (res.IsSuccess) {
                            this.$notify({
                                title: '成功',
                                message: '修改成功',
                                type: 'success'
                            });
                            this.AddCategoryVisible = false;
                            this.GetCatetory();
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
            handleDelete: function (index, row) {
                DeleteCategoryRequest({ "id": parseInt(row.id) }).then(res => {
                    if (res.IsSuccess) {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                    }
                    else {
                        this.$notify({
                            title: '失败',
                            message: res.message,
                            type: 'error'
                        });
                    }
                });
                this.GetCatetory();
            },
            handleEdit: function (index, row) {
                this.Categroy = row;
                this.AddOrUpdate = 1;
                this.AddCategoryVisible = true
            }
        },
        created() {
            this.GetCatetory();
        },
        computed: {
            CategroyOperateType: function () {
                return this.AddOrUpdate == 0 ? "新增" : "编辑";
            }
        }
    }
</script>
<style>

</style>