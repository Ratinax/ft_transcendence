import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Chat from '../views/Chat.vue';
import Relations from '../views/Relations.vue';
import Callback42 from '../views/Callback42.vue';
import UserPage from '../views/UserPage.vue'
import DoubleFa from '../views/DoubleFa.vue'
import ChooseGame from '../views/ChooseGame.vue'
import GameView from '../views/GameView.vue'
import PageNotFound from '../views/PageNotFound.vue'

import axios from 'axios';
const routes = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/chat',
        name: 'Chat',
        component: Chat,
        props: true,
        // Check if session cookie, if not, redirect to logpage
        beforeEnter: async (to: any, from: any, next: any) => {
            const sessionCookie = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/sessions/cookies`, { withCredentials: true })).data;
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
            const sessionCookie = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/sessions/cookies`, { withCredentials: true })).data;
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
	{
		path: '/user_page/:pseudo',
		component: UserPage,
		name: 'UserPage',
        beforeEnter: async (to: any, from: any, next: any) => {
            const sessionCookie = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/sessions/cookies`, { withCredentials: true })).data;
            if (sessionCookie !== '') {
                next();
            } else {
                next('/');
            }
        }
	},
    {
		path: '/2fa/:link',
		component: DoubleFa,
		name: 'DoubleFaPage',
	},
    {
		path: '/choose_game',
		component: ChooseGame,
		name: 'ChooseGamePage',
        beforeEnter: async (to: any, from: any, next: any) => {
            const sessionCookie = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/sessions/cookies`, { withCredentials: true })).data;
            if (sessionCookie !== '') {
                next();
            } else {
                next('/');
            }
        }
	},
    {
		path: '/game',
		component: GameView,
		name: 'GameView',
        beforeEnter: async (to: any, from: any, next: any) => {
            const sessionCookie = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/sessions/cookies`, { withCredentials: true })).data;
            if (sessionCookie !== '') {
                next();
            } else {
                next('/');
            }
        }
	},
    {
        path: '/:catchAll(.*)',
        redirect: '/pagenotfound',
    },
    {
        path: '/pagenotfound',
        component: PageNotFound,
        name: 'PageNotFound',

    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;
