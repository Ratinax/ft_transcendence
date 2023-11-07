<template>
	<div>
		<MatchScore v-for="match in matchHistory"
			:key="match.id"
			:playerOneData="match.playerOne"
			:playerTwoData="match.playerTwo"
			:playerOneScore="match.scorePlayerOne"
			:playerTwoScore="match.scorePlayerTwo"
			:mode="match.mode"></MatchScore>
		<div v-if="matchHistory?.length === 0">
			<p class="user-no-match-text">No recent matches.</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import MatchScore from "./MatchScore.vue"
import axios from 'axios';

interface MatchHistory {
	id: number,
	playerOne: {
		nickname: string,
		pseudo: string,
		profilPic: string,
	},
	playerTwo: {
		nickname: string,
		pseudo: string,
		profilPic: string,
	},
	scorePlayerOne: number,
	scorePlayerTwo: number,
	mode: number,
}

export default defineComponent({
	name: "MatchHistory",
	components: { MatchScore, },
	props: {
		pseudo: String,
	},
	updated()
	{
		console.log('match history :', this.matchHistory)
	},
	setup(props) {

		const matchHistory = ref<MatchHistory[]>();
		async function fetchData(pseudo: string | undefined)
		{
			let response;
			console.log('pseudo :', pseudo)
			if (pseudo)
			{
				response = await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/games/match-history/${pseudo}`, {withCredentials: true});
				console.log(response);
			}
			else
			response = await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/games/match-history/${props.pseudo}`, {withCredentials: true});
		
			matchHistory.value = response.data;
			matchHistory.value?.reverse();
			console.log(matchHistory);
		}
		onBeforeMount(async () => {
			fetchData(undefined);
		})
		return { matchHistory, fetchData };
	}
});
</script>

<style scoped>

.user-no-match-text {
	color: var(--plight);
	text-align: center;
}

</style>
