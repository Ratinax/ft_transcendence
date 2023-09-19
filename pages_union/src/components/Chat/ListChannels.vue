<template>
	<div class="channel-list" ref="channelsButtons">
		<div class="channels-buttons">
			<channel 
				ref="channelRef"
				v-for="channel in channels" :key="channel.id" 
				:channel="channel"
				:socket="socket" 
				:isSelected="channelSelected.channel_id === channel.channel_id"
				@channel-clicked="handleChannelClicked"
				@leave-channel="onLeaveChannel"
				@update-channels="onUpdateChannels"
			/>
			<div class="buttons" :class="{'nochannel': channels.length === 0}">
				<div class="new-channel">
					<button 
						class="ft-button" 
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
						class="ft-button green-button" 
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

<script>
import Channel from './Channel.vue';
import CreateChannel from './CreateChannel.vue';
import JoinChannel from './JoinChannel.vue';
import axios from 'axios';

export default {
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
			channels: [],
			showCreateChannel: false,
			showJoinChannel: false,
		}
	},
	created() 
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
		addChannel(channel)
		{
			this.channels.push(channel)
			this.$nextTick(() => {
				this.updateScrollPosition()
			})
		},
		handleChannelClicked(channel) 
		{
			this.$emit('channel-selected', channel);
		},
		updateScrollPosition()
		{
			if (this.$refs.channelsButtons)
			{

				const container = this.$refs.channelsButtons;

				container.scrollTop = container.scrollHeight;
			}
		},
		onLeaveChannel(channel)
		{
			this.$emit('leave-channel', channel);
		},
		setIsUserOwner(result, channel_id)
		{
			console.log('call')
			for (let i = 0; i < this.$refs.channelRef.length; i++)
			{
				if (this.$refs.channelRef[i] && this.$refs.channelRef[i].channel.channel_id === channel_id)
				{
					this.$refs.channelRef[i].setIsUserOwner(result);
					break ;
				}
			}
			console.log('result :', result)
		},
		onUpdateChannels()
		{
			this.fetchChannels();
		}
	},
}
</script>

<style scoped>

.channel-list {
	margin-right: 1em;
	margin-left: 2em;
	background: var(--pblack);
	padding: 1em;
	border-radius: 1em;
	border: 2px solid var(--pcyan);
	width: 13em;
}

.buttons {
	margin-top: 2em;
}

button {
	background: var(--pcyan);
	box-shadow: 0 4px 0 var(--pblue);
	font-size: .9em;
	width: 100%;
	text-wrap: nowrap;
	margin-bottom: 1em;
}

</style>
