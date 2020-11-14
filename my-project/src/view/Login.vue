<template>
    <div class="wrapper">
        <el-form status-icon class="login-container">
            <h3 class="title">{{logintitle}}</h3>
            <el-form-item>
                <el-input type="text" v-model="loginparam.email" auto-complete="off" placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input type="password" v-model="loginparam.password" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="LoginAccount">登录</el-button>
                <el-button type="success" @click="RegisterVisible=true" style="margin-left:50px">
                    注册
                </el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="LoginByGitHub" style="width:160px;">
                    <i class="el-icon-key"></i>
                    github登录
                </el-button>
                <el-button type="success" style="width:160px;">
                    <i class="el-icon-key"></i>
                    微信登录
                </el-button>
            </el-form-item>
        </el-form>

        <el-dialog title="注册" :visible.sync="RegisterVisible" width="40%" style="margin-left: 30%;">
            <el-form>
                <el-input type="text" placeholder="邮箱" v-model="RegisterInfo.email"></el-input>
                <el-form-item>
                    <el-input type="text" placeholder="验证码" v-model="RegisterInfo.verificationCode"></el-input>
                    <el-button @click=" SendVerificationCode" :disabled="CanSendCode">点击发送</el-button>
                </el-form-item>

                <el-input type="text" placeholder="昵称" v-model="RegisterInfo.nickName"></el-input>
                <el-input type="password" placeholder="密码" v-model="RegisterInfo.password"></el-input>
                <el-button type="primary" @click="Register">确 定</el-button>
                <el-button @click="RegisterVisible = false">取 消</el-button>
            </el-form>
        </el-dialog>

        </el-dialog>
    </div>
</template>
<script>
    import { LoginRequest, GetUserInfoRequest, RegisterRequest, SendVerificationCodeRequest } from "../api/api";
    export default {
        data() {
            return {
                CanSendCode: false,
                RegisterVisible: false,
                RegisterInfo: {
                    "email": "",
                    "password": "",
                    "nickName": "",
                    "verificationCode": ""
                },
                logintitle: "系统登录",
                loginparam: {
                    email: "",
                    password: ""
                }
            };
        },
        methods: {
            SendVerificationCode: function () {
                this.CanSendCode = true;
                SendVerificationCodeRequest({ email: this.RegisterInfo.email }).then(res => {
                    if (res.IsSuccess) {
                        this.$notify({
                            type: "success",
                            message: `验证码发送成功`,
                        });
                    } else {
                        this.$message.error({
                            message: res.Message
                        });
                        this.CanSendCode = false;
                    }
                });
            },
            Register: function () {
                RegisterRequest(this.RegisterInfo).then(res => {
                    if (res.IsSuccess) {
                        this.RegisterVisible = false;
                        this.$notify({
                            type: "success",
                            message: `注册成功`,
                        });
                        this.loginparam.email = this.RegisterInfo.email;
                        this.loginparam.password = this.RegisterInfo.password;
                        LoginAccount();
                    } else {

                        this.$message.error({
                            message: res.Message
                        });
                    }

                })
            },
            LoginAccount() {
                var loginparam1 = {
                    email: this.loginparam.email,
                    password: this.loginparam.password
                };
                LoginRequest(loginparam1)
                    .then(
                        function (res) {
                            if (res.IsSuccess) {
                                window.localStorage.setItem("token", res.TModel.token);
                                this.$notify({
                                    type: "success",
                                    message: `成功获取令牌，项目初始化中...`,
                                    duration: 2000
                                });
                                this.GetUserInfo();
                            } else {
                                this.$message.error({
                                    message: "用户名或密码错误"
                                });
                            }
                        }.bind(this)
                    )
                    .catch(
                        function () {
                            this.$notify.error({
                                title: "错误",
                                message: "无法连接服务器"
                            });
                        }.bind(this)
                    );
            },
            GetUserInfo() {
                GetUserInfoRequest()
                    .then(
                        function (res) {
                            if (res.IsSuccess) {
                                this.$notify({
                                    type: "success",
                                    message: `获取用户信息成功`,
                                    duration: 2000
                                });
                                var userInfoStr = JSON.stringify(res.TModel);
                                window.localStorage.setItem("userInfo", userInfoStr);
                                this.$router.push("/");
                            }
                            else {
                                this.$notify.error({
                                    title: "错误",
                                    message: res.Message
                                });
                            }
                        }.bind(this)
                    )
                    .catch(
                        function (err) {
                            if (err.response) {
                                this.$message({
                                    message: "获取用户信息失败",
                                    type: "error"
                                });
                            }
                        }.bind(this)
                    );
            },
            LoginByGitHub() {
                window.location.href =
                    "https://github.com/login/oauth/authorize?client_id=f1f3420ef57e2d2a089d&redirect_uri=http://localhost:8080/githubcallback";
            }
        }
    };
</script>
<style>
    .wrapper {
        /* background: #50a3a2;
    background: -webkit-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
    background: linear-gradient(to bottom right, #127c7b 0, #50a3a2); */
        background-image: url(../assets/Login.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        opacity: 0.8;
        position: absolute;
        left: 0;
        width: 100%;
        height: 100%;
        /* overflow: hidden; */
    }

    .login-container {
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin-top: 100px;
        margin-left: 100px;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        z-index: 9999;
        position: relative;
    }

    .login-container .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }
</style>