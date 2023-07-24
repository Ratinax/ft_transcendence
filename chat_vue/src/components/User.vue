<template>
    <div v-if="!user.isInvited" @click="handleUserClicked">
        <p :class="{'admin': user.isAdmin, 'owner': user.isOwner, 'selection-color' : isSelected}">{{ user.pseudo }}</p>
    </div>
</template>

<script>
export default {
    name: 'User-Component',
    props: 
    {
        user: Object, 
        isSelected: Boolean
    },
    methods: {
        handleUserClicked() {
            this.$emit('user-clicked', this.user);
        }
    }
}
</script>

<style>
p 
{
    cursor: pointer;
    display: flex;
}
.admin
{
    color: purple;
}
.owner
{
    color: orange;
}
</style>