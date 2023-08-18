<template>
  <div id="applie">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
.modal
{
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
}

.modal-overlay 
{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.circle 
{
  width: 1em;
  height: 1em;
  border-radius: 50%;
  margin-left: 1em;
  flex-shrink: 0;
  justify-content: center;
  text-align: center;
}
.green
{
  background-color: green;
}
.red
{
  background-color: red;
}

:root {
	--pblack: #0b0c10;
	--pdark: #1f2833;
	--plight: #c5c6c7;
	--pcyan: #66fcf1;
	--pblue: #45a29e;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

html {
	background: linear-gradient(45deg, var(--pblack), var(--pdark));
}
</style>
