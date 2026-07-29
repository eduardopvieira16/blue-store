import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { enableDevToolsProtection } from './security/devToolsProtection';
import './assets/main.scss';

enableDevToolsProtection();
createApp(App).use(createPinia()).use(router).mount('#app');
