<template>
	<div class="pop-up-overlay" v-if="show" @click.self="close">
		<div class="pop-up">
			<div class="row range-slider-div">
				<label>Ball acceleration</label>
				<input type="range" min="5" max="500" class="range-slider" v-model="ballAccel">
				<input type="text" v-model="ballAccel">
			</div>
			<div class="range-slider-div">
				<label>Ball size</label>
				<input type="range" min="15" max="50" class="range-slider" v-model="ballSize">
				<input type="text" v-model="ballSize">
			</div>
			<div class="range-slider-div">
				<label>Ball speed</label>
				<input type="range" min="600" max="1500" class="range-slider" v-model="ballSpeed">
				<input type="text" v-model="ballSpeed">
			</div>
			<div class="range-slider-div">
				<label>Max angle</label>
				<input type="range" min="20" max="80" class="range-slider" v-model="maxAngle">
				<input type="text" v-model="maxAngle">
			</div>
			<div class="range-slider-div">
				<label>Player size</label>
				<input type="range" min="100" max="500" class="range-slider" v-model="playerSize">
				<input type="text" v-model="playerSize">
			</div>
			<div class="range-slider-div">
				<label>Player speed</label>
				<input type="range" min="600" max="3700" class="range-slider" v-model="playerSpeed">
				<input type="text" v-model="playerSpeed">

			</div>
			<div class="range-slider-div">
				<label>Score to win</label>
				<input type="range" min="1" max="21" class="range-slider" v-model="winScore">
				<input type="text" v-model="winScore">
			</div>
			<form class="buttons" @submit.prevent="inviteInGame">
				<button class="ft-button blue-button button-invite" type="submit">invite</button>
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'GameOptions',
	props: 
	{
		show: Boolean,
	},
	data()
	{
		return {
			ballAccel: 50,
			ballSize: 30,
			ballSpeed: 1200,
			maxAngle: 45,
			playerSize: 300,
			playerSpeed: 1300,
			winScore: 5,
		}
	},

	methods:
	{
		close()
	{
			this.$emit('close');
		},
		letsSee()
		{
			console.log(this.ballAccel);
		},
		inviteInGame()
	{
			this.ballAccel = 50;
			this.ballSize = 30;
			this.ballSpeed = 1200;
			this.maxAngle = 45;
			this.playerSize = 300;
			this.playerSpeed = 1300;
			this.winScore = 5;
			this.$emit('invite-in-game', {
				ballAccel: this.ballAccel,
				ballSize: this.ballSize,
				ballSpeed: this.ballSpeed,
				maxAngle: this.maxAngle,
				playerSize: this.playerSize,
				playerSpeed: this.playerSpeed,
				winScore: this.winScore
			});

		},
		handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				this.$emit('close');
			}
		}
	},
	mounted() {
		window.addEventListener('keydown', this.handleKeyDown);
	},
	beforeUnmount() {
		window.removeEventListener('keydown', this.handleKeyDown);
	}
});
</script>

<style scoped>

label {
	font-size: .9em;
}

.pop-up {
	max-width: none;
}

.buttons {
	display: flex;
}

.button-invite {
	margin: 0 auto;
}

input[type="text"]
{
	margin-left: 1em;
	text-align: center;
	left: 21em;
	width: 3em;
	color: var(--plight);
	border-radius: .5em;
	background-color: var(--pblack);
	box-shadow: 0 0 0.2em var(--pcyan);
}
.range-slider
{
	margin-left: auto;
}

.range-slider-div
{
	display: flex;
	align-items: center;
	margin-bottom: 1em;
}

.pop-up
{
	width: 20em;
	position: relative;
}

.range-slider-div label
{
	color: var(--plight);
	margin-right: 1em;
}
.range-slider-div span
{
	color: var(--plight);
	margin-left: .5em;

}
.range-slider {
	appearance: none;
	-webkit-appearance: none;
	width: 10em;
	height: 1em;
	border-radius: 1em;
	background: var(--plight);
	cursor: pointer;
	overflow: hidden;

}

.range-slider::-webkit-slider-thumb {
	-webkit-appearance: none;
	width: 1em;
	height: 1em;
	border-radius: 50%;
	background-color: var(--pcyan);
	cursor: pointer;
	-webkit-box-shadow: -20.5em 0 0 20em var(--pblue);
}

.range-slider::-moz-range-thumb {
	width: 1em;
	height: 1em;
	border-radius: 50%;
	background-color: var(--pcyan);
	cursor: pointer;
	box-shadow: -20.5em 0 0 20em var(--pblue);
}


</style>
