<template>
	<div v-if="!channel?.isHide">
		<div @click="handleChannelClicked">
			<div class="channel">
				<font-awesome-icon v-if="isUserOwner" class="icon own" icon="fa-solid fa-crown" />
				<font-awesome-icon v-else class="icon"
					:class="{own: isUserOwner}"
					icon="fa-regular fa-comments" />
				<p class="channel-name">
					{{ channel?.name }}
				</p>
				<div class="option" v-if="isSelected">
					<div :class="{'icon': true, 'setting': true, 'private': (isPrivate), 'is-owner': isUserOwner}"
						@click="setShowPasswordPopUp">
						<font-awesome-icon 
							v-if="passwordProtected"
							icon="fa-solid fa-lock"
							size="xs" />
						<font-awesome-icon 
							v-else-if="isPrivate"
							icon="fa-solid fa-lock"
							size="xs"/>
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
					<font-awesome-icon
						v-if="!isSelected"
						class="icon cross crosshover"
						@click="leaveChannel" 
						icon="fa-solid fa-xmark" />
			</div>
		</div>
	</div>
	<SetPassword 
		ref="SetPassword" 
		:show="showPasswordPopUp" 
		:isSet="passwordProtected"
		:isPrivate="isPrivate"
		@set-password="setPassword" 
		@change-password="changePassword" 
		@go-public="goPublic"
		@go-private="goPrivate"
		@close="closePasswordPopUp"/>
</template>

<script lang="ts">
import axios from 'axios';
import SetPassword from './SetPassword.vue';
import { defineComponent } from 'vue';

export default defineComponent({
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
		isUserOwner: Boolean,
	},
	data()
	{
		return {
			showPasswordPopUp: false,
			passwordProtected: false,
			isPrivate: false,
			leave: false,
		}
	},
	emits: ['leave-channel', 'channel-clicked', 'update-channels'],
	async mounted()
	{
		this.isPrivate = false;
		this.passwordProtected = false;
		const res = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/channels/category/${this.channel?.name}`, 
					{
						withCredentials: true,
					}
					)).data;
		if (res === 'Protected by password')
			this.passwordProtected = true;
		else if (res === 'Private')
			this.isPrivate = true;
	},
	methods: {
		handleChannelClicked()
		{
			if (!this.leave)
				this.$emit('channel-clicked', this.channel);
			this.leave = false;
		},
		leaveChannel()
		{
			this.leave = true;
			this.$emit('leave-channel', this.channel);
		},
		async changePassword(password: string)
		{
			try
			{
				await axios.post(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/channels/changePassword`, 
					{
						channel: this.channel,
						password: password,
					},
					{
						withCredentials: true,
					});
				if (this.$refs.SetPassword) {
					(this.$refs.SetPassword as typeof SetPassword).goodRequest();
				}
				this.passwordProtected = true;
				this.isPrivate = false;
				this.$emit('update-channels');
			}
			catch (error: Error | any)
			{
				if (error && error.response && error.response.data && error.response.data.message)
				{
					if (error.response.data.message === 'Password not good length' && this.$refs.SetPassword)
						(this.$refs.SetPassword as typeof SetPassword).notGoodLength()
				}
				else if (this.$refs.SetPassword)
					(this.$refs.SetPassword as typeof SetPassword).servorError()

			}
		},

		async setPassword(password: string)
		{
			try
			{
				await axios.post(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/channels/setPassword`, 
					{
						channel: this.channel,
						password: password,
					},
					{
						withCredentials: true,
				});
				this.passwordProtected = true;
				this.isPrivate = false;
				if (this.$refs.SetPassword)
					(this.$refs.SetPassword as typeof SetPassword).goodRequest();
				this.$emit('update-channels');
			}
			catch (error: Error | any | undefined)
			{
				if (error && error.response && error.response.data && error.response.data.message)
				{

					if (error.response.data.message === 'Password not good length' && this.$refs.SetPassword)
						(this.$refs.SetPassword as typeof SetPassword).notGoodLength()
				}
				else if (this.$refs.SetPassword)
					(this.$refs.SetPassword as typeof SetPassword).servorError()
			}
		},
		async goPublic()
		{
			try
			{
				await axios.post(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/channels/toPublic`, 
					{
						channel: this.channel
					},
					{
						withCredentials: true,
					});
				this.passwordProtected = false;
				this.isPrivate = false;
				if (this.$refs.SetPassword)
					(this.$refs.SetPassword as typeof SetPassword).goodRequest();
				this.$emit('update-channels');
			}
			catch (e)
			{
				void e;
			}
		},
		async goPrivate()
		{
			try
			{
				await axios.post(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/channels/toPrivate`, 
					{
						channel: this.channel
					},
					{
						withCredentials: true,
					});
				if (this.$refs.SetPassword)
					(this.$refs.SetPassword as typeof SetPassword).goodRequest();
				this.passwordProtected = false;
				this.isPrivate = true;
				this.$emit('update-channels');
			}
			catch (e)
			{
				void e
			}
		},
		setShowPasswordPopUp()
		{
			if (this.isUserOwner)
				this.showPasswordPopUp = true;
		},
		closePasswordPopUp()
		{
			this.showPasswordPopUp = false;
		},
		getChannelId()
		{
			return (this.channel?.channel_id)
		},
	}
});
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
	overflow: hidden;
	text-overflow: ellipsis;
}

.option {
	margin-left: auto;
	display: flex;
	align-items: center;
}

.cross:hover {
	color: red;
}

.channel:hover .crosshover {
	display: block;
}

.crosshover {
	margin-left: auto;
	display: none;
}

.setting.is-owner:hover {
	color: blue;
}

.setting {
	display: flex;
	justify-content: center;
	align-items: center;
}

.cross:hover, .setting.is-owner:hover {
	background: var(--plight);
}
.private
{
	color:red;
}

.own {
	color: #bda400;
}

</style>
