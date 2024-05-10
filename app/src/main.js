// CSS.
import 'solana-wallets-vue/styles.css'
import './main.css'

// Routing.
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from '/home/dan/solana/dapp/solana-twitter/app/src/route.js'
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

// Create the app.
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).use(router).mount('#app')