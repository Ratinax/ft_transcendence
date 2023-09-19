<template>
	<div>
		<div 
			:class="{'selection-color' : isSelected}"
			@click="handleChannelClicked"
			>
			<div class="channel">
				<font-awesome-icon v-if="isUserOwner" class="icon own" icon="fa-solid fa-crown" />
				<font-awesome-icon v-else class="icon"
					:class="{own: isUserOwner}"
					icon="fa-regular fa-comments" />
				<p class="channel-name">
					{{ channel.name }}
				</p>
				<div class="option" v-if="isSelected">
					<div v-if="isUserOwner"
						class="icon setting"
						@click="setShowPasswordPopUp">
						<font-awesome-icon 
							v-if="passwordProtected"
							icon="fa-solid fa-lock"
							size="xs" />
						<font-awesome-icon 
							v-else
							icon="fa-solid fa-lock-open"
							size="xs" />
					</div>
					<font-awesome-icon
						class="icon cross"
						@click="leaveChannel" 
						icon="fa-solid fa-xmark" />
				</div>
			</div>
		</div>
	</div>
	<SetPassword 
		ref="SetPassword" 
		:show="showPasswordPopUp" 
		:isSet="passwordProtected" 
		@set-password="setPassword" 
		@change-password="changePassword" 
		@remove-password="removePassword"
		@close="closePasswordPopUp"/>
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
			isUserOwner: false,
			passwordProtected: false,
		}
	},
	emits: ['leave-channel', 'get-is-user-owner', 'channel-clicked', 'update-channels'],
	methods: {
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
				// this.passwordProtected = true; // a changer
				await axios.post(`http://${process.env.VUE_APP_IP}:3000/channels/changePassword`, 
					{
						channel: this.channel,
						password: password,
					},
					{
						withCredentials: true,
				});
				if (this.$refs.SetPassword) {
					this.$refs.SetPassword.goodRequest();
				}
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
				// this.passwordProtected = true; // a changer
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
				// this.passwordProtected = false; // a changer
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
		setShowPasswordPopUp()
		{
			this.showPasswordPopUp = true;
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
	width: 1em;
	height: 1em;
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
	align-items: center;
}

.cross:hover {
	color: red;
}

.setting:hover {
	color: blue;
}

.setting {
	display: flex;
	justify-content: center;
	align-items: center;
}

.cross:hover, .setting:hover {
	background: var(--plight);
}

.own {
	color: #bda400;
}

</style>
