<template>
    <div>
        <!-- <el-upload drag action="http://localhost/Openapi/myblog/api/Blog/AddImage" multiple :auto-upload="true"
            :before-upload="beforeUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload> -->

        <div style="margin-bottom: 20px;">
            <el-button type="primary" size="small"  @click="GetPhotoAlbums">查询</el-button>
            <el-button  size="small"  @click="AddPhotoAlbumVisible=true">新增</el-button>
        </div>
        <el-row>
            <el-col :span="4" v-for="(item, index) in PhotoAlbums" :key="index">
                <el-card :body-style="{ padding: '0px' }" style="margin: 20px; width: 200px;height: 250px;">
                    <el-link :underline="false" > <img :src="item.img" :fit="contain" style="display: block;height: 200px;"  alt="封面"></el-link>
                    <div style="padding: 14px;">
                        <span>{{item.name}}</span> <span style="text-align: right;">  <el-button type="text">编辑</el-button> </span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog title="新增相册" :visible.sync="AddPhotoAlbumVisible" width="30%" :close-on-click-modal="false">
            <el-input type="text" placeholder="相册名称" v-model="PhotoAlbum.name" style="margin-bottom: 20px;"></el-input>
            <el-input type="textarea" placeholder="相册描述" v-model="PhotoAlbum.description" style="margin-bottom: 20px;">
            </el-input>
            <el-select v-model="PhotoAlbum.categoryId" placeholder="分类" :clearable="true" style="margin-bottom: 20px;">
                <el-option v-for="item in PhotoCategory" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
            <br />
            <el-button type="primary" @click="AddPhotoAlbum">确 定</el-button>
            <el-button @click="AddPhotoAlbumVisible = false">取 消</el-button>
        </el-dialog>

    </div>
</template>

<script>
    import { GetPhotoAlbumsRequest, GetPhotoAlbumRequest, AddPhotoAlbumRequest, UpdatePhotoAlbumRequest, DeletePhotoAlbumRequest } from "../../api/api";
    export default {

        data() {
            return {
                PhotoAlbums: [],
                PhotoAlbum: {

                },
                PhotoCategory: [],
                GetPhotoAlbumsParam: {
                    "pageIndex": 1,
                    "pageSize": 10,
                    "sort": [
                        {
                            "field": "createDate",
                            "value": "desc"
                        }
                    ],
                    "filter": []
                },
                AddPhotoAlbumVisible: false
            }
        },
        methods: {

            AddPhotoAlbum: function(){
                AddPhotoAlbumRequest(this.PhotoAlbum).then(res=>{
                    if (res.IsSuccess) {
                        this.AddPhotoAlbumVisible = false;
                        this.$notify({
                            title:'成功',
                            message:"新增成功",
                            type:"success"
                        });
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
            GetPhotoAlbums: function () {
                GetPhotoAlbumsRequest(this.GetPhotoAlbumsParam).then(res => {
                    if (res.IsSuccess) {
                        this.PhotoAlbums = res.TModel;
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


            beforeUpload: function (file) {
                console.log(file);
            },

            UploadSectionFile: function (param) {//创建临时的路径来展示图片
                console.log(param);
                console.log(JSON.stringify(param.file));
                AddImageRequest({
                    "file": param.file
                }).then(res => {
                    if (res.IsSuccess) {

                    }
                    else {

                    }
                })
            }
        }
    }
</script>

<style>

</style>