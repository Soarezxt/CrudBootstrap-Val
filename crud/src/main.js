import { createApp } from 'vue';
import App from './App.vue';
import { VueMaskDirective } from 'v-mask';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const app = createApp(App);
app.directive('mask', VueMaskDirective);
app.mount('#app');
