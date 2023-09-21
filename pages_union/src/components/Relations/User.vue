<template>
    <div class="user">
        <div class="round-image">
            <img :src="profilPic" alt="Image"/>
        </div>
        <span class="pseudo"> {{ user?.pseudo }}</span>
        <div class="green circle" v-if="user?.isConnected"></div>
        <div class="red circle" v-else></div>
        <div v-if="isARequest">
            <div class="box arrow" @click="accept"></div>
        </div>
        <div class="box cross" @click="remove"></div>
    </div>
</template>

<script lang="ts">

import axios from 'axios';
import { defineComponent, registerRuntimeCompiler } from 'vue';


export default defineComponent({
    name: 'User-Component',
    props: 
    {
        user: Object,
        isARequest: Boolean,
    },
    data()
    {
        return {
            profilPic: '',
        }
    },
    async mounted()
	{
		this.profilPic = (await axios.get(`http://${process.env.VUE_APP_IP}:3000/users/imageNamePseudo/${this.user?.pseudo}`, {withCredentials: true})).data;
	},
    methods: 
    {
        accept()
        {
            this.$emit('accept-friendship', this.user?.id);
        },
        remove()
        {
            this.$emit('remove-relation', this.user?.id);
        },
    }
});
</script>

<style>

.pseudo
{
    padding-left: 0.4em;
    font-size: 4em;
}

.user
{
    padding-left: 0.4em;
    display: flex;
    flex-direction: align;
    align-items: center;
}

.round-image 
{
    width: 4em; 
    height: 4em; 
    border-radius: 50%; 
    overflow: hidden; 
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0.04em solid black;
    flex-shrink: 0;
}

.round-image img 
{
  width: 100%;
  height: auto; 
}

.box 
{
    position: relative;
    width: 2em;
    height: 2em;
    background-color: #f0f0f0;
    border: 0.1em solid #ccc;
    justify-content: center;
    align-items: center;
    font-size: 1.5em;
    color: #333;
    margin-left: 1em;
    display: inline-flex;
    cursor: pointer;
    flex-shrink: 0;
}

.box.arrow::after 
{
    content: "\2714";
}

.box.cross::after 
{
    content: "✖";
}
</style>