import { createApp } from 'vue'
import { ViteBabylonPlugin } from './plugin'
import App from './App.vue'

createApp(App).use(ViteBabylonPlugin).mount('#app')
