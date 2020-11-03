import Vue from 'vue'
import Router from 'vue-router'
import Blog from '@/view/Blog'
import Blogs from '@/view/Blogs'
import Login from '@/view/Login'
import Home from '@/view/Home'

Vue.use(Router)

const createRouter = () => new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      meta: {
        isManage: true
      }
    },
    {
      path: "/Blog/:Id",
      name: "Blog",
      component: Blog,
      meta: {
        NoNeedOAuth: true
      }
    },
    {
      path: "/Blogs",
      name: "Blogs",
      component: Blogs,
      meta: {
        NoNeedOAuth: true
      }
    },
    {
      path: "/Login",
      name: "Login",
      component: Login,
      meta: {
        title: "登录",
        isLogin: true,
        NoNeedOAuth: true
      }
    }
  ]
});
const router = createRouter()

router.beforeEach((to, from, next) => {
  if (from.path === "/login") {
    if (from.query) {
      if (from.query.redirect == to.path) {
        next();
      }
      else {
        next({ path: from.query.redirect });
      }
    } else {
      next();
    }
  }
  if (to.meta.NoNeedOAuth != true) {
    if (!window.localStorage.getItem("token")) {
      next({ path: "/login", query: { redirect: to.fullPath } });
    }
    else {
      next();
    }
  }
  else {
    next();
  }
});

export default router;
