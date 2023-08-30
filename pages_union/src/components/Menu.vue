<template>
  <div class="navigation-menu">
    <div class="navigation-option profil-pic">
      <img :src="getImageUrl(profilPic)" alt="Image"/>
    </div>
    <div class="navigation-option" @click="goToMessages">
      <div class="messages-icon">
        <div class="line"></div>
        <div class="line"></div>
        <div class="queue"></div>
        <div class="line"></div>
      </div>
    </div>
    <div class="navigation-option option-circle" @click="goToRelations">
        <div class="horizontal-bar bar friend-bar"></div>
        <div class="vertical-bar bar friend-bar"></div>
        <div class="round-body head"></div>
        <div class="round-body body"></div>
    </div>
    <div class="navigation-option option-circle">
        <div class="hand-left"></div>
        <div class="hand-right"></div>
        <div class="pad"></div>
        <div class="horizontal-bar bar controller-bar"></div>
        <div class="vertical-bar bar controller-bar"></div>
        <div class="button top"></div>
        <div class="button left"></div>
        <div class="button right"></div>
        <div class="button bottom"></div>
    </div>

  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import axios from 'axios';
export default {
    name: 'Menu-component',
    data()
    {
      return {
        router: useRouter(),
        profilPic: String,
      }
    },
    async mounted()
    {
      this.profilPic = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/users/imageName`, {withCredentials: true})).data; // TODO change to real user page
    },
    methods: 
    {
      getImageUrl(imageName) 
      {
          return `http://${process.env.VUE_APP_IP}:3000/users/images/${imageName}`;
      },
      async goToMessages()
      {
        this.router.push({path: '/chat', query: { user: encodeURIComponent(JSON.stringify(this.user))}});
      },
      goToRelations()
      {
        this.router.push({path: '/relations', query: { user: encodeURIComponent(JSON.stringify(this.user))}});
      }
    }
}
</script>

<style>
.navigation-option .button.top
{
  margin-top: 2.2em;
  margin-left: 5.3em;
}

.navigation-option .button.bottom
{
  margin-top: 3.2em;
  margin-left: 5.3em;
}

.navigation-option .button.left
{
  margin-top: 2.7em;
  margin-left: 4.8em;
}

.navigation-option .button.right
{
  margin-top: 2.7em;
  margin-left: 5.8em;
}

.navigation-option .button
{
  position: absolute;
  height: 0.5em;
  width: 0.5em;
  border-radius: 50%;
  background-color: var(--pblack);
}

.horizontal-bar.controller-bar
{
  margin-left: 1.8em;
  margin-top: 2.7em;
}

.vertical-bar.controller-bar
{
  margin-left: 2.3em;
  margin-top: 2.2em;
}

.controller-bar
{
  background-color: var(--pblack);
}

.pad
{
  position: absolute;
  margin-left: 1.9em;
  width: 4.2em;
  height: 2.5em;
  margin-top: 1.8em;
  border-radius: 1em; 
  background-color: var(--pblue);
}

.hand-right
{
  position: absolute;
  margin-left: 5.25em;
  margin-top: 1.7em; 
  width: 1.5em;
  height: 4em;
  border-radius: 1em;
  background-color: var(--pblue);
  transform: rotate(-20deg);
}

.hand-left
{
  position: absolute;
  margin-left: 1.25em;
  margin-top: 1.7em; 
  width: 1.5em;
  height: 4em;
  border-radius: 1em;
  background-color: var(--pblue);
  transform: rotate(20deg);
}
.round-body
{
  position: absolute;
  border-radius: 50%;
  background-color: transparent;
  border: 0.4em solid var(--pblack);
}
.round-body.body
{
  width: 5em;
  height: 5em;
  margin-left: 1.1em;
  margin-top: 5em;
}

.round-body.head
{
  width: 2.5em;
  height: 2.5em;
  margin-left: 2.35em;
  margin-top: 2em;
}
.navigation-option.option-circle
{
  position: relative;
  height: 8em;
  width: 8em;
  background-color: var(--pdark);
  border-radius: 50%;
  overflow: hidden;
}
.friend-bar
{
  background-color: var(--pblue);
}
.bar
{
  position: absolute;
  border-radius: 1.5em;
  z-index: inf;
}
.horizontal-bar.friend-bar
{
  margin-left: 1.0em;
  margin-top: 2.0em;
}
.vertical-bar.friend-bar
{
  margin-left: 1.5em;
  margin-top: 1.5em;
}
.horizontal-bar
{
  height: 0.5em;
  width: 1.5em;
}
.vertical-bar
{
  height: 1.5em;
  width: 0.5em;
}

.navigation-menu
{
  background-color: var(--pblack);
  top: 0;
  bottom: 0;
  max-height: 100%;
  width: 10em;
  border: 0.1em solid var(--pblack);
  display: flex;
  flex-direction: column;
  align-items: center; 
  overflow: auto;
}

.navigation-option
{
  position: relative;
  margin-top: 2em;
  margin-bottom: 3.5em;
  flex-shrink: 0;
  justify-content: center;
  overflow: hidden; 
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.profil-pic
{
  width: 8em;
  height: 8em;
  border-radius: 50%;
}
.navigation-option img
{
  width: 100%;
  height: 100%;
}

.messages-icon
{
  display: flex;
  flex-direction: column;
  box-shadow: 0.4em 0.4em 1em var(--pblack);
  background-color: var(--pblue);
  height: 5em;
  width: 6em;
  border-radius: 1.5em;
  overflow: visible;
}

.messages-icon .line
{
  width: 4em;
  height: 0.4em;
  border-radius: 1.5em;
  background-color: var(--plight);
  display: flex;
  margin-bottom: 0.7em;
  margin-left: 1em;
  z-index: 9999;
}
.messages-icon .line:first-child
{
  margin-top: 1em;
}
.messages-icon .line:last-child
{
  width: 3em;
}

.messages-icon .queue
{
  position: absolute;
  background-color: transparent;
  margin-left: -0.85em;
  border-left: 1.2em solid transparent;
  border-right: 1.6em solid transparent;
  border-top: 2em solid var(--pblue);
}
.navigation-option:has(.messages-icon)
{
  overflow: visible;
}
</style>