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
					@leave-channel="onLeaveChannel"/>
			</div>
			<div class= "messageszone">
				<Messages ref="messages" />
				<SendMessage 
					ref="sendMessage"
					:showContent="!!selectedChannel?.channel_id"
					:channelId="selectedChannel?.channel_id"
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


<script lang="ts">
import ListChannels from "../components/Chat/ListChannels.vue";
import ListUsersChat from "../components/Chat/ListUsersChat.vue";
import Messages from "../components/Chat/Messages.vue";
import SendMessage from "../components/Chat/SendMessage.vue";
import Menu from "../components/Menu.vue"
import { io } from 'socket.io-client';
import axios from 'axios';
import { defineComponent } from 'vue';


export default defineComponent({
	name: 'Chat-Page',
	components:
	{
		ListChannels,
		Messages,
		SendMessage,
		ListUsersChat,
		Menu,
	},
	data() {
		return {
			selectedChannel: undefined as {channel_id: number} | undefined,
			socket: null as any,
			sessionCookie: '',
		}
	},
	async mounted() {
		this.sessionCookie = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/sessions/cookies`, { withCredentials: true })).data;
		this.socket = io(`http://${process.env.VUE_APP_IP}:3001/`);
		this.socket.on('updateMessage', (response: {channel_id: number}) => {
			if (response.channel_id === this.selectedChannel?.channel_id)
			this.updateMessages();
		});
		this.socket.on('updateListChannels', async (response: {sessionCookie: string, channel: {channel_id: number}}) => {
			if (response.sessionCookie === this.sessionCookie)
				this.updateListChannels(response.channel);
		});
		this.socket.on('updateListUsers', (response: {channel: {channel_id: number}, users: Array<{id: number, isInvited: boolean, isOwner: boolean, isAdmin: boolean, isConnected: boolean, pseudo: string}>}) => {
			if (response.channel.channel_id === this.selectedChannel?.channel_id) {
				this.updateListUsers(response.users);
				this.setIsUserOwner(response.channel.channel_id);
			}
		});
		this.socket.on('updateAfterPart', async (response: {sessionCookie: string, channel: {channel_id: number}, users: Array<{id: number, isInvited: boolean, isOwner: boolean, isAdmin: boolean, isConnected: boolean, pseudo: string}>}) => {
			if (this.sessionCookie === response.sessionCookie) {
				this.updateListChannels(undefined);
				this.updateMessages();
				this.updateListUsers(null);
			}
			else if (response.channel.channel_id === this.selectedChannel?.channel_id) {
				this.updateListChannels(response.channel);
				this.updateListUsers(response.users);
			}
		});
		this.socket.on('sendMessageTimeout', async (response: {channel_id: number, duration: number, sessionCookie: string}) => {
			if (this.selectedChannel?.channel_id === response.channel_id && this.sessionCookie === response.sessionCookie)
			this.sendMessageTimeout(response.duration);
		});
		this.socket.on('sendMessageGoodRequest', async (response: {channel_id: number, sessionCookie: string}) => {
			if (this.selectedChannel?.channel_id === response.channel_id && this.sessionCookie === response.sessionCookie)
			this.sendMessageGoodRequest();
		});
	},
	methods:
	{
		/**
	 * 
	 * @param {Object} channel - Channel from which a user has entered or left
		*/
		updateListChannels(channel: {channel_id: number} | undefined){
			if (this.$refs.listChannels) {
				(this.$refs.listChannels as typeof ListChannels).fetchChannels();
				this.setSelectedChannel(channel);
				this.updateMessages();
			}
		},
		updateMessages() {
			if (this.$refs.messages)
				(this.$refs.messages as typeof Messages).updateMessages(this.selectedChannel);
		},
		onChannelSelected(channel: {channel_id: number}) {
			this.setSelectedChannel(channel);
			// this.updateListUsers();
			this.setIsUserOwner(channel.channel_id)
		},
		setSelectedChannel(channel: {channel_id: number} | undefined) {
			this.selectedChannel = channel;
			this.findUsersOfChannel()
			// this.$nextTick(() => {
			// 	this.
			// })
		},
		async createMessage(content: {channel_id: number, message: string, dateSent: Date, isAGameInvite: boolean}) {
			this.socket?.emit('createMessage', { ...content, sessionCookie: this.sessionCookie });
		},
		async findUsersOfChannel() {
			this.socket?.emit('findUsersOfChannel', { channel: this.selectedChannel, sessionCookie: this.sessionCookie });
		},
		/**
	 * 
	 * @param {List} users - the list of users of the selectedChannel 
		*/
		updateListUsers(users: Array<{id: number, isInvited: boolean, isOwner: boolean, isAdmin: boolean, isConnected: boolean, pseudo: string}> | null) {
			if (this.$refs.listUsersChat)
				(this.$refs.listUsersChat as typeof ListUsersChat).updateListUsers(users);
		},
		async onLeaveChannel(channel: {channel_id: number, name: string}) {
			this.socket?.emit('leaveChannel', { channel: channel, sessionCookie: this.sessionCookie })
		},
		setIsUserOwner(channel_id: number) {
			if (this.$refs.listUsersChat) {
				const result = (this.$refs.listUsersChat as typeof ListUsersChat).getUserInChannel();
				if (result)
				{
					(this.$refs.listChannels as typeof ListChannels).setIsUserOwner(result.isOwner, channel_id);
				}
				else
					console.log('res :', result)
			}
		},
		sendMessageTimeout(duration: number) {
			if (this.$refs.sendMessage)
				(this.$refs.sendMessage as typeof SendMessage).timeout(duration);
		},
		sendMessageGoodRequest() {
			if (this.$refs.sendMessage)
				(this.$refs.sendMessage as typeof SendMessage).goodRequest();
		},
	}
});

</script>

<style>

.chat-page {
	background: var(--pdark);
	height: 100vh;
}

.chat-container {
	width: 100%;
	margin: 2em 1em;
}

.messageszone {
	width: 45em; /* a changer */
	background: white;
	border-radius: 1em 0 1em 1em;
	border: 2px solid var(--pblue);
}

</style>

