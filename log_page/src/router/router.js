import { createRouter, createWebHistory } from 'vue-router';
import About from '../views/About.vue';
import Home from '../views/Home.vue';
import Register from '../views/Register.vue';
import LogIn from '../views/LogIn.vue';

const routes = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/about',
        component: About,
    },
    {
        path: '/register',
        component: Register,
    },
    {
        path: '/login',
        component: LogIn,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;