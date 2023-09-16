<template>
	<div class="row chat-page">
		<Menu />
		<div class="row chat-container">
			<div>
				<ListChannels ref="listChannels" 
					v-if="socket && sessionCookie" 
					:sessionCookie="sessionCookie"
					:channelSelected="selectedChannel" 
					:socket="socket" 
					@channel-selected="onChannelSelected"
					@leave-channel="onLeaveChannel" 
					@get-is-user-owner="onGetIsUserOwner" />
			</div>
			<div class= "messageszone">
				<Messages ref="messages" />
				<SendMessage 
					ref="sendMessage"
					:showContent="!!selectedChannel.channel_id"
					:channelId="selectedChannel.channel_id"
					:socket="socket"
					@create-message="createMessage" />
			</div>
			<ListUsersChat 
				ref="listUsersChat" 
				v-if="socket && sessionCookie" 
				:sessionCookie="sessionCookie"
				:channel="selectedChannel" 
				:socket="socket" />
		</div>
	</div>
</template>


<script>
import ListChannels from "../components/Chat/ListChannels.vue";
import ListUsersChat from "../components/Chat/ListUsersChat.vue";
import Messages from "../components/Chat/Messages.vue";
import SendMessage from "../components/Chat/SendMessage.vue";
import Menu from "../components/Menu.vue"
import { io } from 'socket.io-client';
import axios from 'axios';

export default {
	name: 'Chat-Page',
	components:
	{
		ListChannels,
		Messages,
		SendMessage,
		ListUsersChat,
		Menu,
	},
	props:
	{
	},
	data() {
		return {
			selectedChannel: {},
			socket: null,
			sessionCookie: '',
		}
	},
	async mounted() {
		this.sessionCookie = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true })).data;
		this.socket = io(`http://${process.env.VUE_APP_IP}:3001/`);
		this.socket.on('updateMessage', (response) => {
			if (response.channel_id === this.selectedChannel.channel_id)
			this.updateMessages();
		});
		this.socket.on('updateListChannels', async (response) => {
			if (response.sessionCookie === this.sessionCookie)
			this.updateListChannels(response.channel);
		});
		this.socket.on('updateListUsers', (response) => {
			if (response.channel.channel_id === this.selectedChannel.channel_id) {
				this.updateListUsers(response.users);
			}
		});
		this.socket.on('updateAfterPart', async (response) => {
			if (this.sessionCookie === response.sessionCookie) {
				this.updateListChannels({});
				this.updateMessages();
				this.updateListUsers(null);
			}
			else if (response.channel.channel_id === this.selectedChannel.channel_id) {
				this.updateListChannels(response.channel);
				this.updateListUsers(response.users);
			}
		});
		this.socket.on('sendMessageTimeout', async (response) => {
			if (this.selectedChannel.channel_id === response.channel_id && this.sessionCookie === response.sessionCookie)
			this.sendMessageTimeout(response.duration);
		});
		this.socket.on('sendMessageGoodRequest', async (response) => {
			if (this.selectedChannel.channel_id === response.channel_id && this.sessionCookie === response.sessionCookie)
			this.sendMessageGoodRequest();
		});
	},
	methods:
	{
		/**
	 * 
	 * @param {Object} channel - Channel from which a user has entered or left
		*/
		updateListChannels(channel) {
			if (this.$refs.listChannels) {
				this.$refs.listChannels.fetchChannels();
				this.setSelectedChannel(channel);
				this.updateMessages();
			}
		},
		updateMessages() {
			if (this.$refs.messages)
			this.$refs.messages.updateMessages(this.selectedChannel);
		},
		onChannelSelected(channel) {
			this.setSelectedChannel(channel);
			this.updateMessages();
		},
		setSelectedChannel(channel) {
			this.selectedChannel = channel;
			this.findUsersOfChannel()
		},
		async createMessage(content) {
			this.socket.emit('createMessage', { ...content, sessionCookie: this.sessionCookie });
		},
		async findUsersOfChannel() {
			this.socket.emit('findUsersOfChannel', { channel: this.selectedChannel, sessionCookie: this.sessionCookie });
		},
		/**
	 * 
	 * @param {List} users - the list of users of the selectedChannel 
		*/
		updateListUsers(users) {
			if (this.$refs.listUsersChat)
			this.$refs.listUsersChat.updateListUsers(users);
		},
		async onLeaveChannel(channel) {
			this.socket.emit('leaveChannel', { channel: channel, sessionCookie: this.sessionCookie })
		},
		onGetIsUserOwner(channel_id) {
			if (this.$refs.listUsersChat) {
				const result = this.$refs.listUsersChat.getUserInChannel();
				if (result)
				this.$refs.listChannels.setIsUserOwner(result.isOwner, channel_id);
			}
		},
		sendMessageTimeout(duration) {
			if (this.$refs.sendMessage)
			this.$refs.sendMessage.timeout(duration);
		},
		sendMessageGoodRequest() {
			if (this.$refs.sendMessage)
			this.$refs.sendMessage.goodRequest();
		},
	}
}

</script>

<style>

.chat-page {
	background: var(--pdark);
	height: 100vh;
}

.chat-container {
	width: 100%;
	margin: 2em 0;
}

.messageszone {
	width: 45em; /* a changer */
	background: white;
	border-radius: 1em 0 1em 1em;
	border: 2px solid var(--pblue);
}

</style>

