<script>
import CmsHeader from "../templates/CmsHeader.vue";
import SiteHeader from "../templates/SiteHeader.vue";
import CmsSiteMenu from "../templates/CmsSiteMenu.vue";
import MenuItemEditor from "../templates/MenuItemEditor.vue";
import MenuItemCreater from "../templates/MenuItemCreater.vue";

export default {

    components: {
        CmsHeader,
        CmsSiteMenu,
        SiteHeader,
        MenuItemEditor,
        MenuItemCreater,
    },

    data() {
        return {

            /**
             * サイトID
             * @type {number}
             */
            siteId: null,
            
            /**
             * サイトデータ。UI連動。
             * @type {Object}
             */
            site: {},
            
            /**
             * サイトデータ。UI連動。
             * @type {array<Object>}
             */
            pages: [],

            /**
             * 読み込み中フラグ
             * @type {boolean}
             */
            loading: true,
        }
    },

    beforeMount() {

        // URLからサイトIDを読み取り、APIでページリストデータ取得
        this.siteId = this.$router.currentRoute.value.params.siteId;
        this.getPages();
    },

    methods: {

        /**
         * サイトのページリストデータを取得し、UIと連動する変数へセットすることでページ一覧の表示
         */
        async getPages() {
            this.pages = await this.$entities.site(this.siteId).pages().fetchAll();
            this.loading = false;
        },

        /**
         * ページリストに新たなページ表示の追加。子コンポーネントでの更新実行からイベント通知を受けての処理を想定
         * @param {Object} pageEdited 追加するページデータ
         */
        appendPage(pageEdited) {
            const beforeIndex = this.pages.findIndex((page) => page.id == pageEdited.beforePageId);
            console.log(pageEdited);
            this.pages.splice(beforeIndex + 1, 0, pageEdited);
        },
        
        /**
         * ページリストからページ表示の削除。子コンポーネントでの削除実行からイベント通知を受けての処理を想定
         * @param {Object} arg 削除ページのデータ
         */
        destroyPage(arg) {
            const destroyIndex = this.pages.findIndex((page) => page.id == arg.pageId);
            this.pages.splice(destroyIndex, 1);
        }
    },
};
</script>

<template>

<CmsHeader title="ページ管理"></CmsHeader>
<CmsSiteMenu :siteId="siteId"></CmsSiteMenu>
<SiteHeader :siteId="siteId"></SiteHeader>

<v-main>
    <v-container class="my-6">

        <v-container>

            <v-list id="menu-item" class="menus">

                <!-- 初期読み込み中表示 -->
                <v-progress-linear
                    :active="loading"
                    :indeterminate="loading"
                    color="teal-darken-2"
                    rounded
                    height="6"
                ></v-progress-linear>

                <template v-for="page in pages" :key="page.id">

                    <!-- ページ情報表示・編集 -->
                    <MenuItemEditor
                        :page="page"
                        @destroyed="destroyPage"
                    ></MenuItemEditor>
                    
                    <!-- 各ページの直後に新たなページを差し込むための追加フォーム -->
                    <MenuItemCreater
                        :siteId="siteId"
                        :beforePageId="page.id"
                        @created="appendPage"   
                    ></MenuItemCreater>

                    <v-divider></v-divider>

                </template>
            </v-list>

        </v-container>

    </v-container>
</v-main>

</template>

<style>
</style>