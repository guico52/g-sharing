import {createRouter, createWebHashHistory} from 'vue-router'
import LoginAndRegisterView from "../views/LoginAndRegisterView.vue";
import TipTapCollabrativeEditor from "../components/editor/TipTapCollabrativeEditor.vue";
import MenuView from "../views/MenuView.vue";
import ProjectView from "../views/menu/ProjectView.vue";
import BackupView from "../views/menu/BackupView.vue";
import PermissionView from "../views/menu/PermissionView.vue";
import DeletedFileView from "../views/menu/DeletedFileView.vue";
import MyInfoView from "../views/menu/MyInfoView.vue";
const routes = [
    {
        path: '/login',
        name: 'LoginAndRegisterView',
        component: LoginAndRegisterView
    },{
        path: '/',
        name: 'HomeView',
        // component: HomeView
        component: () => import("../views/Introduce.vue")
    },{
        path: '/menu',
        name: 'MenuView',
        component: MenuView,
        children: [
            {
                path: '/project',
                name: 'ProjectView',
                component: ProjectView,
            }, {
                path: '/backup',
                name: 'TemplateView',
                component:  BackupView
            } ,{
                path: '/permission',
                name: 'PermissionView',
                component: PermissionView
            } ,{
                path: '/deletedFile',
                name: 'DeletedFileView',
                component: DeletedFileView
            } ,{
                path: '/myInfo',
                name: 'MyInfoView',
                component: MyInfoView
            }, {
                path: '/userGroup',
                name: 'UserGroupView',
                component: () => import("../views/menu/UserGroupView.vue")
            }, {
                path: '/project/:id',
                name: 'ProjectDetailView',
                component: () => import("../views/menu/FileView.vue")
            }
        ]
    } ,{
        path: '/collaborative-editing',
        name: 'CollaborativeEditorView',
        component: TipTapCollabrativeEditor
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})
// 配置路由守卫
// router.beforeEach(
//     (to, from, next) => {
//         const token = localStorage.getItem('token')
//         if(to.path === '/login') {
//             if(token) {
//                 next({path: '/'})
//             } else {
//                 next()
//             }
//         } else {
//             if(token) {
//                 next()
//             } else {
//                 next({path: '/login'})
//             }
//         }
//     }
// )
