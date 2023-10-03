<template>
	<div class="channel-list" ref="channelsButtons">
		<div class="channels-buttons">
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
			<div class="buttons" :class="{'nochannel': channels.length === 0}">
				<div class="new-channel">
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
				</div>
				<div class="join-channel">
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
		</div>
	</div>
</template>

<script lang="ts">
import Channel from './Channel.vue';
import CreateChannel from './CreateChannel.vue';
import JoinChannel from './JoinChannel.vue';
import axios from 'axios';
import { defineComponent } from 'vue';

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
	},
	data() {
		return {
			channels: [] as Array<{channel_id: number, name: string, isUserOwner: boolean}>,
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
				console.log(this.channels);
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

.channel-list {
	margin-right: 1em;
	background: linear-gradient(var(--pblack), var(--pdark));
	padding: 1em;
	border-radius: 1em;
	box-shadow: rgba(102, 252, 251, 0.4) 0px 2px 4px, rgba(102, 252, 251, 0.3) 0px 7px 13px -3px, rgba(102, 252, 251, 0.2) 0px -3px 0px inset;
	width: 13em;
	max-height: 97%;
	overflow: auto;
}

.buttons {
	margin-top: 2em;
}

button {
	font-size: .9em;
	width: 100%;
	margin-bottom: 1em;
}

</style>
