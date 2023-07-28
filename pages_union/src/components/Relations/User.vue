<template>
    <div class="user">
        <div class="round-image">
            <img :src="getImageUrl(user.profilPic)" alt="Image"/>
        </div>
        <span class="pseudo"> {{ user.pseudo }}</span>
        <div class="green circle" v-if="user.isConnected"></div>
        <div class="red circle" v-else></div>
        <div v-if="isARequest">
            <div class="box arrow" @click="accept"></div>
        </div>
        <div class="box cross" @click="remove"></div>
    </div>
</template>

<script>
export default {
    name: 'User-Component',
    props: 
    {
        user: Object,
        isARequest: Boolean,
    },
    methods: 
    {
        getImageUrl(imageName) 
        {
            return `http://localhost:3000/users/images/${imageName}`;
        },
        accept()
        {
            this.$emit('accept-friendship', this.user.id);
        },
        remove()
        {
            this.$emit('remove-relation', this.user.id);
        },
    }
}
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
    flex-shrink: 0
}

.round-image img 
{
  width: 100%;
  height: auto; 
}

.circle 
{
  width: 1em;
  height: 1em;
  border-radius: 50%; 
  margin-left: 1em;
  flex-shrink: 0
  
}
.green
{
    background-color: green;
}
.red
{
    
    background-color: red;
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