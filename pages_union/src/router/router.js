import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/LogPage/Home.vue';
import Register from '../views/LogPage/Register.vue';
import LogIn from '../views/LogPage/LogIn.vue';
import Chat from '../Chat.vue';
import Relations from '../Relations.vue';

const routes = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/register',
        component: Register,
    },
    {
        path: '/login',
        component: LogIn,
    },
    {
        path: '/chat',
        component: Chat,
    },
    {
        path: '/relations',
        component: Relations,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;