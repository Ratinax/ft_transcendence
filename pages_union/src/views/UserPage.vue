<template>
	<div>
		<Menu :page="'Profile'"/>
		<Qrcode ref="QrcodeRef" :show="showQrcode" @close="showQrcode = false"/>
		<div class="page-background"></div>
		<DoubleFaCheck ref="DoubleFaCheckRef" :show="show2facheck" :qrUrl="doubleFaCode" @close="close2FaCheck"></DoubleFaCheck>
		<div class="row user-page view">
			<div class="col user-page-content">
				<div v-if="isBlockedBy" id="blocked-from-message">
					<p> <font-awesome-icon :icon="['fas', 'triangle-exclamation']" /> You are Blocked By that user </p>
				</div>
				<div class="col user-box">
					<div class="row user-profile">
						<div class="col user-profile-pic-and-name">
							<div :class="{'profile-pic-container': true, 'transform-to-button': !showButtons}" @click="chooseImage">
								<img :src="profilePic" alt="User profile picture"> 
								<input type="file" accept="image/*" ref="imageInput" style="display: none" @change="onImageSelect" />
							</div>
							<div class="row user-name-and-status">
								<div v-if="isFriend === 'accepted'" :class="{'connect': isConnected, 'not-connect': !isConnected}"></div>
								<div v-if="!changePseudo">
									<p :class="{'user-name text': true, 'transform-to-button': !showButtons}" @click="changePseudo = !showButtons">{{ nickname }}</p>
								</div>
								<div v-else>
									<form @submit.prevent="changeMyPseudo">
										<input class="user-name-input text" maxlength="8" minlength="3" size="11" v-model=nickname autofocus @keydown.esc="changePseudo = false">
									</form>
								</div>
							</div>
							<p class="text">@{{ userName }}</p>

							<div id="fa2" v-if="!showButtons">
							<p class="text">2Fa</p>
								<div class="switch-choice-container">
									<label class="switch-choice">
										<input id="fa2-input" class="input-switch" type="checkbox" @click="async () => {await switch2fa(); getQRCode()}">
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
					<button v-if="showButtons && !isBlocked && isFriend === '' && !isBlockedBy" class="ft-button green-button" @click="addFriend">ADD FRIEND</button>
					<button v-if="showButtons && !isBlockedBy" class="ft-button blue-button" @click="sendMessage">Send  message</button>
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
	</div>

</template>

<script lang="ts">
import { defineComponent, ref, computed, onBeforeMount, } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Menu from "../components/Menu.vue"
import MatchHistory from '../components/UserPage/MatchHistory.vue';
import DoubleFaCheck from '../components/UserPage/DoubleFaCheck.vue';
import Qrcode from '../components/UserPage/Qrcode.vue';
import axios from 'axios';
import { io } from 'socket.io-client';

export default defineComponent({
	name: 'UserPage',
	components: { Menu, MatchHistory, Qrcode, DoubleFaCheck },
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
			if (this.$refs.QrcodeRef as typeof Qrcode)
			(this.$refs.QrcodeRef as typeof Qrcode).getQrCode();
		},
		async changeMyPseudo() {
			try
			{
				await axios.post(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/changeNickname`, {nickname: this.nickname}, {withCredentials: true});
			}
			catch (e)
			{
				this.nickname = this.nicknameTmp;
			}
			this.changePseudo = false;
		},
		getQRCode()
		{
			(this.$refs.DoubleFaCheckRef as typeof DoubleFaCheck).getQRCode();
		}
	},
	beforeRouteUpdate(to, from, next) {
		console.log('going to fetch', to.params.pseudo);
		if  (typeof to.params.pseudo === "string")
			this.fecthData(to.params.pseudo)
		next();
	},
	setup() {
		let socket;

		const show2facheck = ref(false);
		const doubleFaCode = ref('');
		const nickname = ref('');
		const changePseudo = ref(false)
		const nicknameTmp = ref('');
		const isBlockedBy = ref(false);
		const is2faState = ref(false);
		const router = useRouter();
		const showButtons = ref<boolean>(false);
		const userName = ref('');
		const profilePic = ref('')
		const userGamesPlayed = ref(0);
		const isBlocked = ref(false);
		const isConnected = ref(false);
		const isFriend = ref('');
		const userWins = ref(0);
		const error = ref("");
		let imageDataURL: any = "";
		const imageInput = ref<HTMLInputElement | null>(null);
		const userWinRate = computed(() => {
			if (userGamesPlayed.value > 0) {
				return Math.round(userWins.value / userGamesPlayed.value * 100);
			}
			else {
				return 0;
			}
		})
		async function	fecthData(player: string | null) {
			changePseudo.value = false;
			if (player)
			{
				userName.value = player;
			}
			else
			{
				const route = useRoute();
				if (route && typeof route.params.pseudo === 'string'){
					userName.value = route.params.pseudo;
				}
			}
			
			const doUserExists = await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/doUserExists/${userName.value}`, {withCredentials: true});
			if (!doUserExists.data)
				router.replace({path: '/pagenotfound'})
		
			nickname.value = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/nickname/${userName.value}`, {withCredentials: true})).data;
			nicknameTmp.value = nickname.value;
			const response = await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/imageNameByPseudo/${userName.value}`, {withCredentials: true});
			profilePic.value = response.data;
			const response2 = await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/games/games-wins/${userName.value}`, {withCredentials: true});
			userGamesPlayed.value = response2.data.nb_games;
			userWins.value = response2.data.nb_wins;
			showButtons.value = !(userName.value === (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/pseudo/`, {withCredentials: true})).data);
			isBlocked.value = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/blockships/isBlocked/${userName.value}`, {withCredentials: true})).data;
			isFriend.value = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/friendships/friendRelation/${userName.value}`, {withCredentials: true})).data;
			if (isFriend.value === 'accepted')
				isConnected.value = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/sessions/isConnected/${userName.value}`, {withCredentials: true})).data;
			isBlockedBy.value = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/blockships/isBlockedBy/${userName.value}`, {withCredentials: true})).data;
			
			if (!showButtons.value)
			{
				const res2fa = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/is2fa/`, {withCredentials: true})).data;
				const checkbox = document.getElementById("fa2-input") as HTMLInputElement;
				if (checkbox)
					checkbox.checked = res2fa;
				is2faState.value = res2fa;
			}
			else
				is2faState.value = false;
		}

		async function	blockUser()
		{
			try
			{
				const res = await axios.post(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/blockships/block/`, {pseudo: userName.value}, {withCredentials: true});
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
				const res = await axios.post(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/blockships/unblock/`, {pseudo: userName.value}, {withCredentials: true});
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
				const res = await axios.post(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/friendships/ask/`, {pseudo: userName.value}, {withCredentials: true});
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
				const res = await axios.post(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/friendships/remove/`, {pseudo: userName.value}, {withCredentials: true});
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
				const res = (await axios.post(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/channels/initDM/`, {pseudo: userName.value}, {withCredentials: true})).data;
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
			try
			{
				const res = await axios.post(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/change2fa/`, {}, {withCredentials: true});
				is2faState.value = !is2faState.value;
				if (is2faState.value === true)
				{
					doubleFaCode.value = res.data;
					show2facheck.value = true;
				}
			}
			catch (e)
			{
				console.error(e);
			}
		}

		function	chooseImage() {
			if (!showButtons.value)
				imageInput.value?.click();
		}
		function	close2FaCheck(result: boolean)
		{
			const checkbox = document.getElementById("fa2-input") as HTMLInputElement;
			if (checkbox)
				checkbox.checked = result;
			is2faState.value = result;
			show2facheck.value = false;
		}

		async function	onImageSelect(event: any) {
			if (error.value === "Bad File Format (required .png .jpg), will be replaced by a default one"
				|| error.value === 'File too large, must be 50mb max, will be replaced by a default one')
				error.value = '';
			const file = event.target.files[0];
			if (!(file.type === 'image/png' 
				|| file.type === 'image/jpeg'
				|| file.type === 'image/jpg'))
			{
				error.value = 'Bad File Format (required .png .jpg), will be replaced by a default one';
				imageDataURL = null;
				return ;
			}
			if (file.size > 50000000)
			{
				error.value = 'File too large, must be 50mb max, will be replaced by a default one';
				imageDataURL = null;
				return ;
			}
			
			if (file) {
				try {
					imageDataURL = await readAsDataURLAsync(file);
				} 
				catch (e)
				{
					console.error(e);
				}
			}
			try
			{
				const res = (await axios.post(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/changePP`, {image: imageDataURL},{ withCredentials: true})).data
				profilePic.value = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/imageNameByPseudo/${userName.value}`,{ withCredentials: true})).data
			}
			catch (e)
			{
				console.error(e);
			}
		}
		function readAsDataURLAsync(file: any) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => {
				resolve(reader.result);
				};
				reader.onerror = reject;
				reader.readAsDataURL(file);
			});
}
		onBeforeMount(() =>
			{
			socket = io(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/session`, { withCredentials: true });
				socket.on('isConnected', (response) => {
					if (response.pseudo === userName.value)
					isConnected.value = true;
				})
				socket.on('noMoreConnected', (response) => {
					if (response.pseudo === userName.value)
					isConnected.value = false;
				})
				fecthData(null);
		})
		return { userName,
			nickname,
			nicknameTmp,
			profilePic, 
			userGamesPlayed, 
			userWins, 
			userWinRate, 
			showButtons,
			isBlocked,
			isFriend,
			isConnected,
			is2faState,
			isBlockedBy,
			show2facheck,
			doubleFaCode,
			blockUser, 
			unblockUser,
			removeFriend,
			addFriend,
			sendMessage,
			switch2fa,
			fecthData,
			chooseImage,
			onImageSelect,
			close2FaCheck,
			imageInput,
			changePseudo
		};
	},
});
</script>

<style scoped>
#blocked-from-message
{
	text-align: center;
	color: red;
	margin-bottom: 1em;
}

#see-qrcode
{
	color: var(--plight);
	height: 1.5em;
	cursor: pointer;
	transition: color 400ms ease;
}

#see-qrcode:hover {
	color: var(--pcyan);
}

#fa2
{
	display: flex;
	align-items: center;
}

.text {
	color: white;
}

.user-page {
	min-width: 360px;
	height: 100vh;
}

.user-page-content {
	justify-content: center;
	margin: 2em auto;
	max-width: 960px;
	width: 100%;
}

.user-match-history {
	margin: 2%;
	width: 60%;
	overflow: auto;
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
	background-color: rgba(0, 0, 0, 0);
}

.user-name-input {
	font-size: 2em;
	display: flex;
	justify-content: center;
	font-family: Avenir, Helvetica, Arial, sans-serif;
	background-color: rgb(0, 0, 0, 0);
    text-align: center;
}

.transform-to-button:hover {
	cursor: pointer;
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
	cursor: pointer;
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
		height: 54em;
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
