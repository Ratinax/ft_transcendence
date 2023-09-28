<template>
	<Menu />
	<Qrcode ref="QrcodeRef" :show="showQrcode" @close="showQrcode = false"/>
	<div class="row user-page view">
		<div class="col user-page-content">
			<div class="col user-box">
				<div class="row user-profile">
					<div class="col user-profile-pic-and-name">
						<div class="profile-pic-container">
							<img :src="profilePic" alt="User profile picture"> 
						</div>
						<div class="row user-name-and-status">
						<div :class="{'connect': isConnected, 'not-connect': !isConnected}"></div>
							<p class="user-name text">{{ userName }}</p>
						</div>

						<div id="fa2" v-if="!showButtons">
							<p class="text">2Fa</p>
							<div class="switch-choice-container">
								<label class="switch-choice">
									<input id="fa2-input" class="input-switch" type="checkbox" @click="switch2fa">
									<span class="slider round-slider"></span>
								</label>
							</div>
							<font-awesome-icon v-if="is2faState" id="see-qrcode" :icon="['fas', 'eye']" @click="seeQrcode"/>
						</div>
					</div>
					<div class="col user-match-history">
						<MatchHistory :pseudo="userName"></MatchHistory>
					</div>
				</div>
			</div>
			<div class="row button-zone">
				<button v-if="showButtons && isBlocked" class="ft-button red-button" @click="unblockUser">UNBLOCK USER</button>
				<button v-if="showButtons && !isBlocked && isFriend === ''" class="ft-button red-button" @click="blockUser">BLOCK USER</button>
				<button v-if="showButtons && !isBlocked && isFriend === 'accepted'" class="ft-button green-button" @click="removeFriend">REMOVE FRIEND</button>
				<button v-if="showButtons && !isBlocked && isFriend === 'pending'" class="ft-button green-button" @click="removeFriend">REMOVE FRIEND REQUEST</button>
				<button v-if="showButtons && !isBlocked && isFriend === ''" class="ft-button green-button" @click="addFriend">ADD FRIEND</button>
				<button v-if="showButtons" class="ft-button blue-button" @click="sendMessage">Send  message</button>
			</div>
			<div class="row user-box user-stats">
				<div class="col user-stat">
					<h1 class="text">Game(s) played</h1>
					<p class="text user-score fade-text">{{ userGamesPlayed }}</p>
				</div>
				<div class="col user-stat middle">
					<h1 class="text">Win rate</h1>
					<p class="text user-score fade-text">{{userWinRate}}%</p>
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
import { defineComponent, ref, computed, onUpdated, onBeforeMount, } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Menu from "../components/Menu.vue"
import MatchHistory from '../components/UserPage/MatchHistory.vue';
import Qrcode from '../components/UserPage/Qrcode.vue';
import axios from 'axios';
import { io } from 'socket.io-client';

export default defineComponent({
	name: 'UserPage',
	components: { Menu, MatchHistory, Qrcode },
	data()
	{
		return {
			showQrcode: false,
		}
	},
	methods:
	{
		seeQrcode()
		{
			this.showQrcode = true;
			(this.$refs.QrcodeRef as typeof Qrcode).getQrCode();
		}
	},
	setup() {
		let socket;

		const is2faState = ref(false);
		const router = useRouter();
		const showButtons = ref<boolean>(false);
		const userName = ref('');
		const profilePic = ref(undefined)
		const userGamesPlayed = ref(0);
		const isBlocked = ref(false);
		const isConnected = ref(false);
		const isFriend = ref('');
		const userWins = ref(0);
		const userWinRate = computed(() => {
			if (userGamesPlayed.value > 0) {
				return Math.round(userWins.value / userGamesPlayed.value * 100);
			}
			else {
				return 0;
			}
		})

		async function	fecthData() {
			const route = useRoute();
			if (typeof route.params.pseudo === 'string'){
				userName.value = route.params.pseudo;
			}
			const response = await axios.get(`http://${process.env.VUE_APP_IP}:3000/users/imageNameByPseudo/${userName.value}`, {withCredentials: true});
			profilePic.value = response.data;
			const response2 = await axios.get(`http://${process.env.VUE_APP_IP}:3000/games/games-wins/${userName.value}`, {withCredentials: true});
			userGamesPlayed.value = response2.data.nb_games;
			userWins.value = response2.data.nb_wins;
			showButtons.value = !(userName.value === (await axios.get(`http://${process.env.VUE_APP_IP}:3000/users/pseudo/`, {withCredentials: true})).data);
			isBlocked.value = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/blockships/isBlocked/${userName.value}`, {withCredentials: true})).data;
			isFriend.value = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/friendships/friendRelation/${userName.value}`, {withCredentials: true})).data;
			isConnected.value = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/isConnected/${userName.value}`, {withCredentials: true})).data;
			const res2fa = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/users/is2fa/${userName.value}`, {withCredentials: true})).data;
			const checkbox = document.getElementById("fa2-input") as HTMLInputElement;
			if (checkbox)
				checkbox.checked = res2fa;
			is2faState.value = res2fa;
		}

		async function	blockUser()
		{
			try
			{
				const res = await axios.post(`http://${process.env.VUE_APP_IP}:3000/blockships/block/`, {pseudo: userName.value}, {withCredentials: true});
				if (res.data === 'Success')
				isBlocked.value = true;
			}
			catch (e)
			{
				console.error(e);
			}
		}
		async function	unblockUser()
		{
			try
			{
				const res = await axios.post(`http://${process.env.VUE_APP_IP}:3000/blockships/unblock/`, {pseudo: userName.value}, {withCredentials: true});
				if (res.data === 'Success')
				isBlocked.value = false;
			}
			catch (e)
			{
				console.error(e);
			}
		}
		async function	addFriend()
		{
			try
			{
				const res = await axios.post(`http://${process.env.VUE_APP_IP}:3000/friendships/ask/`, {pseudo: userName.value}, {withCredentials: true});
				isFriend.value = res.data;
			}
			catch (e)
			{
				console.error(e);
			}
		}
		async function	removeFriend()
		{
			try
			{
				const res = await axios.post(`http://${process.env.VUE_APP_IP}:3000/friendships/remove/`, {pseudo: userName.value}, {withCredentials: true});
				isFriend.value = res.data;
			}
			catch (e)
			{
				console.error(e);
			}
		}
		async function sendMessage()
		{
			try
			{
				const res = (await axios.post(`http://${process.env.VUE_APP_IP}:3000/channels/sendDM/`, {pseudo: userName.value}, {withCredentials: true})).data;
				if (res)
					router.push({ path: '/chat' } )
			}
			catch (e)
			{
				console.error(e);
			}
		}
		async function switch2fa()
		{
			console.log('a ete clicked')
			is2faState.value = !is2faState.value;
			try
			{
				await axios.post(`http://${process.env.VUE_APP_IP}:3000/users/change2fa/`, {}, {withCredentials: true});
			}
			catch (e)
			{
				console.error(e);
			}
		}
		onBeforeMount(() =>
		{
			socket = io(`http://${process.env.VUE_APP_IP}:3003/`, { withCredentials: true });
			socket.on('isConnected', (response) => {
				if (response.pseudo === userName.value)
					isConnected.value = true;
			})
			socket.on('noMoreConnected', (response) => {
				if (response.pseudo === userName.value)
					isConnected.value = false;
			})
			fecthData()
		})
		onUpdated(() =>
		{
			fecthData()
		})
		return { userName, 
			profilePic, 
			userGamesPlayed, 
			userWins, 
			userWinRate, 
			showButtons,
			isBlocked,
			isFriend,
			isConnected,
			is2faState,
			blockUser, 
			unblockUser,
			removeFriend,
			addFriend,
			sendMessage,
			switch2fa,
			};
	},
});
</script>

<style scoped>

#see-qrcode
{
	color: var(--plight);
	height: 1.5em;
	cursor: pointer;
}

#see-qrcode:hover
{
	height: 1.7em;
}

#fa2
{
	display: flex;
	align-items: center;
}

.winrate {
	transform: scale(75%);
}

.text {
	color: white;
}

.user-page {
	background: linear-gradient(45deg, var(--pblack), var(--pdark));
	min-width: 360px;
	height: 100vh;
}

.user-page-content {
	justify-content: center;
	margin: 2em auto;
	max-width: 960px;
	width: 100%;
}

/* User profile */
.user-box {
	box-shadow: rgba(102, 252, 251, 0.4) 0px 2px 4px, rgba(102, 252, 251, 0.3) 0px 7px 13px -3px, rgba(102, 252, 251, 0.2) 0px -3px 0px inset;
	background: var(--pdark);
	width: 100%;
	border-radius: .742em;
}

.user-profile {
	height: 27em;
}

.user-profile-pic-and-name {
	align-items: center;
	justify-content: center;
	width: 40%;
	padding: 0 1em;
	border-right: 1px solid var(--plight);
}

.profile-pic-container {
	display: flex;
	justify-content: center;
	border-radius: 50%;
	overflow: hidden;
	width: 15em;
	height: 15em;
	margin: 2em 0; 
	box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px;
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
.not-connect {
	border-radius: 50%;
	width: 1em;
	height: 1em;
	background: red;
	margin-right: .5em;
	margin-top: 2%;
}

.user-name {
	font-size: 2em;
}

.user-match-history {
	margin: 2%;
	width: 60%;
	overflow: auto;
}

/* Buttons */
.button-zone {
	font-size: .8em;
	width: 40%;
	justify-content: space-evenly;
	flex-wrap: wrap;

	margin-top: .5em;
	margin-bottom: 4em;
}

.button-zone .ft-button {
	margin: .5em;
}

/* Stats */
.user-stats {
	justify-content: center;
	align-items: center;
	height: 19em;
}

.user-stat {
	width: 33%;
	align-items: center;
	padding-bottom: 1.5em;
}

.user-score {
	font-size: 8em;
	padding-top: .1em;
}

/* toggle switch */

.switch-choice-container
{
	scale: 0.5;
}

.switch-choice {
  position: relative;
  display: inline-block;
  width: 6em;
  height: 3.4em;
}

.switch-choice .input-switch {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ff0900b0;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 2.6em;
  width: 2.6em;
  left: 0.4em;
  bottom: 0.4em;
  background-color: white;
  transition: .4s;
}

.input-switch:checked + .slider {
  background-color: #09ff00b0;
}

.input-switch:focus + .slider {
  box-shadow: 0 0 0 .4em rgba(21, 156, 228, 0.7);
  outline: none;
}

.input-switch:checked + .slider:before {
  transform: translateX(2.6em);
}

.slider.round-slider {
  border-radius: 3.4em;
}

.slider.round-slider:before {
  border-radius: 50%;
}

/* Media queries */

@media (max-width: 1120px) {
	.row {
		flex-direction: column;
	}

	.user-profile,
	.user-stats {
		height: auto;
	}

	.user-page {
		height: 100%;
		flex-direction: row;
	}

	.user-page-content {
		justify-content: unset;
		width: 90%;
	}

	.user-match-history {
		width: 95%;
	}

	.middle {
		border-top: 1px solid var(--plight);
		border-bottom: 1px solid var(--plight);
		width: 100%;
	}

	.user-stat {
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

@media (max-width: 960px) {
	.user-profile {
		flex-direction: column;
	}

	.user-profile-pic-and-name {
		width: 100%;
		padding: 0;
		border: none;
		border-bottom: 1px solid var(--plight);
	}
}

@media screen and (max-width: 768px) {
  .profile-pic-container {
    width: 10em;
    height: 10em;
    margin: 1em 0;
  }
}

</style>
