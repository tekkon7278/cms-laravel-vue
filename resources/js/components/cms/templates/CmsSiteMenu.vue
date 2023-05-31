<script>

/**
 * CMSのサイドメニュー
 */
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
            site: {}
        }
    },

    beforeMount() {
        this.getSite();
    },

    methods: {
        async getSite() {
            this.site = await this.$entities.site(this.siteId).fetch();
        },
    },
};
</script>

<template>

    <v-navigation-drawer
        expand-on-hover
        rail
        color="grey-darken-3"
        permanent=true
    >
        <!-- サイト情報表示 -->
        <v-list>
          <v-list-item
            :title="site.name"
            :subtitle="site.domain"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <!-- サイト編集メニュー -->
        <v-list density="compact" nav>
            <v-list-item
                prepend-icon="mdi-cog"
                title="サイト設定"
                :to="{name: 'site-base-edit'}"
            ></v-list-item>
            <v-list-item
                prepend-icon="mdi-playlist-edit"
                title="ページ管理"
                :to="{name: 'site-page-list'}"
            ></v-list-item>
            <v-list-item
                prepend-icon="mdi-palette"
                title="デザイン設定"
                :to="{name: 'site-design-edit'}"
            ></v-list-item>
        </v-list>
        
        <v-divider></v-divider>

        <!-- サイトリストへ戻る -->
        <v-list density="compact" nav>
            <v-list-item
                prepend-icon="mdi-arrow-u-left-bottom"
                title="サイトリスト"
                :to="{name: 'site-list'}"
            ></v-list-item>
        </v-list>

    </v-navigation-drawer>
</template>

<style>
</style>