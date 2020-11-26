<template>
    <div>
        <!-- http://localhost/Openapi/myblog/api/Blog/AddImage -->
        <el-dialog title="上传图片" :visible.sync="UploadPhotoVisible" width="30%" :close-on-click-modal="false">
            <el-upload drag action="" multiple :auto-upload="true" ref="upload" :on-success="UploadSuccess"
                :file-list="FileList" :http-request="UploadSectionFile">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <el-button type="primary" @click="Submit" style="margin-top: 20px;">上传</el-button>
        </el-dialog>

        <div style="margin-bottom: 20px;">
            <el-button type="primary" size="small" @click="GetPhotos">查询</el-button>
            <el-button size="small" @click="UploadPhotoVisible=true">上传</el-button>
        </div>
        <el-col :span="4" v-for="(item, index) in Photos" :key="index">
            <div style="margin-right: 10px; width: 200px; height: 250px;border:lightgray solid 1px ">
                <el-link :underline="false" style="text-align: center;">
                    <img :src="item.path"  style="display: block;width: 100%;max-height: 250px; ">
                </el-link>
            </div>
            <p style="text-align: center;">{{item.name}}</p>
        </el-col>
    </div>
</template>

<script>
    import { GetPhotosRequest,AddImageRequest } from "../../api/api";
    export default {

        data() {
            return {
                Photos: [],
                PhotoAlbum: {

                },
                PhotoCategory: [],
                GetPhotoParam: {
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
                UploadPhotoVisible: false,
                FileList: []
            }
        },
        methods: {
            Submit: function () {
                this.$refs.upload.submit();
            },
            UploadSuccess: function (response, file, fileList) {
                this.$notify({
                    title: '成功',
                    message: '上传成功',
                    type: 'success'
                });
                this.$refs.upload.clearFiles();
            },
            GetPhotos: function () {
                GetPhotosRequest(this.GetPhotoParam).then(res => {
                    if (res.IsSuccess) {
                        this.Photos = res.TModel;
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
                this.UploadFile(param.file);
            },
            UploadFile: function (file) {   // 上传的函数
               var formData = new FormData();
                formData.append("file", file);
                AddImageRequest(formData)
                    .then(res => {
                        if (res.IsSuccess) {
                            this.$notify({
                                title: '成功',
                                message: "新增成功",
                                type: "success"
                            });
                        } else {
                            this.$notify({
                                title: "失败",
                                message: res.Message,
                                type: "error"
                            });
                        }
                    })
            },
        }
    }
</script>

<style>

</style>