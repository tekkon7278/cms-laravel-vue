<script>
import CmsHeader from "../templates/CmsHeader.vue";
import SiteHeader from "../templates/SiteHeader.vue";
import CmsSiteMenu from "../templates/CmsSiteMenu.vue";
import SiteItemTextEditor from "../templates/SiteItemTextEditor.vue";
import SiteItemFileUploader from "../templates/SiteItemFileUploader.vue";
import ConfirmModal from "../modal/Confirm.vue";

export default {
    
    components: {
        CmsHeader,
        CmsSiteMenu,
        SiteHeader,
        SiteItemTextEditor,
        SiteItemFileUploader,
        ConfirmModal,
    },

    props: {
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
             * 編集前のサイトデータ。編集キャンセルの場合のロールバック用
             * @type {Object}
             */
            originalSite: {},
            
            /**
             * フォームの入力値(ファイルパス)
             * @type {string}
             */
            file: '',

            /**
             * 読み込み中フラグ
             * @type {boolean}
             */
            loading: true,
        }
    },

    computed: {

        siteName() {
            return (this.site.name === null) ? '' : this.site.name;
        },

        domain() {
            return (this.site.domain === null) ? '' : this.site.domain;
        },

        originalSiteName() {
            return (this.originalSite.name === null) ? '' : this.originalSite.name;
        },

        originalDomain() {
            return (this.originalSite.domain === null) ? '' : this.originalSite.domain;
        },

    },

    /**
     * UIへデータ反映直前
     */
    async beforeMount() {

        // URLからサイトIDを読み取り、APIでデータ取得
        this.siteId = this.$router.currentRoute.value.params.siteId;
        this.getSite();
        
    },

    methods: {

        /**
         * サイトデータを取得し、UIと連動する変数へセットすることでサイト設定の表示
         */
        async getSite() {
            this.site = await this.$entities.site(this.siteId).fetch();
            this.originalSite = {...this.site};
            this.loading = false;
        },

        /**
         * 公開フラグの更新
         */
        async updateIsPublished() {
            const response = await this.$entities.site(this.siteId).update({
                is_published: this.site.isPublished,
            });
        },
        
        /**
         * サイトの削除実行。APIでデータ更新後、サイト一覧ページへ遷移。
         */
        async destroy() {

            // 確認メッセージ
            const message = 'サイトを削除します。サイトページやコンテンツのデータも全て削除されます。';
            const isOk = await this.$refs.confirmModal.open(message);
            if (!isOk) {
                return;
            }
            
            // APIリクエスト
            // this.isProcessing = true;
            const response = await this.$entities.site(this.siteId).delete();
            if (!response.result) {
                this.errors = response.messages;
                return;
            }
            // this.isProcessing = false;

            // サイトリストへ遷移
            this.$router.push({name: 'site-list'});
        },

    },
};
</script>

<template>

<CmsHeader title="サイト設定"></CmsHeader>
<CmsSiteMenu :siteId="siteId"></CmsSiteMenu>
<SiteHeader :siteId="siteId"></SiteHeader>

<v-main>
    <v-container class="my-6 mx-16">

        <h2>サイト基本設定</h2>

        <v-container class="mx-6">
            
            <!-- 初期読み込み中表示 -->
            <v-progress-linear
                :active="loading"
                :indeterminate="loading"
                color="teal-darken-2"
                rounded
                height="6"
            ></v-progress-linear>

            <!-- サイト名設定表示・編集 -->
            <v-row align="center">
                <v-col cols="2">
                    <v-sheet class="mx-3 my-8 title">サイト名</v-sheet>
                </v-col>
                <v-col cols="8">
                    <v-sheet class="mx-3 my-8">
                        <SiteItemTextEditor
                            :siteId="siteId"
                            :value="site.name"
                            entityKey="site_name"
                            @input="site.name = $event"
                            @canceled="site.name = originalSiteName"
                        ></SiteItemTextEditor>
                        <p class="pt-4 explanation">
                            サイトロゴを設定しない場合にヘッダに表示されます。
                        </p>
                    </v-sheet>
                </v-col>
            </v-row>

            <v-divider></v-divider>

            <!-- ドメイン設定表示・編集 -->
            <v-row align="center">
                <v-col cols="2">
                    <v-sheet class="mx-3 my-8 title">ドメイン</v-sheet>
                </v-col>
                <v-col cols="8">
                    <v-sheet class="mx-3 my-8">
                        <SiteItemTextEditor
                            :siteId="siteId"
                            :value="site.domain"
                            entityKey="domain"
                            @input="site.domain = $event"
                            @canceled="site.domain = originalDomain"
                        ></SiteItemTextEditor>
                        <p class="pt-4 explanation">
                            ここで設定したドメインでサイト公開するには、そのドメインがIPアドレス：118.27.109.13に解決されるようにDNSのレコード設定もしくは端末のhosts設定が必要です。<br>
                            "aaa.tkng.site"や"bbb.tkng.site"など、"tkng.site"のサブドメインであれば全てこのIPに解決されます。自由にご利用ください。
                        </p>
                    </v-sheet>
                </v-col>
            </v-row>

            <v-divider></v-divider>

            <!-- サイトロゴ設定表示・編集 -->
            <v-row align="center">
                <v-col cols="2">
                    <v-sheet class="mx-3 my-8 title">サイトロゴ</v-sheet>
                </v-col>
                <v-col cols="8">
                    <v-sheet class="mx-3 my-8">
                        <SiteItemFileUploader
                            :siteId="siteId"
                            :value="site.logoImage"
                            entityKey="logo_image"
                            @updated="site.logoImage = $event"
                        ></SiteItemFileUploader>
                    </v-sheet>
                </v-col>
            </v-row>

            <v-divider></v-divider>

            <!-- 公開状態設定の表示・編集 -->
            <v-row align="center">
                <v-col cols="2">
                    <v-sheet class="mx-3 my-8 title">公開状態</v-sheet>
                </v-col>
                <v-col cols="8">
                    <v-sheet class="mx-3 my-8">
                        <v-switch
                            v-model="site.isPublished"
                            :label="site.isPublished ? '公開' : '非公開'"
                            @update:modelValue="updateIsPublished"
                            hide-details
                            color="teal-darken-2"
                        ></v-switch>
                    </v-sheet>
                </v-col>
            </v-row>

        </v-container>

        <h2>サイト操作</h2>

        <v-container class="mx-6">
            
            <!-- サイト削除ボタン -->
            <v-row align="center">
                <v-col cols="2">
                    <v-sheet class="mx-3 my-8 title">サイト削除</v-sheet>                
                </v-col>
                <v-col cols="8">
                    <v-sheet class="mx-3 my-8">
                        <v-btn
                            color="teal-darken-2"
                            variant="tonal"
                            @click="destroy"
                        >削除</v-btn>
                    </v-sheet>     
                </v-col>
            </v-row>

            <v-divider></v-divider>

            <!-- コピーサイト作成ボタン（未実装） -->
            <v-row align="center">
                <v-col cols="2">
                    <v-sheet class="mx-3 my-8 title">コピーサイト作成                        
                        <p class="warning font-weight-thin">※未実装</p>
                    </v-sheet>     
                </v-col>
                <v-col cols="8">
                    <v-sheet class="mx-3 my-8">
                        <v-btn
                            color="teal-darken-2"
                            variant="tonal"
                            @click="createCopySite"
                        >コピーサイト作成</v-btn>
                    </v-sheet>     
                </v-col>
            </v-row>

        </v-container>

    </v-container>
</v-main>

<!-- コピーサイト作成ボタン（未実装） -->
<ConfirmModal
    ref="confirmModal"
></ConfirmModal>

</template>

<style lang="scss" scoped>
.title {
    font-weight: bolder;
}
</style>