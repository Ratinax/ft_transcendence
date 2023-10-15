const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

/*
todo: replace by:
const { defineConfig } = require('@vue/cli-service')
  module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
      port: 8080,
      client:
      {
        webSocketURL: "ws://10.12.8.8/ws",
      }
    }
})

*/
