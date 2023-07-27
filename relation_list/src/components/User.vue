<template>
    <div class="user">
        <div class="round-image">
            <img :src="getImageUrl(user.profilPic)" alt="Image" />
        </div>
        <span class="pseudo"> {{ user.pseudo }}</span>
    </div>
</template>

<script>
export default {
    name: 'User-Component',
    props: 
    {
        user: Object,
    },
    methods: 
    {
        getImageUrl(imageName) {
        return `http://localhost:3000/users/images/${imageName}`;
        },
    }
}
</script>

<style>

.pseudo
{
    padding-left: 0.2em;
}

.user
{
    display: flex;
    flex-direction: align;
    align-items: center;
}

.round-image {
    width: 1em; 
    height: 1em; 
    border-radius: 50%; 
    overflow: hidden; 
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0.01em solid black;
}
</style>