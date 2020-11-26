import axios from 'axios'
import myVue from '../main.js'

axios.defaults.timeout = 20000

axios.interceptors.request.use(
    config => {
        var token = window.localStorage.getItem("token");
        config.headers.Authorization = "Bearer " + token;
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    // 下面列举几个常见的操作，其他需求可自行扩展
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。
                case 401:
                    myVue.$options.Notification({
                        title: '失败',
                        message: "无权限访问",
                        type: 'error'
                    });
                    myVue.$router.push({ path: "/login", query: { redirect: myVue.$route.path } });
                    break;
                default:
                    myVue.$options.Notification({
                        title: '失败',
                        message: "无法连接服务器",
                        type: 'error'
                    });
            }
            return Promise.reject(error.response);
        }
    }
);

export const BaseApiUrl = "http://localhost";

export const BlogApiUrl = `${BaseApiUrl}/OpenApi/myBlog`;
export const ManageApiUrl = `${BaseApiUrl}/OpenApi/Manage`;
export const OAuthUrl = `${BaseApiUrl}/OpenApi/OAuth`;
export const ResourcesUrl = `${BaseApiUrl}/OpenApi/Resources`;


//login
export const LoginRequest = params => {
    return axios.get(`${OAuthUrl}/api/Login`, { params: params }).then(res => res.data);
};

export const GetUserInfoRequest = params => {
    return axios.post(`${OAuthUrl}/api/Login/GetUserInfo`, params).then(res => res.data);
}

// export const githubCallBack = params=>{
//     return axios.get(`${BaseApiUrl}/api/Login/GitHubCallBcak`,{params: params}).then(res=>res.data);
// }

export const SendVerificationCodeRequest = params => {
    return axios.post(`${OAuthUrl}/api/Register/VerificationCode`, params).then(res => res.data);
}

export const RegisterRequest = params => {
    return axios.post(`${OAuthUrl}/api/Register`, params).then(res => res.data);
}

//blog
export const GetBlogRequest = params => {
    return axios.post(`${BlogApiUrl}/api/blog/list`, params).then(res => res.data);
}

export const GetBlogByIdRequest = params => {
    return axios.post(`${BlogApiUrl}/api/blog/getone`, params).then(res => res.data);
}

export const AddBlogRequest = params => {
    return axios.post(`${BlogApiUrl}/api/blog/add`, params).then(res => res.data);
}

export const UpdateBlogRequest = params => {
    return axios.post(`${BlogApiUrl}/api/blog/update`, params).then(res => res.data);
}

export const DeleteBlogRequest = params => {
    return axios.post(`${BlogApiUrl}/api/blog/remove`, params).then(res => res.data);
}

export const GetAuthorRequest = params => {
    return axios.post(`${BlogApiUrl}/api/Author/GetOne`, params).then(res => res.data);
}

export const GetBlogCommentRequest = params => {
    return axios.post(`${BlogApiUrl}/api/BlogComment/List`, params).then(res => res.data);
}
export const AddBlogCommentRequest = params => {
    return axios.post(`${BlogApiUrl}/api/BlogComment/Add`, params).then(res => res.data);
}
export const RemoveBlogCommentRequest = params => {
    return axios.post(`${BlogApiUrl}/api/BlogComment/Remove`, params).then(res => res.data);
}

//category
export const GetCategoryRequest = () => {
    return axios.post(`${BlogApiUrl}/api/Category/GetAll`, {}).then(res => res.data);
}

export const AddCategoryRequest = params => {
    return axios.post(`${BlogApiUrl}/api/Category/Add`, params).then(res => res.data);
}
export const DeleteCategoryRequest = params => {
    return axios.post(`${BlogApiUrl}/api/Category/Remove`, params).then(res => res.data);
}

export const UpdateCategoryRequest = params => {
    return axios.post(`${BlogApiUrl}/api/Category/Update`, params).then(res => res.data);
}

export const GetAllTagRepquest = params => {
    return axios.post(`${BlogApiUrl}/api/tag/GetAll`, params).then(res => res.data);
}

//menumanage
export const GetAllMenuRequest = () => {
    return axios.post(`${ManageApiUrl}/api/Menu/GetAllMenu`, {}).then(res => res.data);
}

export const GetMenuByEmailRequest = params => {
    return axios.post(`${ManageApiUrl}/api/Menu/GetByEmail`, params).then(res => res.data);
}

export const AddMainMenuRequest = params => {
    return axios.post(`${ManageApiUrl}/api/Menu/AddMainMenu`, params).then(res => res.data);
}

export const RemoveMainMenuRequest = params => {
    return axios.post(`${ManageApiUrl}/api/Menu/RemoveMainMenu`, params).then(res => res.data);
}

export const UpdateMainMenuRequest = params => {
    return axios.post(`${ManageApiUrl}/api/Menu/UpdateMainMenu`, params).then(res => res.data);
}

export const AddSubMenuRequest = params => {
    return axios.post(`${ManageApiUrl}/api/Menu/AddSubMenu`, params).then(res => res.data);
}

export const RemoveSubMenuRequest = params => {
    return axios.post(`${ManageApiUrl}/api/Menu/RemoveSubMenu`, params).then(res => res.data);
}

export const UpdateSubMenuRequest = params => {
    return axios.post(`${ManageApiUrl}/api/Menu/UpdateSubMenu`, params).then(res => res.data);
}


// role 
export const GetAllRoleRequest = () => {
    return axios.post(`${ManageApiUrl}/api/Role/GetAll`, {}).then(res => res.data);
}

export const AddRoleRequest = params => {
    return axios.post(`${ManageApiUrl}/api/Role/Add`, params).then(res => res.data);
}

export const RemoveRoleRequest = params => {
    return axios.post(`${ManageApiUrl}/api/Role/Remove`, params).then(res => res.data);
}

export const UpdateRoleRequest = params => {
    return axios.post(`${ManageApiUrl}/api/Role/Update`, params).then(res => res.data);
}

export const GetMenusByRoleRequest = params => {
    return axios.post(`${ManageApiUrl}/api/Menu/GetByRole`, params).then(res => res.data);
}

export const SetMenuPermissionsRequest = params => {
    return axios.post(`${ManageApiUrl}/api/Role/SetMenuPermissions`, params).then(res => res.data);
}

export const GetUsersRequest = params => {
    return axios.post(`${ManageApiUrl}/api/User/List`, params).then(res => res.data);
}



export const GetPhotoAlbumsRequest = params => {
    return axios.post(`${ResourcesUrl}/api/PhotoAlbum/List`, params).then(res => res.data);
}

export const GetPhotoAlbumRequest = params => {
    return axios.post(`${ResourcesUrl}/api/PhotoAlbum/GetOne`, params).then(res => res.data);
}
export const AddPhotoAlbumRequest = params => {
    return axios.post(`${ResourcesUrl}/api/PhotoAlbum/Add`, params).then(res => res.data);
}
export const UpdatePhotoAlbumRequest = params => {
    return axios.post(`${ResourcesUrl}/api/PhotoAlbum/Update`, params).then(res => res.data);
}
export const DeletePhotoAlbumRequest = params => {
    return axios.post(`${ResourcesUrl}/api/PhotoAlbum/Remove`, params).then(res => res.data);
}

export const AddImageRequest = params => {
    return axios.post(`${ResourcesUrl}/api/Photo/AddImage`, params,{ headers: { 'Content-Type': 'multipart/form-data' } }).then(res => res.data);
}

export const GetPhotosRequest = params => {
    return axios.post(`${ResourcesUrl}/api/Photo/List`, params).then(res => res.data);
}
