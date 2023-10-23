<template>
	<div class="page-background"></div>
	<div class="double-fa-page">
		<div>
			<img :src="qrlink" id="qrcode-doublefa"/>
			<div id="numbers-input-container">
				<form  @submit.prevent="check2Fa">
					<div class="input-numbers">
					<input class="code" ref="digit1" v-model="digits[0]" placeholder="0" type="text"/>
					<input class="code" ref="digit2" v-model="digits[1]" placeholder="0" type="text"/>
					<input class="code" ref="digit3" v-model="digits[2]" placeholder="0" type="text"/>
					<input class="code" ref="digit4" v-model="digits[3]" placeholder="0" type="text"/>
					<input class="code" ref="digit5" v-model="digits[4]" placeholder="0" type="text"/>
					<input class="code" ref="digit6" v-model="digits[5]" placeholder="0" type="text"/>
				</div>
				<button class="invisible" type="submit"></button>
					<div class="fa-error-container">
					<Transition name="fa-error">
						<p class="fa-error-message" v-if="showErrorMessage">Bad 2FA code, please try again</p>
					</Transition>
				</div>
			</form>
			</div>
			<div id="loader"></div>
		</div>
	</div>
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router';
import qrcode from 'qrcode';
import axios from 'axios';
import { defineComponent } from 'vue';

export default defineComponent({
	name: "DoubleFa",
	props: {
	},
	data() {
		return {
			route: useRoute(),
			router: useRouter(),
			qrlink: '',
			timeLeft: 30,
			interValId: null as any,
			digits: ['', '', '', '', '', ''],
			showErrorMessage: false,
		}
	},
	mounted()
	{
		this.timeLeft = 30;
		let timeLeftString = localStorage.getItem('timeLeft');
		if (!timeLeftString)
			timeLeftString = '';
		let timeLeft;
		console.log(timeLeftString)
		if (timeLeftString === '')
			timeLeft = -1;
		else
			timeLeft = JSON.parse(timeLeftString);
		if (timeLeft && timeLeft > 0)
			this.timeLeft = timeLeft;
		else if (!timeLeft || timeLeft === -1)
			localStorage.setItem('timeLeft', JSON.stringify(30));

		const route = this.route as any;
		qrcode.toDataURL(route.params.link, (err, data) =>
			{
				if (err)
				console.error(err)
				else
				this.qrlink = data;
		})


		this.interValId = setInterval(() => {
			this.pingTimeLeft();
		}, 1000);

		// eslint-disable-next-line no-undef
		const codes = document.querySelectorAll(".code") as NodeListOf<HTMLInputElement>;
		codes[0].focus();

		const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

		console.log(codes);
		codes.forEach((code, index) => {
			code.addEventListener('keydown', (e: KeyboardEvent) => {
				if (digits.includes(e.key)) {
					code.value = '';
					if (index < 5)
						setTimeout(() => {
							codes[index + 1].disabled = false;
							codes[index + 1].focus()
						}, 10);
				}
				else if (e.key === 'Backspace') {
					code.value = '';
					setTimeout(() => {
						if (this.digits[index] === '' && index > 0)
							codes[index - 1].focus();
						this.digits[index] = '';
					}, 10)
				}
				else if (e.key === 'ArrowLeft' && index > 0)
				{
					setTimeout(() => {
							codes[index - 1].focus();
					}, 10)
				}
				else if (e.key === 'ArrowRight' && index < 5)
				{
					setTimeout(() => {
							codes[index + 1].focus();
					}, 10)
				}
			})
		})
	},

	methods:
	{
		async check2Fa()
		{
			const code = this.getCode(); 
			try
			{

				const res = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/verify2Fa/${code}`, {withCredentials: true})).data;
				if (res === true)
				{
					localStorage.setItem('timeLeft', JSON.stringify(0));
					clearInterval(this.interValId);
					this.router.replace({path: '/chat'});
				}
				else
				{
					this.showErrorMessage = true;
				}
			}
			catch (e)
			{
				console.error('Error :', e);
			}
		},
		async pingTimeLeft()
		{
			setTimeout(async () => 
				{
					try
					{
						const res = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/timeLeft2Fa/`, {withCredentials: true})).data;
						console.log(res);
						this.timeLeft--;
						const loader = document.getElementById('loader');
						if (loader)
							loader.style.background = `conic-gradient(
								transparent 0%,
								transparent ${(30 - this.timeLeft) * 3.333}%,
								#c5c6c7 ${(30 - this.timeLeft) * 3.333}%,
								#c5c6c7 100%`
						let timeLeft = (localStorage.getItem('timeLeft'));
						if (!timeLeft)
						timeLeft = '0';
						if (+timeLeft > 0)
							localStorage.setItem('timeLeft', JSON.stringify(this.timeLeft));
						if (res < 0)
						{
							localStorage.setItem('timeLeft', JSON.stringify(0));
							clearInterval(this.interValId);
							this.router.replace({path: '/'})
						}
					}
					catch (e)
					{
						console.error(e);
					}
			}, 1000)
		},
		getCode()
		{
			let res = '';
			for (let i = 0; i < this.digits.length; i++)
			{
				if (this.digits[i] === '')
					res += '0';
				else
					res += this.digits[i];
			}
			return (res);
		}
	}
})
</script>

<style scoped>
#numbers-input-container
{
	height: 3em;
}
.code
{
	caret-color: transparent;
}

.code:focus
{
	box-shadow: 0 4px 0 var(--pblue);
	height: 2.5em;
	margin-top: 0em;
	transition: height 200ms ease;
	transition: margin-top 200ms ease;
}

.double-fa-page
{
	display: flex;
	justify-content: center;
	padding-top: 10em;
}

#qrcode-doublefa
{
	margin-left: 6.5em;
}
.invisible
{
	display: none;
}
.input-numbers
{
	display: flex;
	justify-content: center;
	margin-top: 5em;
}
.input-numbers input
{
	box-shadow: 0 4px 0 grey;
	width: 2em;
	height: 2em;
	font-size: 1.5em;
	border-radius: 10%;
	text-align: center;
	margin: 0.25em;
}

.page-background
{
	z-index: -1;
}

#time-left-2fa
{
	color: var(--plight);
}

#loader {
	width: 5em;
	height: 5em;
	border-radius: 50%;
	margin-left: 9.5em;
	margin-top: 4em;
}

input:disabled {
	background: white;
	opacity: 0.7;
}

.fa-error-container {
	display: flex;
	justify-content: center;
	align-items: center;
}

.fa-error-message {
	position: absolute;
	margin-top: 2em;
	color: red;
}

.fa-error-enter-active,
.fa-error-leave-active {
	transition: all .42s ease;
}

.fa-error-enter-from,
.fa-error-leave-to {
	transform: translateY(10px);
	opacity: 0;
}

</style>
