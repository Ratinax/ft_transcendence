<template>
  <router-view />
</template>

<style>

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

html,
body {
  margin: 0;
  padding: 0;
}

html {
  height: 100%;
  background: linear-gradient(45deg, var(--pblack), var(--pdark));
}
</style>