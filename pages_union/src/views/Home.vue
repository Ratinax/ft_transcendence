<template>
  <p> Home </p>
  <router-link to="/register">
    <form>
        <button type="submit">Register</button>
    </form>
  </router-link>
  <p></p>
  <router-link to="/login">
    <form>
        <button type="submit">Log In</button>
    </form>
  </router-link>

</template>

<script>
export default {
    name: 'Home-Component'
}
</script>

<style>

</style>