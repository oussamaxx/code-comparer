import {createApp} from 'vue';

import App from '/@/App.vue';

import 'fomantic-ui/dist/semantic.min.css';
import 'fomantic-ui/dist/semantic.min.js';

import CodeDiff from 'v-code-diff';

const app = createApp(App);
app.use(CodeDiff).mount('#app');
