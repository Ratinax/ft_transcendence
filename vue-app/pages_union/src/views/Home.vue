<template>
	<div class="col log-in-page">
		<div class="col log-box">
			<div class="log-mode">
				<h1 class="log-text">
					<Transition name="fadeTitle" mode="out-in">
						<span v-if="!register">SIGN IN</span>
						<span v-else>SIGN UP</span>
					</Transition>
				</h1>
			</div>
			<Transition name="fade" mode="out-in">
				<component :is="activeComponent"></component>
			</Transition>
			<div class="log-footer">
				<span v-if="!register">No account yet</span>
				<span v-else>Already have an account</span>
				?
				<span class="sign-up-text" @click="changeMode">Sign {{ logMode }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, shallowRef } from 'vue';
import SignIn from '../components/Log/SignIn.vue';
import SignUp from '../components/Log/SignUp.vue';

export default defineComponent({
	name: 'HomeView',
	components: { SignIn, SignUp },
	setup() {
		const activeComponent = shallowRef<typeof SignIn | typeof SignUp>(SignIn);
		const register = ref(false);
		const logMode = ref("up");

		function	changeMode() {
			activeComponent.value = activeComponent.value === SignUp ? SignIn : SignUp;
			register.value = !register.value;
			logMode.value = logMode.value === "up" ? "in" : "up";
		}

		return {  changeMode, activeComponent, register, logMode };
	}
});
</script>

<style src="../assets/global.css" rel="stylesheet" lang="css"></style>

<style>

.log-in-page {
	background: linear-gradient(45deg, var(--pblack), var(--pdark));
	justify-content: center;
	align-items: center;
	height: 100vh;
	text-align: center;
	width: 100%;
}

.log-box {
	background: linear-gradient(white, var(--plight));
	border-radius: 1em;
	width: 500px;
	padding: 1em 1em 2em 1em;
}

.log-mode {
	font-size: 120%;
	margin: 1em 0 1em 0;
}

.log-text {
	display: inline;
	color: var(--pdark);
	padding: 0 0.3em;
	border-bottom: 1px solid lightgrey;
}

.log-footer {
	padding-top: 1.4em;
	font-size: 0.9em;
}

.log-footer .sign-up-text {
	color: var(--pblue);
}

.sign-up-text:hover {
	cursor: pointer;
	color: var(--pcyan);
}

.fade-enter-active,
.fade-leave-active {
	transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateX(-40px);
}

.fadeTitle-enter-active,
.fadeTitle-leave-active {
	transition: all 0.5s ease;
}

.fadeTitle-enter-from,
.fadeTitle-leave-to {
	opacity: 0;
}

@media screen and (max-width: 550px){
	.log-box {
		width: 80%;
	}
}

</style>
