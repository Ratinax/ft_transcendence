<template>
	<nav class="navbar">
		<ul class="col navbar-nav">
			<li class="logo">
				<div class="nav-link">
					<span class="link-text">FT_TRANSCENDENCE</span>
					<font-awesome-icon icon="fa-solid fa-angles-right" size="2x" />
				</div>
			</li>
			<li class="nav-item">
				<div class="nav-link clickable" @click="goToUserPage">
					<font-awesome-icon icon="fa-solid fa-user" size="2x" />
					<span class="link-text">Profile</span>
				</div>
			</li>
			<li class="nav-item">
				<div class="nav-link clickable" @click="goToMessages">
					<font-awesome-icon icon="fa-solid fa-comments" size="2x" />
					<span class="link-text">Chat</span>
				</div>
			</li>
			<li class="nav-item">
				<div class="nav-link clickable" @click="goToRelations">
					<font-awesome-icon icon="fa-solid fa-user-plus" size="2x" />
					<span class="link-text">Social</span>
				</div>
			</li>
			<li class="nav-item">
				<div class="nav-link clickable">
					<font-awesome-icon icon="fa-solid fa-gamepad" size="2x" />
					<span class="link-text">Game</span>
				</div>
			</li>
			<li class="nav-item">
				<div class="nav-link clickable" @click="logOut">
					<font-awesome-icon icon="fa-solid fa-right-from-bracket" size="2x" />
					<span class="link-text">Log out</span>
				</div>
			</li>
		</ul>
	</nav>
</template>

<script>
import { useRouter } from 'vue-router';
import axios from 'axios';
export default {
	name: 'Menu-component',
	data()
	{
		return {
			router: useRouter(),
			pseudo: '',

		}
	},
	async beforeMount()
	{
		this.pseudo = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/users/pseudo`, {withCredentials: true})).data;
	},
	methods: 
	{
		async goToMessages()
		{
			this.router.push({path: '/chat'});
		},
		goToRelations()
		{
			this.router.push({path: '/relations'});
		},
		goToUserPage()
		{
			this.router.push({name: 'UserPage', params: {pseudo: this.pseudo}})
		},
		async logOut()
		{
			try
			{
				const res = (await axios.post(`http://${process.env.VUE_APP_IP}:3000/users/logOut`, {}, {withCredentials: true})).data;
				if (res)
					this.router.push(({path: '/'}))
			}
			catch (e)
			{
				console.error(e);
			}
		}
	}
}
</script>

<style>

.navbar {
	--transition-speed: 142ms;
	position: fixed;
	background-color: var(--pdark);
	transition: width 142ms ease;
	z-index: 999;
}

.navbar-nav {
	color: var(--plight);
	list-style: none;
	padding: 0;
	margin: 0;
	height: 100%;
}

.nav-link {
	display: flex;
	align-items: center;
	height: 5rem;
	transition: var(--transition-speed);
}

.link-text {
	font-size: 1.25rem;
	display: none;
	text-wrap: nowrap;
}

.nav-link svg {
	min-width: 4rem;
	margin: 0 1.5rem;
}

.nav-link.clickable:hover {
	background-color: var(--pblack);
	color: var(--pcyan);
	transition: color var(--transition-speed) ease;
	cursor: pointer;
}

.nav-link.clickable:hover .link-text {
	color: white;
	transition: color var(--transition-speed) ease;
}

.logo {
	width: 100%;
	margin: 1em auto;
}

.logo .link-text {
	font-weight: bold;
	font-size: .8rem;
}

.logo .nav-link {
	background-color: var(--pblack);
}

.logo .nav-link svg {
	margin: 0 1.5rem;
}

.logo .nav-link .link-text {
	padding-left: 1.2rem;
}

.logo svg {
	transform: rotate(0);
	transition: transform 400ms;
}

.navbar:hover .logo svg {
	transform: rotate(180deg);
}

.navbar:hover .logo .nav-link svg {
	margin: 0;
}

/* large screens */
@media only screen and (min-width: 800px) {
	.navbar {
		border-right: .05em solid var(--plight);
		top: 0;
		width: 7rem;
		height: 100vh;
	}

	.nav-item {
		width: 100%;
	}

	.navbar:hover {
		width: 14rem;
	}

	.navbar:hover .link-text {
		display: inline;
	}

	.nav-item:last-child {
		margin-top: auto;
		margin-bottom: 1rem;
	}

	.view {
		padding-left: 7rem;
	}
}

/* small screens */
@media only screen and (max-width: 800px) {
	.navbar {
		background-color: var(--pblack);
		bottom: 0;
		width: 100%;
		min-width: 360px;
	}

	.nav-item {
		width: 20%;
	}

	.logo {
		display: none;
	}

	.navbar-nav {
		flex-direction: row;
	}

	.nav-link {
		display: flex;
		justify-content: center;
		font-size: .75em;
	}

	.view {
		padding-left: 0;
		padding-bottom: 5rem;
	}

	.nav-link svg {
		margin: 0;
	}
}

</style>
