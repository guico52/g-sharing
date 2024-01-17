import {createRouter, createWebHashHistory} from 'vue-router'
import LoginAndRegisterView from "../views/LoginAndRegisterView.vue";
import HomeView from "../views/HomeView.vue";
import DocumentsView from "../views/DocumentsView.vue";
import FileView from "../views/doc/FileView.vue";
import TemplateView from "../views/doc/TemplateView.vue";
import PermissionView from "../views/doc/PermissionView.vue";
import DeletedFileView from "../views/doc/DeletedFileView.vue";
import UserControlView from "../views/doc/UserControlView.vue";
import TipTapCollabrativeEditor from "../components/editor/TipTapCollabrativeEditor.vue";
const routes = [
    {
        path: '/login',
        name: 'LoginAndRegisterView',
        component: LoginAndRegisterView
    },{
        path: '/',
        name: 'HomeView',
        // component: HomeView
        component: () => import("../views/doc/Introduce.vue")
    },{
        path: '/doc',
        name: 'DocView',
        component: DocumentsView,
        children: [
            {
                path: '/file',
                name: 'FileView',
                component: FileView
            }, {
                path: '/template',
                name: 'TemplateView',
                component: TemplateView
            } ,{
                path: '/permission',
                name: 'PermissionView',
                component: PermissionView
            } ,{
                path: '/deletedFile',
                name: 'DeletedFileView',
                component: DeletedFileView
            } ,{
                path: '/user',
                name: 'UserControlView',
                component: UserControlView
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
