import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';

console.log('Base URL:', import.meta.env.VITE_BASE_URL);
createApp(App).use(router).mount('#app');
