<template>
    <div :class="{'selection-color' : isSelected}" @click="handleChannelClicked">
        <p>{{ channel.name }}</p>
    </div>
</template>

<script>
export default {
    name: 'Channel-Component',
    props: 
    {
        channel: Object, 
        isSelected: Boolean
    },
    methods: {
        handleChannelClicked() {
            this.$emit('channel-clicked', this.channel);
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
</style>