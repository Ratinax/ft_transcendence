<template>
    <div v-if="show">

        <div class="page-background"></div>
        <div @click.self="quit" class="pop-up-overlay">
        <div class="pop-up">

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
    </div>
</div>
</div>
</div>
</div>
</template>

<script lang="ts">
import qrcode from 'qrcode';
import axios from 'axios';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "DoubleFaCheck",
    props: {
        show: Boolean,
        qrUrl: String,
    },
	data() {
		return {
			qrlink: '',
			digits: ['', '', '', '', '', ''],
			showErrorMessage: false,
		}
	},

	methods:
	{
		async check2Fa()
		{
			const code = this.getCode(); 
			try
			{

				const res = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/users/validate2fa/${code}`, {withCredentials: true})).data;
				if (res === true)
                    this.close(true);
				else
					this.showErrorMessage = true;
			}
			catch (e)
			{
				console.error('Error :', e);
			}
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
		},
        getQRCode()
        {
            const qrCodeUrl = this.qrUrl;
            if (qrCodeUrl)
            {
                qrcode.toDataURL(qrCodeUrl, (err, data) =>
                {
                    if (err)
                        console.error(err)
                    else
                        this.qrlink = data;
                })
            }
            // eslint-disable-next-line no-undef
			const codes = document.querySelectorAll(".code") as NodeListOf<HTMLInputElement>;
			if (codes && codes[0])
				codes[0].focus();

			const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

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
        quit()
        {
            this.$emit('quit-2fa')
            this.close(false);
        },
        close(is2fa: boolean)
        {
            this.digits = ['', '', '', '', '', ''];
            this.$emit('close', is2fa);
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

</style>
