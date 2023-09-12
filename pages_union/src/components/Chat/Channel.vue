<template>
	<div>
		<div 
			:class="{'selection-color' : isSelected}"
			@click="handleChannelClicked"
			>
			<div class="row channel">
				<font-awesome-icon class="icon" icon="fa-regular fa-comments" />
				<p class="channel-name">
					{{ channel.name }}
				</p>
				<div class="option" v-if="isSelected" @click="onSelectOption">
					<font-awesome-icon 
						class="icon setting"
						v-if="isUserOwner"
						icon="fa-solid fa-ellipsis-vertical" />
					<font-awesome-icon
						class="icon cross"
						@click="leaveChannel" 
						icon="fa-solid fa-xmark" />
				</div>
			</div>
		</div>
		<div class="options-list" v-if="isSelected && optionSelected">
			<p >Leave Channel</p>
			<div v-if="isUserOwner">
				<div v-if="channel.category === 'Protected by password'">
					<p  @click="setShowPasswordPopUp('change')">Change password</p>
					<p  @click="removePassword">Remove password</p>
				</div>
				<div v-else>
					<p  @click="setShowPasswordPopUp('set')">Set password</p>
				</div>
			</div>
		</div>
		<SetPassword ref="SetPassword" :show="showPasswordPopUp" :isChange="passwordPopUpType === 'change'" :isSet="passwordPopUpType === 'set'" @set-password="setPassword" @change-password="changePassword" @close="closePasswordPopUp"/>
		<div></div>
	</div>
</template>

<script>
import axios from 'axios';
import SetPassword from './SetPassword.vue';

export default {
	name: 'Channel-Component',
	components:
	{
		SetPassword,
	},
	props: 
	{
		channel: Object, 
		isSelected: Boolean,
		socket: null,
	},
	data()
{
		return {
			showPasswordPopUp: false,
			optionSelected: false,
			isUserOwner: false,
			passwordPopUpType: '',
		}
	},
	methods: {
		onSelectOption() 
		{
			this.optionSelected = !this.optionSelected;
			this.$emit('get-is-user-owner', this.channel.channel_id);
		},
		setIsUserOwner(result)
		{
			this.isUserOwner = result;
		},
		handleChannelClicked()
		{
			this.$emit('channel-clicked', this.channel);
		},
		leaveChannel()
		{
			this.$emit('leave-channel', this.channel);
		},
		async changePassword(password)
		{
			try
			{
				await axios.post(`http://${process.env.VUE_APP_IP}:3000/channels/changePassword`, 
					{
						channel: this.channel,
						password: password,
					},
					{
						withCredentials: true,
				});
				if (this.$refs.SetPassword)
				this.$refs.SetPassword.goodRequest();
				this.$emit('update-channels');
			}
			catch (e)
			{
				if (e.response.data.message === 'Password not good length' && this.$refs.SetPassword)
				this.$refs.SetPassword.notGoodLength()
			}
		},

		async setPassword(password)
		{
			try
			{
				await axios.post(`http://${process.env.VUE_APP_IP}:3000/channels/setPassword`, 
					{
						channel: this.channel,
						password: password,
					},
					{
						withCredentials: true,
				});
				if (this.$refs.SetPassword)
				this.$refs.SetPassword.goodRequest();
				this.$emit('update-channels');
			}
			catch (e)
			{
				if (e.response.data.message === 'Password not good length' && this.$refs.SetPassword)
				this.$refs.SetPassword.notGoodLength()
			}
		},
		async removePassword()
		{
			try
			{
				await axios.post(`http://${process.env.VUE_APP_IP}:3000/channels/removePassword`, 
					{
						channel: this.channel
					},
					{
						withCredentials: true,
				});
				this.$emit('update-channels');
			}
			catch (e)
			{
				console.error(e);
			}
		},
		setShowPasswordPopUp(content)
		{
			this.showPasswordPopUp = true;
			this.passwordPopUpType = content;
		},
		closePasswordPopUp()
		{
			this.showPasswordPopUp = false;
		}
	}
}
</script>

<style scoped>

.icon {
	padding: .2em;
	border-radius: .2em;
}

.channel
{
	display: flex;
	cursor: pointer;
	color: var(--pblack);
	padding: .5em;
	border-radius: .5em;
	background: white;
	margin-bottom: .5em;
	align-items: center;
}

.channel-name {
	margin-left: .2em;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
}

.option {
	margin-left: .2em;
	display: flex;
	justify-content: center;
}

.setting {
	padding: .2em .5em;
}

.cross:hover {
	color: red;
}

.setting:hover {
	color: blue;
}

.cross:hover, .setting:hover {
	background: var(--plight);
}

</style>
