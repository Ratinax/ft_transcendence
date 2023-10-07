<template>
	<div v-if="display" class="list-channels-container" ref="channelsButtons">
		<div class="list-channels">
			<channel 
				ref="channelRef"
				v-for="channel in channels" :key="channel.channel_id" 
				:channel="channel"
				:socket="socket" 
				:isSelected="channelSelected?.channel_id === channel.channel_id"
				:isUserOwner="channel.isUserOwner"
				@channel-clicked="handleChannelClicked"
				@leave-channel="onLeaveChannel"
				@update-channels="onUpdateChannels"
			/>
		</div>
		<div class="buttons" :class="{'nochannel': channels.length === 0}">
			<button 
				class="ft-button blue-button" 
				@click="showCreateChannel = true">
				Create Channel
			</button>
			<CreateChannel 
				:show="showCreateChannel"
				:sessionCookie="sessionCookie"
				:socket="socket"
				@close="showCreateChannel = false">
			</CreateChannel>
			<button 
				class="ft-button blue-button" 
				@click="showJoinChannel = true">
				Join Channel
			</button>
			<JoinChannel 
				:show="showJoinChannel" 
				:sessionCookie="sessionCookie" 
				:socket="socket" 
				ref='joinChannel'
				@close="showJoinChannel = false" >
			</JoinChannel>
		</div>
	</div>
</template>

<script lang="ts">
import Channel from './Channel.vue';
import CreateChannel from './CreateChannel.vue';
import JoinChannel from './JoinChannel.vue';
import axios from 'axios';
import { defineComponent } from 'vue';

interface ChannelData {
	channel_id: number,
	name: string,
	isUserOwner: boolean
}

export default defineComponent({
	name: 'ListChannels',
	components: {
		Channel,
		CreateChannel,
		JoinChannel,
	},
	props: 
	{
		sessionCookie: String,
		channelSelected: Object,
		socket: null,
		display: Boolean,
	},
	data() {
		return {
			channels: [] as Array<ChannelData>,
			showCreateChannel: false,
			showJoinChannel: false,
		}
	},
	mounted() 
	{
		this.fetchChannels();
	},
	methods: {
		async fetchChannels() {
			try 
			{
				const response = await axios.get(`http://${process.env.VUE_APP_IP}:3000/channels/`, {withCredentials: true});
				this.channels = response.data;
			} 
			catch (error) 
			{
				console.error('Failed to get channel liste', error);
				return ;
			}
			this.$nextTick(() => {
				this.updateScrollPosition();
			})
		},
		handleChannelClicked(channel: {channel_id: number}) 
		{
			for (let i = 0; i < (this.$refs.channelRef as Array<typeof Channel>).length; i++)
			{
				if ((this.$refs.channelRef as Array<typeof Channel>)[i] && (this.$refs.channelRef as Array<typeof Channel>)[i].getChannelId() === channel.channel_id)
				{
					(this.$refs.channelRef as Array<typeof Channel>)[i].unsetNotif();
					break ;
				}
			}
			this.$emit('channel-selected', channel);
		},
		updateScrollPosition()
		{
			if (this.$refs.channelsButtons)
			{
				(this.$refs.channelsButtons as HTMLElement).scrollTop = (this.$refs.channelsButtons as HTMLElement).scrollHeight;
			}
		},
		onLeaveChannel(channel: {channel_id: number, name: string})
		{
			this.$emit('leave-channel', channel);
		},
		onUpdateChannels()
		{
			this.fetchChannels();
		},
		pushNotifs(channel_id: number)
		{
			for (let i = 0; i < (this.$refs.channelRef as Array<typeof Channel>).length; i++)
			{
				if ((this.$refs.channelRef as Array<typeof Channel>)[i] && (this.$refs.channelRef as Array<typeof Channel>)[i].getChannelId() === channel_id)
				{
					(this.$refs.channelRef as Array<typeof Channel>)[i].setNotif();
					break ;
				}
			}
		}
	},
});
</script>

<style scoped>

.list-channels-container {
	height: fit-content;
	margin-right: 1em;
	background: var(--pdark);
	padding: 1em;
	border-radius: 1em;
	box-shadow: rgba(102, 252, 251, 0.4) 0px 2px 4px, rgba(102, 252, 251, 0.3) 0px 7px 13px -3px, rgba(102, 252, 251, 0.2) 0px -3px 0px inset;
	width: 25%;
	max-width: 15em;
	overflow: auto;
	animation: fadein .2s;
}

@keyframes fadein {
	from { 
		transform: translateX(-20px);
		opacity: 0;
	}
	to {
	transform: translateX(0px);
	opacity: 1;
	}
}

.list-channels {
	width: 100%;
	max-height: 42em;
	overflow-y: auto;
}

.buttons {
	margin-top: 1em;
	padding-top: .42em;
	border-top: 1px solid var(--plight);
}

button {
	font-size: .9em;
	width: 100%;
	margin-bottom: 1em;
}

@media only screen and (min-width: 700px) {
	.list-channels-container {
		display: block;
	}
}

@media only screen and (max-width: 700px) {
	.list-channels-container {
		position: absolute;
		width: 42%;
		left: .5em;
	}
}

</style>
