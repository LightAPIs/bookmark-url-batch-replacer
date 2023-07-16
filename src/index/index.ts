import { createApp } from 'vue';
import App from './App.vue';
import { i18n } from '@/common/ui';

const app = createApp(App);
app.mount('#app');

document.title = i18n('extName');
