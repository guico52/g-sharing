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
import {message} from "../api/api.js";
const routes = [
    {
        path: '/login',
        name: 'LoginAndRegisterView',
        component: LoginAndRegisterView
    },{
        path: '/backstage',
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
            }, {
                path: '/meetingList',
                name: 'MeetingListView',
                component: () => import("../views/menu/MeetingListView.vue")
            }, {
                path: '/privateChat',
                name: 'PrivateChatView',
                component: () => import("../views/main/PrivateChatView.vue")
            }, {
                path: '/groupChat',
                name: 'GroupChatView',
                component: () => import("../views/main/GroupChatView.vue")
            }
        ]
    } ,{
        path: '/fileView/:fileId',
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
        path:'/meet/:name',
        component: () => import("../views/LivekitTest.vue")
    }, {
        path: '/meeting-room/:name',
        name: 'MeetingRoomView',
        component: () => import("../views/meeting/MeetingRoom.vue")
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    // 检查用户是否已经登录
    const isAuthenticated = !!localStorage.getItem('token');

    if ((to.name !== 'LoginAndRegisterView' && to.name !== 'IntroduceView') && !isAuthenticated) {
        // 如果用户尚未登录，并且尝试访问非登录页面，则重定向到登录页面
        message.warning('请先登录')
        next({ name: 'LoginAndRegisterView' });

    }  else {
        // 在其他情况下，正常进行导航
        next();
    }
});
