<script>
import CmsHeader from "../templates/CmsHeader.vue";
import ButtonIcon from "../parts/ButtonIcon.vue";
import ErrorDisplay from "../parts/ErrorDisplay.vue";
import EditorButtonSet from "../parts/EditorButtonSet.vue";

export default {

    components: {
        CmsHeader,
        ButtonIcon,
        ErrorDisplay,
        EditorButtonSet,
    },

    data() {
        return {

            /**
             * 編集モードかどうか。UI表示連動。
             * @type {boolean}
             */
            isEditMode: false,

            /**
             * 更新処理実行中かどうか。UI表示連動。
             * @type {boolean}
             */
            isProcessing: false,
            
            /**
             * サイトリストデータ。UI表示連動。
             * @type {array<Object>}
             */
            sites: [],
            
            /**
             * サイト作成の入力中サイト名
             * @type {string}
             */
            inputedSiteName: '',
            
            /**
             * 読み込み中フラグ
             * @type {boolean}
             */
            loading: true,
            
            /**
             * リクエストに対するレスポンスがエラーの場合のメッセージを保持。
             *     UI表示連動し、メッセージを設定することでUIにメッセージ表示する。
             * @type {array<string>}
             */
            errors: [],
        }
    },

    beforeMount() {

        // サイト一覧表示
        this.getSites();
        
    },

    methods: {
        
        /**
         * サイトリストデータを取得し、UIと連動する変数へセットすることで一覧描画
         */
        async getSites() {
            this.sites = await this.$entities.sites().fetchAll();
            this.loading = false;
        },

        /**
         * サイトを登録
         */
        async create() {

            this.errors = [];
            this.isProcessing = true;

            // APIリクエスト
            const response = await this.$entities.sites().create({
                site_name: this.inputedSiteName,
            });

            this.isProcessing = false;

            // 失敗の場合はエラー表示
            if (!response.result) {
                this.errors = response.messages;
                return;
            }

            // UI上のリストへサイト追加
            this.appendSite({
                id: response.id,
                name: this.inputedSiteName,
            });

            this.inputedSiteName = '';
            this.isEditMode = false;
        },

        /**
         * UI上のリストへサイト追加
         * 
         * @param {Object} site サイトデータ 
         */
        appendSite(site) {
            this.sites.push(site);
        },

        /**
         * 編集モードを解除
         */
        cancelEdit() {
            this.errors = [];
            this.isEditMode = false;
        },

    },
};
</script>

<template>

<CmsHeader title="サイトリスト"></CmsHeader>
<v-main>
    <v-container class="my-6">
        
        <!-- 初期読み込み中表示 -->
        <v-progress-linear
            :active="loading"
            :indeterminate="loading"
            color="teal-darken-2"
            rounded
            height="6"
        ></v-progress-linear>

        <!-- サイト一覧 -->
        <v-table>

            <thead>
                <tr>
                    <th class="font-weight-bold">サイト名</th>
                    <th class="font-weight-bold">URL</th>
                    <th class="font-weight-bold">公開状態</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="site in sites" :key="site.id">
                    
                    <!-- サイト名 -->
                    <td>
                        <!-- アイコン -->
                        <v-icon
                            class="logo icon"
                            color="blue-lighten-2"
                        >mdi-web</v-icon>

                        <!-- サイト名 -->
                        <router-link
                            class="link-to-site "
                            :to="{name: 'site-base-edit', params: {siteId: site.id}}"
                        >{{ site.name }}
                        </router-link>
                    </td>

                    <!-- ドメイン -->
                    <td>
                        <a
                            v-if="site.domain != '' && site.domain != null"
                            class="text-decoration-none"
                            :href="'http://' + site.domain"
                        >http://{{ site.domain }}</a>
                    </td>
                    
                    <!-- 公開状態 -->
                    <td class="is_published">
                        <span
                            class="published"
                            v-show="site.isPublished"
                        >
                            <v-icon class="mr-1">mdi-eye</v-icon>公開中
                        </span>
                        <span
                            class="not_published"
                            v-show="!site.isPublished"
                        >
                            <v-icon class="mr-1">mdi-eye-off</v-icon>非公開
                        </span>
                    </td>

                </tr>                
            </tbody>

        </v-table>

        <!-- サイト追加フォーム -->
        <v-container>
            
            <!-- 追加アイコン -->
            <div class="disp" v-show="!isEditMode">
                <ButtonIcon
                    className="text-h4"
                    name="plus-circle"
                    @clickIcon="isEditMode=true"
                ></ButtonIcon>
            </div>

            <!-- 編集フォーム -->
            <div class="edit" v-show="isEditMode">
                <span>サイト名</span>
                <v-text-field
                    v-model="inputedSiteName"
                    :disabled="isProcessing"                    
                ></v-text-field>
                <ErrorDisplay :messages="errors"></ErrorDisplay>
                <EditorButtonSet
                    :isDisabled="isProcessing"
                    :isUseDestroy="false"
                    @clickOk="create"
                    @clickCancel="cancelEdit"
                ></EditorButtonSet>
                <Preloader
                    :isShow="isProcessing"
                ></Preloader>
            </div>

        </v-container>

    </v-container>
</v-main>

</template>

<style lang="scss" scoped>
a.link-to-site {
    text-decoration: none;
    color: #0D47A1;
    .icon {
        margin-inline-start: 10px;
    }

}
.icon {
    margin-inline-end: 5px;
}
.is_published{
    .published {
        color: #1A237E;
    }
    .not_published {
        color: #B71C1C;
    }
}
</style>