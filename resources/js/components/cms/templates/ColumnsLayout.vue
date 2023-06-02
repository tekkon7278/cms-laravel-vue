<script>
import EditorButtonSet from "../parts/EditorButtonSet.vue";
import ConfirmModal from "../modal/Confirm.vue";
import Preloader from "../parts/Preloader.vue";
import ContentEditor from "./ContentEditor.vue";

export default {

    components: {
        EditorButtonSet,
        ConfirmModal,
        Preloader,
        ContentEditor,
    },

    props: {

        /**
         * 段組みレイアウトとしての親コンテンツデータ
         * @type {Object}
         */
        content: Object,
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
        }
    },

    computed: {
        innerContents() {
            return this.content.value;
        }
    },

    emits: [
        'destroyed',
    ],

    methods: {

        /**
         * 編集モードへ以降
         */
        toEditMode(e) {
            this.isEditMode = true;
        },

        /**
         * 編集モードを解除
         */
        toDisplayMode(e) {
            this.isEditMode = false;
        },

        /**
         * カラムレイアウトの内部コンテンツ表示の更新。子コンポーネントでの更新実行からイベント通知を受けての処理を想定
         * @param {Object} contentEdited 更新するコンテンツデータ
         */
        refreshContent(contentEdited) {
            const index = this.innerContents.findIndex((content) => content.id == contentEdited.id);
            this.innerContents[index].value = contentEdited.value;
        },

        /**
         * カラムレイアウト自体のコンテンツ削除。内部のコンテンツ全て含めて削除
         */
        async destroy() {

            // 確認メッセージ
            const isOk = await this.$refs.confirmModal.open('削除します');
            if (!isOk) {
                return;
            }

            this.isProcessing = true;

            try {
                // APIリクエスト
                const content = this.$entities
                    .site(this.content.siteId)
                    .page(this.content.pageId)
                    .content(this.content.id);
                const response = await content.delete();

                // 失敗の場合はエラー表示して終了
                if (!response.result) {
                    this.errors = response.messages;
                    return;
                }

                // 親コンポーネントへイベント通知し、UI更新
                this.$emit('destroyed', {
                    contentId: this.content.id
                });

            } finally {
                this.isProcessing = false;
            }
        }
    }
};
</script>

<template>
    <v-container class="my-4">

        <div :class="(isEditMode) ? 'edit' : 'disp'">

            <!-- 段組みの各カラムコンテンツ -->
            <v-row
                @click="toEditMode"
            >            
                <v-col
                    class="column"
                    v-for="(innerContent, index) in innerContents"
                    :key="index"
                >
                    <ContentEditor
                        :content="innerContent"
                        :isUseDestroy="false"
                        @updated="refreshContent"         
                    ></ContentEditor>
                </v-col>

            </v-row>

            <!-- 段組み自体レイアウト自体のボタン -->
            <v-container
                v-show="isEditMode"
            >
                <EditorButtonSet
                    :isProcessing="isProcessing"
                    :isUseOk="false"
                    @clickCancel="toDisplayMode"
                    @clickDestroy="destroy"
                ></EditorButtonSet>
            </v-container>

        </div>

        <ConfirmModal
            ref="confirmModal"
        ></ConfirmModal>

    </v-container>
</template>

<style lang="scss" scoped>
.disp {
    overflow: hidden;
    border: 1px dashed #26a69a;
        
    .column {
        border-right: 1px dashed #26a69a;
    }
    
    &:hover {
        border: 1px solid #26a69a;
        cursor: pointer;
        
        .column {
            border-right: 1px solid #26a69a;
        }
    }
}
.edit {
    border: 1px solid #26a69a;
}
</style>