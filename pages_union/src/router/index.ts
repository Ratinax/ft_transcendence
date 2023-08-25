import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import SignUp from '../views/SignUp.vue';
import SignIn from '../views/SignIn.vue';
import Chat from '../views/Chat.vue';
import Relations from '../views/Relations.vue';
import Menu from '../components/Menu.vue';

const routes = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/signup',
        component: SignUp,
    },
    {
        path: '/signin',
        component: SignIn,
    },
    {
        path: '/chat',
        name: 'Chat',
        component: Chat,
        props: true,
    },
    {
        path: '/relations',
        component: Relations,
        name: 'Relations',
        props: true,
    },
    {
        path: '/menu',
        component: Menu,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;