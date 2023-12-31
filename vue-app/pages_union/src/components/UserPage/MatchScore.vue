<template>
	<div class="match-score-container">
		<div class="match-gamemode-name">
			{{ modeName }}
		</div>
		<div class="row match-score">
			<div class="row user-score">
				<div class="col">
					<div class="profile-pic-container" @click="goToUserPage(playerOne?.pseudo)">
						<img :src="playerOne?.profilPic" :alt="playerOne?.pseudo">
					</div>
					<span class="text user-pseudo" @click="goToUserPage(playerOne?.pseudo)">{{ playerOne?.nickname }}</span>
				</div>
				<font-awesome-icon v-if="playerOneScore !== undefined && playerTwoScore !== undefined && playerOneScore > playerTwoScore" class="win right" icon="fa-solid fa-w" size="xl" />
				<font-awesome-icon v-else-if="playerOneScore !== undefined && playerTwoScore !== undefined && playerOneScore < playerTwoScore" class="loss right" icon="fa-solid fa-l" size="xl"/>
				<font-awesome-icon v-else class="draw right" icon="fa-solid fa-flag" size="xl" />
			</div>
			<div class="row scores">
				<span class="text score" style="text-align: right;">{{ pOneScore }}</span>
				<font-awesome-icon class="score-separator" icon="fa-solid fa-code-commit" size="lg" />
				<span class="text score">{{ pTwoScore }}</span>
			</div>
			<div class="row user-score">
				<font-awesome-icon v-if="playerOneScore !== undefined && playerTwoScore !== undefined && playerOneScore < playerTwoScore" class="win left" icon="fa-solid fa-w" size="xl" />
				<font-awesome-icon v-else-if="playerOneScore !== undefined && playerTwoScore !== undefined && playerOneScore > playerTwoScore" class="loss left" icon="fa-solid fa-l" size="xl" />
				<font-awesome-icon v-else class="draw left" icon="fa-solid fa-flag" size="xl" />
				<div class="col">
					<div class="profile-pic-container" @click="goToUserPage(playerTwo?.pseudo)">
						<img :src="playerTwo?.profilPic" :alt="playerTwo?.pseudo">
					</div>
					<span class="text user-pseudo" @click="goToUserPage(playerTwo?.pseudo)">{{ playerTwo?.nickname }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

interface UserInfo {
	nickname: string,
	pseudo: string,
	profilPic: string,	
}

export default defineComponent({
	name: "MatchScore",
	props: {
		playerOneData: Object as () => UserInfo,
		playerTwoData: Object as () => UserInfo,
		playerOneScore: Number,
		playerTwoScore: Number,
		mode: Number,
	},
	updated()
	{
		this.playerOne = this.playerOneData;
		this.playerTwo = this.playerTwoData;
		const gameModes = ["SLOW", "CLASSIC", "FAST", "CUSTOM"];
		if (this.mode) {
			this.modeName = gameModes[this.mode - 1];
		}

		this.pOneScore = this.playerOneScore;
		this.pTwoScore = this.playerTwoScore;
	},
	setup(props) {
		const router = useRouter();
		const playerOne = ref(props.playerOneData);
		const playerTwo = ref(props.playerTwoData);
		const gameModes = ["SLOW", "CLASSIC", "FAST", "CUSTOM"];
		let modeName = "unknown gamemode";
		if (props.mode) {
			modeName = gameModes[props.mode - 1];
		}

		const pOneScore = ref(props.playerOneScore);
		const pTwoScore = ref(props.playerTwoScore);

		function	goToUserPage(player: string | undefined) {
			router.push({ name: "UserPage", params: { pseudo: player } } )
		}

		return {
			playerOne, 
			playerTwo, 
			pOneScore,
			pTwoScore,
			goToUserPage,
			modeName
		};
	}
});
</script>

<style scoped>

.profile-pic-container
{
	cursor: pointer;
}

.profile-pic-container:hover + .user-pseudo
{
	color: var(--pcyan);
}

.match-score-container {
	padding: .742em;
	border-radius: .5em;
	background: rgba(0, 0, 0, 0.42);
	border-radius: .5em;
	margin-bottom: .742em;
}

.match-gamemode-name {
	text-align: center;
	color: magenta;
	font-size: 1.1em;
}

.match-score {
	justify-content: space-between;
	align-items: center;
}

.user-score {
	align-items: center;
	width: 45%;
}

.profile-pic-container {
	display: flex;
	justify-content: center;
	border-radius: 50%;
	overflow: hidden;
	width: 4em;
	height: 4em;
}

.col {
	align-items: center;
} 

.user-pseudo {
	margin-top: .25em;
	transition: color .1s ease;
	cursor: pointer;
}

.user-pseudo:hover {
	color: var(--pcyan);
}

.win {
	color: lime;
}

.loss {
	color: red;
}

.draw {
	color: orange;
}

.win, .loss, .draw {
	width: 2.5em;
}

.left {
	margin-left: auto;
}

.right {
	margin-right: auto;
}

.scores {
	font-size: 1.4em;
	align-items: center;
	justify-content: space-evenly;
}

.scores .text {
	width: 1em;
}

.score-separator {
	font-size: 1em;
	color: var(--pcyan);
	padding: 0 .5em;
}

@media screen and (max-width: 768px) {
	.profile-pic-container {
		width: 2.5em;
		height: 2.5em;
	}
}

@media screen and (max-width: 400px) {
	.win, .loss {
		width: 1.742em;
	}
}

</style>
