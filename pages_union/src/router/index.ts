import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import SignUp from '../views/SignUp.vue';
import SignIn from '../views/SignIn.vue';
import Chat from '../views/Chat.vue';
import Relations from '../views/Relations.vue';
import Callback42 from '../views/Callback42.vue';

import axios from 'axios';
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
        // Check if session cookie, if not, redirect to logpage
        beforeEnter: async (to: any, from: any, next: any) => {
            const sessionCookie = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true })).data;
            if (sessionCookie !== '') {
              next();
            } else {
              next('/');
            }
        }
    },
    {
        path: '/relations',
        component: Relations,
        name: 'Relations',
        props: true,
        // Check if session cookie, if not, redirect to logpage
        beforeEnter: async (to: any, from: any, next: any) => {
            const sessionCookie = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true })).data;
            if (sessionCookie !== '') {
              next();
            } else {
              next('/');
            }
        }
    },
    {
        path: '/callback42',
        component: Callback42,
        name: 'Callback42',
        props: true,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;