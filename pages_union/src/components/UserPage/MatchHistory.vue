<template>
	<MatchScore v-for="match in matchHistory"
		:key="match.id"
		:pseudo="userPseudo"
		:playerOneData="match.playerOne"
		:playerTwoData="match.playerTwo"
		:playerOneScore="match.scorePlayerOne"
		:playerTwoScore="match.scorePlayerTwo"></MatchScore>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import MatchScore from "./MatchScore.vue"
import axios from 'axios';

interface MatchHistory {
	id: number,
	playerOne: {
		pseudo: string,
		profilPic: string,
	},
	playerTwo: {
		pseudo: string,
		profilPic: string,
	},
	scorePlayerOne: number,
	scorePlayerTwo: number,
}

export default defineComponent({
	name: "MatchHistory",
	components: { MatchScore, },
	props: {
		pseudo: String,
	},
	setup(props) {

		const userPseudo = ref(props.pseudo);
		const matchHistory = ref<MatchHistory[]>();

		onBeforeMount(async () => {
			const response = await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/games/match-history/${props.pseudo}`, {withCredentials: true});

			matchHistory.value = response.data;
		})

		return { userPseudo, matchHistory };
	}
});
</script>

<style scoped>

</style>
