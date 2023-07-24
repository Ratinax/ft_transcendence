<template>
  <div class="message">
    <p>{{ username }} : {{  content }}</p>
  </div>
</template>

<script>
export default {
    name: "Message-Component",
    props: {
        username: String,
        content: String,
    },
}
</script>

<style>

</style>