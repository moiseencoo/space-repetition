import { createApp } from 'vue';
import { VueFire } from 'vuefire';
import { firebaseApp } from './firebase.js';

import './style.css';
import App from './App.vue';

createApp(App).mount('#app');

app.use(VueFire, {
  firebaseApp,
  modules: [],
});
