<script>
import ButtonIcon from "../parts/ButtonIcon.vue";
import EditorButtonSet from "../parts/EditorButtonSet.vue";
import ErrorDisplay from "../parts/ErrorDisplay.vue";
import Preloader from "../parts/Preloader.vue";
import ConfirmModal from "../modal/Confirm.vue";

export default {

    components: {
        ButtonIcon,
        EditorButtonSet,
        ErrorDisplay,
        Preloader,
        ConfirmModal,
    },

    props: {

        /**
         * サイトID
         * @type {number}
         */
        siteId: Number,

        /**
         * 直前ページID
         * @type {number}
         */
        beforePageId: Number
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
             * ページデータのテンプレート。UI連動。
             * @type {Object}
             */
            pageEdited: {
                siteId: this.siteId,
                beforePageId: this.beforePageId,
                title: '',
            },

            /**
             * リクエストに対するレスポンスがエラーの場合のメッセージを保持。
             *     UI表示連動し、メッセージを設定することでUIにメッセージ表示する。
             * @type {array<string>}
             */
            errors: [],
        }
    },

    emits: [
        'created',
    ],

    methods: {

        /**
         * 編集モードを解除
         */
        cancelEdit() {
            this.pageEdited.title = '';
            this.isEditMode = false;
        },
        
        /**
         * ページの登録。APIでデータ登録後、親コンポーネントのUI表示を更新。
         */
        async create() {

            this.isProcessing = true;
            try {

                // APIリクエスト
                const pages = this.$entities.site(this.siteId).pages();
                const response = await pages.create({
                    page_title: this.pageEdited.title,
                    pathname: this.pageEdited.pathname,
                    before_page_id: this.pageEdited.beforePageId
                });

                // 失敗の場合はエラー表示して終了
                if (!response.result) {
                    this.errors = response.messages;
                    return;
                }

                // 親コンポーネントへイベント通知し、UI更新
                this.pageEdited.id = response.id;
                this.$emit('created', this.pageEdited);

                this.cancelEdit();

            } finally {
                this.isProcessing = false;
            }
        },
    },
};
</script>

<template>
    <v-list-item class="item new">
        
        <!-- 追加アイコン -->
        <div class="disp icon" v-show="!isEditMode" v-on:click="isEditMode = true">
            　<v-icon color="teal-lighten-1">mdi-loupe</v-icon> 
        </div>

        <!-- 追加フォーム -->
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

            <!-- 入力エラー表示領域 -->
            <ErrorDisplay
                :messages="errors"
            ></ErrorDisplay>
            
            <!-- ボタン -->
            <EditorButtonSet
                :isDisabled="isProcessing"
                :isUseDestroy="false"
                @clickOk="create"
                @clickCancel="cancelEdit"
            ></EditorButtonSet>

        </div>
    </v-list-item>
</template>

<style lang="scss" scoped>
.new {
    position: relative;
    border-bottom: 1px solid transparent;
    min-height: auto;
    margin-left: 30px;
    &:hover {
        /*
        &:not(.on-edit) {
            border-bottom: 1px solid #4db6ac;
        }
        */
        border-bottom: 1px solid #4db6ac;
    }
}
.icon {
    position: absolute;
    bottom: -10px;
    left: -45px;
    height: 30px;
    cursor: pointer;

    i {
        width: 30px;
    }

}
.edit {
    position: relative;
    border: 1px solid #26a69a;
    padding: 5px;
}
</style>