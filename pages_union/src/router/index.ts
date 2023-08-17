import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Register from '../views/Register.vue';
import LogIn from '../views/LogIn.vue';
import Chat from '../views/Chat.vue';
import Relations from '../views/Relations.vue';

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
        name: 'Chat',
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