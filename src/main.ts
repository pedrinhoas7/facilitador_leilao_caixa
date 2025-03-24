import { createApp } from 'vue'
import './assets/styles.css'
import App from './App.vue'
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.mount('#app')
