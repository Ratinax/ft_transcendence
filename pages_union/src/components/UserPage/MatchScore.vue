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
			<span class="text score">{{ pOneScore }}</span>
		</div>
		<font-awesome-icon class="score-separator" icon="fa-solid fa-code-commit" size="lg" />
		<div class="row user-score">
			<span class="text score">{{ pTwoScore }}</span>
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
			router.push({ name: "UserPage", params: { pseudo: player } } ).then(() => {
				window.location.reload();
			});
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
	justify-content: space-around;
}

.user-score .text.score {
	font-size: 1.5em;
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

.left {
	margin-left: 1.5em;
}

.right {
	margin-right: 1.5em;
}

.score-separator {
	color: var(--pcyan);
	width: 10%;
}

</style>
