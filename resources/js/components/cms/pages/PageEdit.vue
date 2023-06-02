<script>
import CmsHeader from "../templates/CmsHeader.vue";
import CmsSiteMenu from "../templates/CmsSiteMenu.vue";
import SiteHeader from "../templates/SiteHeader.vue";
import ContentEditor from "../templates/ContentEditor.vue";
import ContentCreater from "../templates/ContentCreater.vue";
import ColumnsLayout from "../templates/ColumnsLayout.vue";

export default {

    components: {
        CmsHeader,
        CmsSiteMenu,
        SiteHeader,
        ContentEditor,
        ContentCreater,
        ColumnsLayout,
    },

    data() {
        return {

            /**
             * サイトID
             * @type {number}
             */
            siteId: null,

            /**
             * ページID
             * @type {number}
             */
            pageId: null,

            /**
             * 読み込み中フラグ
             * @type {boolean}
             */
            loading: true,
            
            /**
             * サイトデータ。UI連動。
             * @type {Object}
             */
            page: {},

            /**
             * サイトのコンテンツデータ。UI連動。
             * @type {array<Object>}
             */
            contents: [],

        }
    },

    /**
     * UIへデータ反映直前
     */
    beforeMount() {

        // URLからサイトIDとページIDを読み取り、それをパラメータにAPIからデータ取得
        this.siteId = Number(this.$router.currentRoute.value.params.siteId);
        this.pageId = Number(this.$router.currentRoute.value.params.pageId);
        this.getPage();
        this.getContents();

    },
    
    methods: {

        /**
         * ページデータを取得
         */
        async getPage() {
            this.page = await this.$entities.site(this.siteId).page(this.pageId).fetch();
        },

        /**
         * ページのコンテンツデータを取得
         */
        async getContents() {
            this.contents = await this.$entities.site(this.siteId).page(this.pageId).contents().fetchAll();
            this.loading = false;
        },

        /**
         * ヘッダメニュークリック時処理
         */
        openPreviewWindow() {
            // 別ウインドウでページのプレビュー表示
            window.open('/sites/' + this.siteId + '/pages/' + this.page.id, 'preview');            
        },

        /**
         * 指定コンテンツ表示の更新。子コンポーネントでの更新実行からイベント通知を受けての処理を想定
         * @param {Object} contentEdited 更新するコンテンツデータ
         */
        refreshContent(contentEdited) {
            // 引数とIDの一致するデータを上書きすることでバインドされたリストUI更新
            const index = this.contents.findIndex((content) => content.id == contentEdited.id);
            this.contents[index].value = contentEdited.value;
            this.contents[index].padding = contentEdited.padding;
        },

        /**
         * コンテンツリストに新たなコンテンツ表示の追加。子コンポーネントでの登録実行からイベント通知を受けての処理を想定
         * @param {Object} contentEdited 追加するコンテンツデータ
         */
        insertContent(contentEdited) {
            const beforeIndex = this.contents.findIndex((content) => content.id == contentEdited.beforeContentId);
            this.contents.splice(beforeIndex + 1, 0, contentEdited);
        },

        /**
         * コンテンツリストから指定コンテンツの表示の削除。子コンポーネントでの削除実行からイベント通知を受けての処理を想定
         * @param {Object} arg 削除対象コンテンツのデータ
         */
        destroyContent(arg) {
            const destroyIndex = this.contents.findIndex((content) => content.id == arg.contentId);
            this.contents.splice(destroyIndex, 1);
        },

        /**
         * タイトル表示非表示の更新
         */
        async updateIsShowTitle() {
            const response = await this.$entities.site(this.siteId).page(this.pageId).update({
                is_show_title: this.page.isShowTitle,
            });
        }
        
    },
};
</script>

<template>

<CmsHeader
    title="コンテンツ編集"
    :menus="[{key: 'preview', text: 'プレビュー', icon: 'eye'}]"
    @clickIcon="openPreviewWindow"
></CmsHeader>
<CmsSiteMenu :siteId="siteId"></CmsSiteMenu>
<SiteHeader :siteId="siteId"></SiteHeader>

<v-main>
    <v-container class="my-6">

        <h1>
            {{ page.title }}        
            <v-switch
                v-model="page.isShowTitle"
                :label="page.isShowTitle ? 'タイトル表示' : 'タイトル非表示'"
                @update:modelValue="updateIsShowTitle"
                hide-details
                color="teal-darken-2"
            ></v-switch>
        </h1>

        <!-- 初期読み込み中表示 -->
        <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            color="teal-darken-2"
            rounded
            height="6"
        ></v-progress-linear>

        <!-- 先頭の追加フォーム -->
        <ContentCreater
            :siteId="siteId"
            :pageId="pageId"
            :beforeContentId="0"
            @created="insertContent"
            v-show="!loading"
        ></ContentCreater>

        <template v-for="content in contents" :key="content.id">

            <!-- コンテンツ内容表示と編集フォーム（段組み以外） -->
            <ContentEditor
                v-if="content.type != 'columns'"
                :content="content"
                :isUseDestroy="true"
                @updated="refreshContent"     
                @destroyed="destroyContent"            
            ></ContentEditor>

            <!-- コンテンツ内容表示と編集フォーム（段組み） -->
            <ColumnsLayout
                v-if="content.type == 'columns'"
                :content="content"
                :innerContents="content.value"    
                @destroyed="destroyContent"
            ></ColumnsLayout>

            <!-- 各コンテンツの直後に新たなコンテンツを差し込むための追加フォーム -->
            <ContentCreater
                :siteId="siteId"
                :pageId="pageId"
                :beforeContentId="content.id"
                @created="insertContent"
            ></ContentCreater>

        </template>
    </v-container>  
</v-main>

</template>

<style>
</style>