<template>
  <div id="app">
    <transition v-if="$route.meta.isLogin">
      <router-view></router-view>
    </transition>
    <transition v-else-if="!$route.meta.isManage">
      <el-row>
        <el-col :span=18 :offset="3">
          <el-container>
            <el-header>
              <el-row>
                <el-col :span="20">
                  <div id="sitehead">
                    <el-link :underline="false" href="/Blogs" style="color: #409EFF;">
                      <p>{{ SiteName }}</p>
                    </el-link>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div id="divSearch">
                    <el-input placeholder="请输入内容" v-model="SearchStr" @keyup.enter.native="GetBlogByName">
                      <i slot="suffix" class="el-icon-search el-input__icon"></i>
                    </el-input>
                  </div>
                </el-col>
              </el-row>
            </el-header>
            <el-divider></el-divider>
            <el-container>
              <el-main>
                <router-view />
              </el-main>
              <el-aside width="300px">
                <div id="divCategroy">
                  <div>
                    <p>文章分类</p>
                  </div>
                  <el-divider></el-divider>
                  <div>
                    <ul v-for="(item,index) in Categorys" :key="index">
                      <li>
                        <el-link @click="GetBlogByCategory(item.id)">{{item.name}}</el-link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div id="divAbout">
                  <div style="margin-left: 5px;">
                    <el-link v-for="(item,index) in Tags" :key="index" :underline="false" @click="GetBlogByTag(item.tagId)">
                      <el-tag size="mini"  style="margin-right: 4px;">{{item.tagName}}
                      </el-tag>
                    </el-link>

                  </div>
                </div>
                <div id="divAbout">
                  <div>
                    <p>关于</p>
                  </div>
                  <el-divider></el-divider>
                  <div>
                    <img src="./assets/code.jpg" width="180px" alt="二维码">
                    <el-link :href="Email">Email: {{Author.email}}</el-link>
                  </div>
                </div>
              </el-aside>
            </el-container>
          </el-container>
        </el-col>
      </el-row>
    </transition>
    <transition v-else>
      <el-container class="manage">
        <el-header class="manage">
          <el-link :underline="false"><img src="./assets/logo.png" width="140px" alt="" srcset=""
              style="margin-top:10px;float:left;"> </el-link>
          <div class="navuser">
            <el-dropdown>
              <span>
                {{User.email}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人资料</el-dropdown-item>
                <el-dropdown-item>
                  <el-link :underline="false" @click="LogOut">退出</el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="navuser">
            <span>
              <router-link to="/Message/CommentMessage" style="text-decoration:none">
                <el-button type="primary" icon="el-icon-message" circle></el-button>
              </router-link>
            </span>
          </div>
          <div class="navuser">
            <router-link to="/help">
              帮助
            </router-link>
          </div>
          <div class="navuser">
            <router-link to="/blogs">
              博客
            </router-link>
          </div>
        </el-header>
        <el-container class="manage">
          <el-aside class="manage" :width="AsideWidth">
            <el-menu :collapse="IsCollapse" :router=true background-color="#262626" text-color="#fff"
              active-text-color="#ffd04b" :unique-opened=true @mouseenter.native="AsideMouseEnterHandle($event)">
              <el-menu-item index="/">
                <i class="el-icon-s-home"></i>
                <span slot="title">首页</span>
              </el-menu-item>
              <el-submenu v-for="(item,index) in Menus" :key="index" :index="index.toString()">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span>{{item.title}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="(subMenu,i) in item.children" :key="i" :index="subMenu.path"><span
                      style="margin-left: 15px;">{{subMenu.title}}</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
            <div style="position:fixed; bottom:0; left:0;">
              <el-link :underline="false" style="font-size: 40px;" @click="CollapseHandle">
                <div style="padding: 5px;"> <i class="el-icon-s-fold"></i></div>
              </el-link>
            </div>
          </el-aside>
          <el-main class="manage" @mouseout.native="AsideMouseOutHandle($event)">
            <div class="divbody">
              <router-view></router-view>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </transition>
  </div>
</template>
<script>

  import { GetCategoryRequest, GetAuthorRequest, GetMenuByEmailRequest, GetAllTagRepquest } from "./api/api";
  import * as signalR from "@aspnet/signalr";
  export default {
    name: 'App',
    data() {
      return {
        IsLogin: 0,
        SiteName: "Jasonbourne`s Blog",
        SearchStr: "",
        Categorys: [
        ],
        Author: {
          name: "唐磊",
          id: 1,
          icon: "./assets/code.png",
          motto: "梦想不大,道路很长,开始了就别停下",
          email: ""
        },
        IsCollapse: false,
        RouteObjs: [],
        Menus: [],
        AlreadyLoadMenu: 0,
        User: {},
        Tags: []
      }
    },
    methods: {
      UserLoginStatus: function () {
        var userStr = localStorage.getItem("userInfo");
        var user = JSON.parse(userStr);
        if (user) {
          this.IsLogin = 1;
          return user.name;
        }
        else {
          this.IsLogin = 0;
          return "未登录";
        }
      },
      RouteToLogin: function () {
        var userStr = localStorage.getItem("userInfo");
        var user = JSON.parse(userStr);
        if (user) {

        }
        else {

          this.$router.push({ path: "/login", query: { redirect: this.$route.path } });
        }
      },
      BlogLogOut: function () {
        window.localStorage.clear();
        location.reload();

      },
      LogOut: function () {
        window.localStorage.clear();
        this.$router.push({ path: "/login", query: { redirect: this.$route.path } });
        location.reload();

      },
      AsideMouseEnterHandle: function (e) {
        // this.IsCollapse = false;
      },
      AsideMouseOutHandle: function (e) {
        //this.IsCollapse = true;
      },
      CollapseHandle: function () {
        this.IsCollapse = !this.IsCollapse;
      },
      GetCatetory: function () {
        GetCategoryRequest().then(res => {
          if (res.IsSuccess) {
            this.Categorys = res.TModel;
          }
        });
      },
      GetTags: function () {
        GetAllTagRepquest().then(res => {
          if (res.IsSuccess) {
            this.Tags = res.TModel;
          }
        });
      },
      GetAuthor: function () {
        GetAuthorRequest({ "id": 1 }).then(res => {
          if (res.IsSuccess) {
            this.Author = res.TModel;
          }
        });
      },
      GetBlogByCategory: function (id) {
        if (this.$route.query.categoryId != id) {
          this.$router.push({ path: "/Blogs", query: { categoryId: id } });
        }
      },
      GetBlogByName: function () {
        if (this.$route.query.name != this.SearchStr) {
          this.$router.push({ path: "/Blogs", query: { name: this.SearchStr } });
        }
      },
      GetBlogByTag: function(tagId){
        if (this.$route.query.tagId != tagId) {
          this.$router.push({ path: "/Blogs", query: { tagId: tagId } });
        }
      },
      StartSignalr: function () {
        var token = window.localStorage.getItem("token");
        token = "Bearer " + token;
        this.connection = new signalR.HubConnectionBuilder()
          .withUrl("http://localhost:5000/CommentHub", {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
            accessTokenFactory: () => token
          })
          .configureLogging(signalR.LogLevel.Information)
          .build();
        this.connection.on("Test", (message) => {
          this.$notify({
            title: '你有一条新的消息',
            message: '评论',
            type: 'success'
          });
        });
        this.connection.start();
      }

    },
    mounted() {
      this.GetCatetory();
      this.GetAuthor();
      this.GetTags();
    },
    computed: {
      Email: function () {
        return 'mailto:' + this.Author.email;
      },
      AsideWidth: function () {
        if (this.IsCollapse) {
          return '65px';
        }
        else {
          return '200px';
        }
      },

    },
    created() {
      if (this.$route.meta.noNeedOAuth === true) {
        return;
      }
      if (this.alreadyLoadMenu != 1) {
        var userInfoStr = localStorage.getItem("userInfo");
        var userInfo = JSON.parse(userInfoStr);
        this.User = userInfo;
        if (userInfo) {
          var params = {
            email: userInfo.email
          };
          GetMenuByEmailRequest(params).then(res => {
            if (res.IsSuccess) {
              this.$notify({
                title: '成功',
                message: '获取菜单权限成功',
                type: 'success'
              });
              var menu = res.TModel;
              if (menu != null && menu.length > 0) {
                menu.filter(x => x.parentId == 0).forEach(item => {
                  var menuObj = {
                    name: item.name,
                    path: item.path,
                    title: item.title,
                    icon: item.icon,
                    children: []
                  };
                  menu.filter(x => x.parentId == item.id).forEach(ea => {
                    var routeObj = {
                      name: ea.name,
                      path: ea.path,
                      component: () => import(`@/view/${ea.fileName}.vue`),
                      meta: {
                        isManage: true,
                        title: ea.title
                      },
                      children: []
                    };
                    menuObj.children.push({
                      name: ea.name,
                      path: ea.path,
                      title: ea.title,
                      icon: ea.icon
                    });
                    menu.filter(x => x.parentId == ea.id).forEach(child => {
                      routeObj.children.push({
                        name: child.name,
                        path: child.path,
                        component: () => import(`@/view/${ea.fileName}/${child.fileName}.vue`),
                        meta: {
                          isManage: true,
                          title: child.title
                        },
                      });
                    });
                    if (routeObj.children.length > 0) {
                      window.localStorage.setItem(routeObj.name, JSON.stringify(routeObj.children))
                    }
                    this.RouteObjs.push(routeObj);

                  });
                  this.Menus.push(menuObj);
                });

                this.$router.addRoutes(this.RouteObjs);

              }
              this.alreadyLoadMenu = 1;
            } else {
              this.$notity({
                title: '失败',
                message: res.Message,
                type: 'error'
              })
            }
          }).catch(
            error => {
            }
          );
          this.StartSignalr();
        }
      };
    },
    watch: {
      '$route'(to, from) {
        if (to.meta.noNeedOAuth === true) {
          return;
        }
        if (this.alreadyLoadMenu != 1) {
          var userInfoStr = localStorage.getItem("userInfo");
          var userInfo = JSON.parse(userInfoStr);
          this.User = userInfo;
          if (userInfo) {
            var params = {
              email: userInfo.email
            };
            GetMenuByEmailRequest(params).then(res => {
              if (res.IsSuccess) {
                this.$notify({
                  title: '成功',
                  message: '获取菜单权限成功',
                  type: 'success'
                });
                var menu = res.TModel;
                if (menu != null && menu.length > 0) {
                  menu.filter(x => x.parentId == 0).forEach(item => {
                    var menuObj = {
                      name: item.name,
                      path: item.path,
                      title: item.title,
                      icon: item.icon,
                      children: []
                    };
                    menu.filter(x => x.parentId == item.id).forEach(ea => {
                      var routeObj = {
                        name: ea.name,
                        path: ea.path,
                        component: () => import(`@/view/${ea.fileName}.vue`),
                        meta: {
                          isManage: true,
                          title: ea.title
                        },
                        children: []
                      };
                      menuObj.children.push({
                        name: ea.name,
                        path: ea.path,
                        title: ea.title,
                        icon: ea.icon
                      });
                      menu.filter(x => x.parentId == ea.id).forEach(child => {
                        routeObj.children.push({
                          name: child.name,
                          path: child.path,
                          component: () => import(`@/view/${ea.fileName}/${child.fileName}.vue`),
                          meta: {
                            isManage: true,
                            title: child.title
                          },
                        });
                      });
                      if (routeObj.children.length > 0) {
                        window.localStorage.setItem(routeObj.name, JSON.stringify(routeObj.children))
                      }
                      this.RouteObjs.push(routeObj);

                    });
                    this.Menus.push(menuObj);
                  });
                  this.$router.addRoutes(this.RouteObjs);

                }

              } else {
                this.$notity({
                  title: '失败',
                  message: res.Message,
                  type: 'error'
                })
              }
            }).catch(
              error => {
              }
            );
            this.alreadyLoadMenu = 1;
          }
        };
      }
    },
  }
</script>

<style>
  #app,
  html,
  body,
  .manage,
  .el-menu {
    height: 100%;
    margin: 0px;
  }

  #sitehead p {
    font-size: xx-large;
    text-align: left;
    margin-top: 0px;
    border: 5px hidden gray;
    padding: 20px 20px 20px 0px;
    font-weight: bolder;
  }

  #divSearch {
    font-size: xx-large;
    text-align: left;
    margin-top: 20px;
    border: 5px hidden gray;
    padding-right: 20px;
    font-weight: bolder;
  }

  #divCategroy,
  #divAbout {
    margin-top: 10px;
    margin-left: 30px;
    margin-right: 30px;
    border: 1px solid gainsboro;
    border-radius: 10px;
    padding: 10px;
  }

  #divCategroy p,
  #divAbout p {
    margin-left: 20px;
  }

  el-link {
    font-size: 20px;
  }

  .navuser {
    float: right;
  }

  .navuser>* {
    float: right;
    margin-right: 20px;
    text-align: center;
    line-height: 60px;
    font-size: 15px;
    color: #FFFFFF;
    text-decoration: none;
  }

  .divbody {
    margin-top: 15px;
  }

  .divpageheader {
    font-weight: bolder;
    font-size: medium;
  }

  .el-header.manage {
    background: #262F3E;
    color: #FFFFFF;
    height: 50px;
  }

  .el-main.manage {
    padding: 5px 20px;
    height: 100%;
  }

  .el-aside.manage {
    background-color: "#262F3E";
  }

  /*解决侧边栏菜单收齐时卡顿问题*/
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out !important;
  }
</style>