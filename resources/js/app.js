import './bootstrap';

// vueのインポート
import { createApp } from "vue/dist/vue.esm-bundler";

// vuetify関係のインポート
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import colorThemes from "./themes/themes.js"

// vue-router関係のインポート
import { createRouter, createWebHistory } from 'vue-router'
import { routes, basePath } from "./routes/routes.js"

// アプリ固有のインポート
import App from "./components/cms/App.vue";
import Page from "./components/site/Page.vue";
import UserPlugin from './entities/UserPlugin.js';

// CMSへのアクセスか公開サイトへのアクセスかでベースとなるコンポーネント切り分け
let appComponents = { Page };
if (basePath === '/cms') {
    appComponents = { App };
}

const app = createApp({
    components: appComponents,
});

const vuetify = createVuetify({
    components,
    directives,
    
    icons: {
        iconfont: 'mdi',
    },
    theme: { 
        defaultTheme: 'blue_2',
        themes: colorThemes,
        options: {
            customProperties: true
        }
    },
});

const router = createRouter({
    history: createWebHistory(basePath),
    routes
});

app
    .use(vuetify)
    .use(router)
    .use(UserPlugin)
    .mount("#app");