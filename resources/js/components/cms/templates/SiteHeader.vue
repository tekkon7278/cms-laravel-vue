<script>

export default {

    props: {

        /**
         * サイトID
         * @type {number}
         */
        siteId: Number,

    },

    data() {
        return {

            /**
             * サイトデータ。UI連動。
             * @type {Object}
             */
            site: {},

            /**
             * ページリストデータ。UI連動。
             * @type {array<Object>}
             */
            pages: [],
        }
    },

    beforeMount() {

        // ヘッダの表示に必要なデータを取得
        this.getSite();
        this.getPages();

    },

    methods: {

        /**
         * サイトデータを取得し、UIと連動する変数へセットすることでバナー等描画
         */
        async getSite() {
            this.site = await this.$entities.site(this.siteId).fetch();
            this.$vuetify.theme.global.name = this.site.colorTheme;
        },

        /**
         * ページリストデータを取得し、UIと連動する変数へセットすることでメニュー描画
         */
        async getPages() {
            this.pages = await this.$entities.site(this.siteId).pages().fetchAll();
        },

    }
    
}
</script>

<template>
    <v-app-bar color="primary" height="70">

        <!-- ロゴまたはサイト名表示 -->
        <v-app-bar-title class="site-name">
            <a :href="'/cms/sites/' + site.id">
                <img
                    v-show="site.logoImage != null"
                    :src="site.logoImage"
                >
                <span
                    v-show="site.logoImage == null"
                >{{ this.site.name }}</span>
            </a>
        </v-app-bar-title>

        <!-- メニュー表示 -->
        <v-tabs>
            <v-tab
                v-for="(page, index) in pages"
                :key="index"
                :href="'/' + page.pathname"
            >{{ page.title }}
            </v-tab>
        </v-tabs>

    </v-app-bar>
</template>

<style lang="scss">
.site-name {
    a {
        text-decoration: none;
        color: inherit;
    }
}
</style>