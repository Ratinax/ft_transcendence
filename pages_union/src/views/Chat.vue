<template>
	<Menu />
	<div class="page-background"></div>
	<div class="row chat-page view">
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
					v-if="socket && sessionCookie"
					ref="sendMessage"
					:showContent="!!selectedChannel?.channel_id"
					:channelId="selectedChannel?.channel_id"
					:socket="socket"
					:sessionCookie="sessionCookie"/>
			</div>
			<ListUsersChat
				ref="listUsersChat" 
				v-if="socket && sessionCookie" 
				:sessionCookie="sessionCookie"
				:channel="selectedChannel" 
				:socket="socket"/>
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
			selectedChannel: undefined as {channel_id: number, name: string, isUserOwner: boolean} | undefined,
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
		this.socket.on('updateListChannels', async (response: {sessionCookie: string, channel: {channel_id: number, name: string, isUserOwner: boolean}}) => {
			if (response.sessionCookie === this.sessionCookie)
				this.updateListChannels(response.channel);
		});
		this.socket.on('updateListUsers', (response: {channel: {channel_id: number}, users: Array<{id: number, isOwner: boolean, isAdmin: boolean, isConnected: boolean, pseudo: string}>}) => {
			if (response.channel.channel_id === this.selectedChannel?.channel_id) {
				this.updateListUsers(response.users);
			}
		});
		this.socket.on('updateAfterPart', async (response: {sessionCookie: string, channel: {channel_id: number, name: string}, users: Array<{id: number, isOwner: boolean, isAdmin: boolean, isConnected: boolean, pseudo: string}>}) => {
			if (!response)
				return ;
			if (this.sessionCookie === response.sessionCookie && response.channel.channel_id === this.selectedChannel?.channel_id) {
				this.updateListChannels(undefined);
				this.updateListUsers(null);
			}
			else if (this.sessionCookie === response.sessionCookie)
			{
				this.updateListChannels(this.selectedChannel);
			}
			else if (response.channel.channel_id === this.selectedChannel?.channel_id) {
				this.updateListUsers(response.users);
			}
		});
		this.socket.on('sendMessageGoodRequest', async (response: {channel_id: number, sessionCookie: string}) => {
			this.refreshSendMessageBar();
			this.updateMessages();
			if (!this.selectedChannel || this.selectedChannel?.channel_id !== response.channel_id)
				(this.$refs?.listChannels as typeof ListChannels)?.pushNotifs(response.channel_id);
		});
	},
	methods:
	{
		/**
		* 
		* @param {Object} channel - Channel from which a user has entered or left
		*/
		updateListChannels(channel: {channel_id: number, name: string, isUserOwner: boolean} | undefined){
			if (this.$refs.listChannels) {
				(this.$refs.listChannels as typeof ListChannels).fetchChannels();
				this.setSelectedChannel(channel);
			}
		},
		updateMessages() {
			if (this.$refs.messages)
				(this.$refs.messages as typeof Messages).updateMessages(this.selectedChannel);
		},
		onChannelSelected(channel: {channel_id: number, name: string, isUserOwner: boolean}) {
			this.setSelectedChannel(channel);
		},
		setSelectedChannel(channel: {channel_id: number, name: string, isUserOwner: boolean} | undefined) {
			this.selectedChannel = channel;
			this.findUsersOfChannel();
			this.updateMessages();
			this.refreshSendMessageBar();
		},

		async findUsersOfChannel() {
			this.socket?.emit('findUsersOfChannel', { channel: this.selectedChannel, sessionCookie: this.sessionCookie });
		},
		/**
		 * 
		 * @param {Array} users - the list of users of the selectedChannel 
		*/
		updateListUsers(users: Array<{id: number, isOwner: boolean, isAdmin: boolean, isConnected: boolean, pseudo: string}> | null) {
			if (this.$refs.listUsersChat)
				(this.$refs.listUsersChat as typeof ListUsersChat).updateListUsers(users);
		},
		async onLeaveChannel(channel: {channel_id: number, name: string}) {
			this.socket?.emit('leaveChannel', { channel: channel, sessionCookie: this.sessionCookie })
		},
		refreshSendMessageBar() {
			if (this.$refs.sendMessage)
				(this.$refs.sendMessage as typeof SendMessage).refreshBar();
		},
	}
});

</script>

<style>

.page-background {
	background: linear-gradient(45deg, var(--pblack), var(--pdark));
}

.chat-container {
	width: 100%;
	justify-content: center;
	margin: 2em 1em;
}

.chat-page {
	height: 100vh;
}

.messageszone {
	width: 40em;
	background: white;
	border-radius: 1em 0 1em 1em;
	border: 2px solid var(--pblue);
		/* TODO check if we put overflow: auto; */ 
}

</style>

