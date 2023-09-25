<template>
	<div class="row match-score">
		<div class="row user-score">
			<div class="col">
				<div class="profile-pic-container">
					<img :src="playerOne?.profilPic" :alt="playerOne?.pseudo">
				</div>
				<span class="text user-pseudo" @click="goToUserPage(playerOne?.pseudo)">{{ playerOne?.pseudo }}</span>
			</div>
			<font-awesome-icon v-if="userOneWin" class="win right" icon="fa-solid fa-w" size="xl" />
			<font-awesome-icon v-else class="loss right" icon="fa-solid fa-l" size="xl"/>
		</div>
		<div class="row scores">
			<span class="text score" style="text-align: right;">{{ pOneScore }}</span>
			<font-awesome-icon class="score-separator" icon="fa-solid fa-code-commit" size="lg" />
			<span class="text score">{{ pTwoScore }}</span>
		</div>
		<div class="row user-score">
			<font-awesome-icon v-if="!userOneWin" class="win left" icon="fa-solid fa-w" size="xl" />
			<font-awesome-icon v-else class="loss left" icon="fa-solid fa-l" size="xl" />
			<div class="col">
				<div class="profile-pic-container">
					<img :src="playerTwo?.profilPic" :alt="playerTwo?.pseudo">
				</div>
				<span class="text user-pseudo" @click="goToUserPage(playerTwo?.pseudo)">{{ playerTwo?.pseudo }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

interface UserInfo {
	pseudo: string,
	profilPic: string,	
}

export default defineComponent({
	name: "MatchScore",
	props: {
		pseudo: String,	
		playerOneData: Object as () => UserInfo,
		playerTwoData: Object as () => UserInfo,
		playerOneScore: Number,
		playerTwoScore: Number,
	},
	setup(props) {
		const router = useRouter();
		const playerOne = ref(props.playerOneData)!;
		const playerTwo = ref(props.playerTwoData);
		const userOneWin = ref(props.playerOneScore! > props.playerTwoScore!);
		const pOneScore = ref(props.playerOneScore);
		const pTwoScore = ref(props.playerTwoScore);

		function	goToUserPage(player: string | undefined) {
			router.push({ name: "UserPage", params: { pseudo: player } } )
			//TODO: check if we want to remove that thing 
			/*.then(() => {
				window.location.reload();
			});*/
		}

		return {playerOne, 
			playerTwo, 
			userOneWin,
			pOneScore,
			pTwoScore,
			goToUserPage};
	}
});
</script>

<style scoped>

.match-score {
	padding: .742em;
	border-radius: .5em;
	background: linear-gradient(var(--pblack) 42%, var(--pdark));
	border-radius: .5em;
	margin-bottom: .742em;
	justify-content: space-between;
	align-items: center;
	border: 2px solid var(--pcyan);
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
}

.user-pseudo:hover {
	color: var(--pcyan);
	cursor: pointer;
}

.win {
	color: lime;
}

.loss {
	color: red;
}

.win, .loss {
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

</style>
