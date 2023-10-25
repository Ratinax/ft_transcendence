<template>
	<div>
		<Menu :page="'Chat'"/>
		<div class="page-background"></div>
		<div class="row chat-page view">
			<div class="row chat-container">
				<ListChannels 
					ref="listChannels" 
					v-if="socket && sessionCookie && displayListChannels" 
					:sessionCookie="sessionCookie"
					:channelSelected="selectedChannel" 
					:socket="socket" 
					@channel-selected="onChannelSelected"
					@leave-channel="onLeaveChannel"
					:display="displayListChannels"/>
				<div class= "messageszone">
					<Messages v-if="socket && sessionCookie" ref="messages" :socket="socket" :sessionCookie="sessionCookie" />
					<SendMessage
						v-if="socket && sessionCookie"
						ref="sendMessage"
						:showContent="!!selectedChannel?.channel_id"
						:channelId="selectedChannel?.channel_id"
						:channelName="selectedChannel?.name"
						:socket="socket"
						:sessionCookie="sessionCookie"/>
				</div>
				<ListUsersChat
					ref="listUsersChat" 
					v-if="socket && sessionCookie" 
					:sessionCookie="sessionCookie"
					:channel="selectedChannel" 
					:socket="socket"
					:display="displayUsersChat"
				/>
			</div>
			<div class="chat-button-container">
				<button class="ft-button blue-button button-left" @click.prevent="toggleChannels">channels</button>
				<button class="ft-button blue-button button-right" @click.prevent="toggleUsers">users</button>
			</div>
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

interface messageData {
  id: number,
  user: {pseudo: string},
  content: string,
  isAGameInvite: boolean,
  isSender: boolean,
}

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
			showChannels: false,
			showUsers: false,
			windowWidth: window.innerWidth,
			displayUsersChat: true,
			displayListChannels: true,
		}
	},
	async mounted() {
		window.addEventListener('resize', this.handleResize);
		this.sessionCookie = (await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/sessions/cookies`, { withCredentials: true })).data;
		this.socket = io(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_PORT}/chat`);
		this.socket.on('addMessage', (response: {message: messageData}) => {
			this.addMessage(response.message);
		});
		this.socket.on('updateListChannels', async (response: {channel: {channel_id: number, name: string, isUserOwner: boolean}}) => {
			console.log('update')
			this.updateListChannels(response.channel);
		});
		this.socket.on('updateListUsers', (response: {users: Array<{id: number, isOwner: boolean, isAdmin: boolean, isConnected: boolean, pseudo: string}>}) => {
			this.updateListUsers(response.users);
		});
		this.socket.on('updateAfterPart', async (response: {sessionCookie: string, channel: {channel_id: number, name: string}, users: Array<{id: number, isOwner: boolean, isAdmin: boolean, isConnected: boolean, pseudo: string}>}) => {
			if (this.sessionCookie === response.sessionCookie) {
				this.updateListChannels(undefined);
				this.updateListUsers(null);
			}
			else {
				this.updateListUsers(response.users);
			}
		});
		this.socket.on('sendMessageGoodRequest', async (response: {channel_id: number}) => {
			this.refreshSendMessageBar();
			if (!this.selectedChannel || this.selectedChannel?.channel_id !== response.channel_id)
				(this.$refs?.listChannels as typeof ListChannels)?.pushNotifs(response.channel_id);
		});
		this.socket.on('removeMessage', async (response: {channel_id: number, message_id: number}) => {
			this.removeMessage(response.message_id);
		});
	},
	methods:
	{
		handleResize() {
			this.windowWidth = window.innerWidth;
		},
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
		addMessage(message: messageData) {
			if (this.$refs.messages)
				(this.$refs.messages as typeof Messages).addMessage(message);
		},
		removeMessage(message_id: number)
		{
			if (this.$refs.messages)
				(this.$refs.messages as typeof Messages).removeMessage(message_id);
		},
		fetchMessages() {
			if (this.$refs.messages)
				(this.$refs.messages as typeof Messages).updateMessages(this.selectedChannel);
		},
		onChannelSelected(channel: {channel_id: number, name: string, isUserOwner: boolean}) {
			this.setSelectedChannel(channel);
		},
		setSelectedChannel(channel: {channel_id: number, name: string, isUserOwner: boolean} | undefined) {
			console.log('set selected')
			if (this.selectedChannel)
				this.socket.emit('leaveRoom', {channelName: this.selectedChannel.name, sessionCookie: this.sessionCookie});
			if (channel)
				this.socket.emit('joinRoom', {channelName: channel.name, sessionCookie: this.sessionCookie});
			let fetchMessages = true;
			if (this.selectedChannel === channel)
				fetchMessages = false;
			this.selectedChannel = channel;
			this.findUsersOfChannel();
			if (fetchMessages)
				this.fetchMessages();
			this.refreshSendMessageBar();
		},

		async findUsersOfChannel() {
			console.log('ca emit bien')
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

		toggleUsers() {
			this.displayUsersChat = !this.displayUsersChat;
		},
		toggleChannels() {
			this.displayListChannels = !this.displayListChannels;
		},
	},
	watch: {
		windowWidth(newWidth) {
			this.displayListChannels = this.displayUsersChat = newWidth > 700;
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
	margin: 2em 1em 0 1em;
}

.chat-page {
	height: 100%;
}

.messageszone {
	width: 50%;
	transition: width 200ms ease;
	max-width: 42em;
	min-width: 340px;
	padding: .1em;
	background: white;
	border-radius: 1em 0 1em 1em;
	border: 2px solid var(--pblack);
	height: 85vh;
}

.chat-button-container {
	display: none;
	font-size: .7em;
	margin-top: 1em;
	justify-content: space-around;
}

@media screen and (max-width: 700px) {
	.chat-container {
		margin: 2em 0 0 0;
	}

	.chat-page {
		flex-direction: column;
	}

	.messageszone {
		width: 90%;
		height: 65vh;
	}

	.chat-button-container {
		display: flex;
	}
}

</style>

