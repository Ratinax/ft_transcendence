<template>
  <div class="message">
    <p v-if="!isAGameInvite">{{ username }} : {{  content }}</p>
    <div v-else>
      <span class="user-inviting">{{ username }} &nbsp;</span>
      <p class="invitation-game" @click="joinGame">Invited you to do a game to join click here</p>
    </div>
  </div>
</template>

<script>
export default {
    name: "Message-Component",
    props: {
        username: String,
        content: String,
        isAGameInvite: Boolean,
    },
    methods: 
    {
      joinGame()
      {
        console.log('Feature incoming')
        // TODO faire un emit de demarrage de game pour que le user du message et le user s'affrontent (sauf si c'est la meme personne)
      }
    }
}
</script>

<style>
.invitation-game
{
  cursor: pointer;
  display: inline;
  color: green;
}
.invitation-game:hover
{
  text-decoration: underline;
}
.user-inviting{
  display: inline;
}
.message p
{
  margin-bottom: 0.8em;
}
.message div
{
  margin-bottom: 0.8em;
}
</style>