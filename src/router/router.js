import {createRouter, createWebHashHistory} from 'vue-router'
import LoginAndRegisterView from "../views/LoginAndRegisterView.vue";
import TipTapCollabrativeEditor from "../components/editor/TipTapCollabrativeEditor.vue";
import MenuView from "../views/MenuView.vue";
import ProjectView from "../views/menu/ProjectView.vue";
import BackupView from "../views/menu/BackupView.vue";
import PermissionView from "../views/menu/ManageUserView.vue";
import DeletedFileView from "../views/menu/DeletedFileView.vue";
import MyInfoView from "../views/menu/MyInfoView.vue";
import CollaborativeEditorView from "../views/CollaborativeEditorView.vue";
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
                name: 'BackupView',
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
                name: 'FileView',
                component: () => import("../views/menu/FileView.vue")
            }, {
                path:'/backup/:id',
                name: 'BackupDetailView',
                component: () => import("../views/menu/BackupDetailView.vue")
            }, {
                path:'/searchFile',
                name: 'SearchFileView',
                component: () => import("../views/menu/SearchFileView.vue")
            }, {
                path: '/users',
                name: 'UserView',
                component: () => import("../views/menu/UserView.vue")
            }, {
                path:'/MyInfo',
                name: 'MyInfoView',
                component: () => import("../views/menu/MyInfoView.vue")
            }, {
                path:'/manageUser',
                name: 'ManageUserView',
                component: () => import("../views/menu/ManageUserView.vue")
            }
        ]
    } ,{
        path: '/fileView',
        name: 'fileView',
        component: TipTapCollabrativeEditor,
    }, {
        path: '/backup/detail/:id',
        name: 'backupFileView',
        component: CollaborativeEditorView
    }, {
        path: '/meeting/:id',
        name: 'meeting',
        component: () => import("../views/MeetingView.vue")
    }, {
        path: '/meeting-test',
        name: 'meeting-test',
        component: () => import("../views/MeetingTest.vue")
    }, {
        path:'/livekit-test'
        ,name: 'livekit-test',
        component: () => import("../views/LivekitTest.vue")
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach(
    (to, from, next) => {
        const token = localStorage.getItem('token')
        // console.log(token)
        if (to.name !== 'LoginAndRegisterView' && !token) {
            next({name: 'LoginAndRegisterView'})
        } else {
            // console.log(to.params)
            next()
        }
    },
)
