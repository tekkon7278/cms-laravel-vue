<script>
import ButtonIcon from "../parts/ButtonIcon.vue";
import ButtonText from "../parts/ButtonText.vue";
import EditorButtonSet from "../parts/EditorButtonSet.vue";
import ErrorDisplay from "../parts/ErrorDisplay.vue";
import Preloader from "../parts/Preloader.vue";
import ConfirmModal from "../modal/Confirm.vue";

export default {

    components: {
        ButtonIcon,
        ButtonText,
        EditorButtonSet,
        ErrorDisplay,
        Preloader,
        ConfirmModal,
    },

    props: {

        /**
         * 編集対象のページ設定データ
         * @type {Object}
         */
        page: Object,

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
             * 編集中のページ設定データ。初期値は親コンポーネントからわたってきたデータをコピー。UI連動。
             * @type {Object}
             */
            pageEdited: {...this.page},

            /**
             * リクエストに対するレスポンスがエラーの場合のメッセージを保持。
             *     UI表示連動し、メッセージを設定することでUIにメッセージ表示する。
             * @type {array<string>}
             */
            errors: []
        }
    },

    emits: [
        'destroyed',
    ],

    methods: {

        /**
         * 編集モードを解除
         */
        cancelEdit() {
            this.pageEdited = {...this.page};
            this.errors = [];
            this.isEditMode = false
        },

        /**
         * ページ設定の更新実行。APIでデータ更新後、親コンポーネントのUI表示を更新。
         */
        async update() {

            this.isProcessing = true;
            try {
                this.errors = [];

                // APIリクエスト
                const page = this.$entities.site(this.page.siteId).page(this.page.id);
                const response = await page.update({
                    page_title: this.pageEdited.title,
                    pathname: this.pageEdited.pathname,
                    is_published: this.pageEdited.isPublished,
                });

                // 失敗の場合はエラー表示して終了
                if (!response.result) {
                    this.errors = response.messages;
                    this.isProcessing = false;
                    return;
                }

                this.isEditMode = false;

            } finally {
                this.isProcessing = false;
            }
        },
        
        /**
         * ページの削除実行。APIでデータ更新後、親コンポーネントのUI表示を更新。
         */
        async destroy() {       

            const isOk = await this.$refs.confirmModal.open('削除します');
            if (!isOk) {
                return;
            } 

            this.isProcessing = true;
            try {
                
                // APIリクエスト
                const page = this.$entities.site(this.page.siteId).page(this.page.id);
                const response = await page.delete();

                this.$emit('destroyed', {
                    pageId: this.page.id
                });

                // 失敗の場合はエラー表示して終了
                if (!response.result) {
                    this.errors = response.messages;
                    return;
                }

                this.isEditMode = false;

            } finally {
                this.isProcessing = false;
            }
        },

        /**
         * ページのプレビューを別ウインドウで表示。
         */
        openPreview(siteId, pageId) {
            window.open('/sites/' + siteId + '/pages/' + pageId, 'preview')
        },

    },
};
</script>

<template>
    <v-list-item
        :class="['item', {'home': page.isIndex }]"
    >

        <!-- ページ設定表示  -->
        <div class="disp" v-show="!isEditMode">
            <v-card
                variant="text"
            >
                <v-card-title
                    class="pb-0"
                >
                    <!-- アイコン -->
                    <v-icon
                        class="icon"
                        color="blue-lighten-2"
                    >{{ page.isIndex ? 'mdi-home' : 'mdi-file-document-outline' }}</v-icon>

                    <!-- ページタイトル -->
                    {{ pageEdited.title }}

                    <!-- ボタン -->
                    <ButtonText
                        v-if="!page.isIndex"
                        text="編集"
                        icon_name="pencil"
                        @click="isEditMode=true"
                    ></ButtonText>
                    <ButtonText
                        text="コンテンツ管理"
                        icon_name="file-move-outline"
                        @clickButton="$router.push({name: 'page-edit', params: {pageId: page.id}})"
                    ></ButtonText>
                    <ButtonText
                        text="プレビュー"
                        icon_name="eye"
                        @clickButton="openPreview(page.siteId, page.id)"
                    ></ButtonText>

                </v-card-title>

                <!-- URLパスキー表示 -->
                <v-card-subtitle
                    class="ml-11"
                >{{ pageEdited.pathname }}/</v-card-subtitle>

                <!--公開状態表示 -->
                <v-card-text
                    class="ml-11 py-1"
                >
                    <v-label
                        v-show="pageEdited.isPublished"
                        class="text-indigo-darken-4 text-body-2"
                    ><v-icon class="mr-1">mdi-eye</v-icon>公開中</v-label>
                    <v-label
                        v-show="!pageEdited.isPublished"
                        class="text-red-darken-4"
                    ><v-icon class="mr-1">mdi-eye-off</v-icon>非公開</v-label>
                </v-card-text>

            </v-card>
        </div>
        
        <!-- ページ設定編集フォーム  -->
        <div class="edit" v-show="isEditMode">
            
            <!-- ページタイトル -->
            <v-label class="text-teal-darken-2">ページタイトル</v-label>
            <v-text-field
                v-model="pageEdited.title"
                :disabled="isProcessing"
            ></v-text-field>

            <!-- URLパスキー -->
            <v-label class="text-teal-darken-2">URLパスキー</v-label>            
            <v-text-field
                v-model="pageEdited.pathname"
                :disabled="isProcessing"
            ></v-text-field>
            
            <!-- 公開状態 -->
            <v-switch
                v-model="pageEdited.isPublished"
                :label="pageEdited.isPublished ? '公開' : '非公開'"
                hide-details
                color="teal-darken-2"
            ></v-switch>

            <!-- 入力エラー表示領域 -->
            <ErrorDisplay
                :messages="errors"
            ></ErrorDisplay>

            <!-- ボタン -->
            <EditorButtonSet
                :isProcessing="isProcessing"
                @clickOk="update"
                @clickCancel="cancelEdit"
                @clickDestroy="destroy"
            ></EditorButtonSet>

            <!-- 確認メッセージダイアログ -->
            <ConfirmModal
                ref="confirmModal"
            ></ConfirmModal>

        </div>
    </v-list-item>
</template>

<style lang="scss" scoped>
.disp {
    &:hover {

    }
}
.edit {
    position: relative;
    border: 1px solid #26a69a;
    padding: 5px;
}
.page-name {
    margin-inline-end: 10px;
}
.menu-edit-icon {
    margin-inline-end: 5px;
}
.item:not(.home) {
    margin-left: 20px;
}
.icon {
    margin-inline-end: 5px;
}
</style>