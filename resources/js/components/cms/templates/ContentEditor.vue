<script>
import EditorButtonSet from "../parts/EditorButtonSet.vue";
import InputList from "../parts/InputList.vue";
import ErrorDisplay from "../parts/ErrorDisplay.vue";
import ConfirmModal from "../modal/Confirm.vue";
import Preloader from "../parts/Preloader.vue";

export default {

    components: {
        EditorButtonSet,
        InputList,
        ErrorDisplay,
        ConfirmModal,
        Preloader
    },

    props: {

        /**
         * 編集対象のコンテンツデータ
         * @type {Object}
         */
        content: Object,
        
        /**
         * 削除アイコンを表示するかどうか。
         *     true:表示する false:表示しない。デフォルトはfalse
         * @type {boolean}
         */
        isUseDestroy: {
            type: Boolean,
            default: false,
        },
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
             * 編集中のコンテンツデータ。初期値は親コンポーネントからわたってきたデータをコピー。UI連動。
             * @type {Object}
             */
            contentEdited: {...this.content},

            /**
             * リクエストに対するレスポンスがエラーの場合のメッセージを保持。
             *     UI表示連動し、メッセージを設定することでUIにメッセージ表示する。
             * @type {array<string>}
             */
            errors: [],
        }
    },

    emits: [
        'updated',
        'destroyed',
    ],

    methods: {

        /**
         * 編集モードを解除
         */
        cancelEdit() {
            this.contentEdited = {...this.content};
            this.isEditMode = false;
        },

        /**
         * コンテンツデータの更新。画像コンテンツかその他かで処理内容を分岐
         */
        update() {
            if (this.content.type === 'image') {
                this.uploadFile();
            } else {
                this.updateContent();
            }
        },

        /**
         * コンテンツの更新実行。APIでデータ更新後、親コンポーネントのUI表示を更新。
         */
        async updateContent() {

            this.isProcessing = true;
            try {

                this.errors = [];

                // APIリクエスト
                const content = this.$entities
                    .site(this.content.siteId)
                    .page(this.content.pageId)
                    .content(this.content.id);
                const response = await content.update(this.contentEdited);

                // 失敗の場合はエラー表示して終了
                if (!response.result) {
                    this.errors = response.messages;
                    return;
                }

                // 親コンポーネントへイベント通知し、UI更新
                this.$emit('updated', this.contentEdited);

                this.isEditMode = false;

            } finally {
                this.isProcessing = false;
            }

        },

        /**
         * 画像コンテンツの場合のアップロードと更新
         */
        uploadFile() {

            // フォームで指定されたローカルの画像データをbase64形式のデータとして読み取る
            const reader = new FileReader();
            reader.onload = (e) => {
                // 読み取り完了後、更新実行
                this.contentEdited.value = e.currentTarget.result;
                this.updateContent();
            }
            reader.readAsDataURL(this.contentEdited.value);

        },

        /**
         * コンテンツ削除
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
        },

        /**
         * 子コンポーネントでの入力値をUI表示に反映
         */
        setValue(value) {
            this.contentEdited.value = value;
        }
    },
};
</script>

<template>
    <v-container>
        
        <!-- コンテンツ内容表示 -->
        <div
            class="disp"
            v-show="!isEditMode"
            @click="this.isEditMode = true"
        >            
            <div class="text" v-if="content.type == 'text'">{{ content.value }}</div>
            <ul v-if="content.type == 'list'">
                <li v-for="(item, index) in content.value" :key="index">{{ item }}</li>
            </ul>
            <h2 v-if="content.type == 'title'">{{ content.value }}</h2>
            <pre v-if="content.type == 'code'">{{ content.value }}</pre>
            <img v-if="content.type == 'image'" :src="content.value">
        </div>
        
        <!-- コンテンツ編集フォーム -->
        <div class="edit" v-show="isEditMode">
            <v-textarea
                v-if="content.type=='text' || content.type=='code'"
                v-model="contentEdited.value"
                :disabled="isProcessing"
            ></v-textarea>
            <v-text-field
                v-if="content.type=='title'"
                v-model="contentEdited.value"
                :disabled="isProcessing"
            />
            <InputList
                v-if="content.type=='list'"
                :items="contentEdited.value"
                :isDisabled="isProcessing"
                @changeItems="setValue"
            ></InputList>
            <img v-if="content.type == 'image'" :src="content.value">
            <v-file-input
                v-if="content.type=='image'"
                :disabled="isProcessing"
                @change="setValue($event.target.files[0])"
            ></v-file-input>
            <ErrorDisplay :messages="errors"></ErrorDisplay>
            <EditorButtonSet
                :isProcessing="isProcessing"
                :isUseDestroy="isUseDestroy"
                @clickOk="update"
                @clickCancel="cancelEdit"
                @clickDestroy="destroy"
            ></EditorButtonSet>
            <ConfirmModal
                ref="confirmModal"
            ></ConfirmModal>
        </div>
    </v-container>  
</template>

<style lang="scss" scoped>
.buttons {
    margin-top: 5px;
}
.columns-layout {
    display: flex;

    .column {
        flex: 1;
    }
}
.disp {
    min-height: 20px;
    border: 1px dashed #26a69a;
    &:hover {
        border-style: solid;
        cursor: pointer;
    }
    .text {
        white-space: pre-wrap;
    }
    ul {
        margin-left: 15px;
    }
}
.edit {
    position: relative;
    border: 1px solid #26a69a;
    padding: 5px;
}
pre {
    background-color: #eeeeee;
    padding: 10px 20px;
}
</style>