<template>
	<div class="row user-page">
		<Menu />
		<div class="col user-page-content">
			<div class="col user-box">
				<div class="row user-profile">
					<div class="col user-profile-pic-and-name">
						<div class="profile-pic-container">
							<img :src="profilePic" alt="User profile picture"> 
						</div>
						<div class="row user-name-and-status">
							<div class="connect"></div>
							<p class="user-name text">{{ userName }}</p>
						</div>
					</div>
					<div class="col user-description">
						<p class="text">text</p>
					</div>
				</div>
			</div>
			<div class="row button-zone">
				<button v-if="showButtons" class="ft-button block-button">BLOCK USER</button>
				<button v-if="showButtons" class="ft-button add-button">ADD FRIEND</button>
			</div>
			<div class="row user-box user-stats">
				<div class="col user-stat">
					<h1 class="text">Game(s) played</h1>
					<p class="text user-score fade-text">{{ userGamesPlayed }}</p>
				</div>
				<div class="col user-stat">
					<h1 class="text">Win rate</h1>
					<p class="text user-score fade-text winrate">{{userWinRate}}%</p>
				</div>
				<div class="col user-stat">
					<h1 class="text">Win(s)</h1>
					<p class="text user-score fade-text">{{ userWins }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, computed, onMounted, } from 'vue';
import { useRoute } from 'vue-router';
import Menu from "../components/Menu.vue"
import axios from 'axios';

export default defineComponent({
	name: 'UserPage',
	components: { Menu },
	setup() {
		const showButtons = ref<boolean>(false);
		const userName = ref('');
		const profilePic = ref(undefined)
		const userDescription = ref("userdescription");
		const userGamesPlayed = ref(23);
		const userWins = ref(12);
		const userWinRate = computed(() => {
			return Math.round(userWins.value / userGamesPlayed.value * 100);
		})

		onMounted(async () => {
			const route = useRoute();
			if (typeof route.params.pseudo === 'string')
				userName.value = route.params.pseudo;
			const response = await axios.get(`http://${process.env.VUE_APP_IP}:3000/users/imageNameByPseudo/${userName.value}`, {withCredentials: true});
			profilePic.value = response.data;
			const response2 = await axios.get(`http://${process.env.VUE_APP_IP}:3000/games/games-wins/${userName.value}`, {withCredentials: true});
			userGamesPlayed.value = response2.data.nb_games;
			userWins.value = response2.data.nb_wins;
		})


		return { userName, 
			profilePic, 
			userDescription, 
			userGamesPlayed, 
			userWins, 
			userWinRate, 
			showButtons, };
	},
});
</script>

<style src="../assets/global.css" rel="stylesheet" lang="css"></style>
<style scoped>

.winrate {
	transform: scale(75%);
}

.text {
	color: white;
}

.user-page {
	background: linear-gradient(45deg, var(--pblack), var(--pdark));
	box-sizing: content-box;
	min-width: 450px;
	height: 100vh;
}

.user-page-content {
	margin: 2em auto;
	max-width: 960px;
	width: 100%;
	box-sizing: content-box;
}

/* User profile */
.user-box {
	box-shadow: var(--pcyan) 0px 0px 0px 2px, var(--pblue) 0px 4px 6px -1px, var(--pblue) 0px 1px 0px inset;
	background: var(--pdark);
	width: 100%;
}

.user-profile-pic-and-name {
	align-items: center;
	width: 40%;
	border-right: 1px solid var(--plight);
}

.profile-pic-container {
	display: flex;
	justify-content: center;
	border-radius: 50%;
	overflow: hidden;
	width: 15em;
	height: 15em;
	margin: 1em 0; 
}

.profile-pic-container img {
	height: 100%;
}

.user-name-and-status {
	margin: .2em 0 1em 0;
	align-items: center;
}

.connect {
	border-radius: 50%;
	width: 1em;
	height: 1em;
	background: lime;
	margin-right: .5em;
	margin-top: 2%;
}

.user-name {
	font-size: 2em;
}

.user-description {
	padding: 2%;
}

/* Buttons */
.button-zone {
	width: 40%;
	justify-content: space-around;

	margin-top: 1em;
	margin-bottom: 4em;
}

.add-button {
	background: rgba(0, 255, 0, 0.875);
	box-shadow: 0 4px 0 green;
}

.add-button:hover {
	background: lime;
}

.block-button {
	background: rgb(251, 80, 80, 0.875);
	box-shadow: 0 4px 0 red;
}

.block-button:hover {
	background: rgb(251, 80, 80);
}

/* Stats */
.user-stats {
	justify-content: center;
}

.user-stat {
	width: 33%;
	align-items: center;
	padding-bottom: 1.5em;
}


.user-score {
	font-size: 9em;
	padding-top: .1em;
}

.user-win-rate {
	font-size: 2.5em;
}

/* Media queries */

@media (max-width: 1120px) {
	.row {
		flex-direction: column;
	}

	.user-page {
		flex-direction: row;
	}

	.user-page-content {
		width: 80%;
	}

	.user-stat {
		border-top: 2px solid var(--plight);
		width: 100%;
	}

	.button-zone {
		width: 100%;
	}

	.button-zone,
	.user-profile,
	.user-name-and-status {
		flex-direction: row;
	}
}

@media (max-width: 850px) {
	.user-profile {
		flex-direction: column;
	}

	.user-profile-pic-and-name {
		width: 100%;
		border: none;
		border-bottom: 1px solid var(--plight);
	}

	.user-profile-pic {
		width: 30%;
	}
}
</style>
