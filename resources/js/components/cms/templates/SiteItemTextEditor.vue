<script>
import ButtonIcon from "../parts/ButtonIcon.vue";
import EditorButtonSet from "../parts/EditorButtonSet.vue";
import Preloader from "../parts/Preloader.vue";
import ErrorDisplay from "../parts/ErrorDisplay.vue";

export default {

    components: {
        ButtonIcon,
        EditorButtonSet,
        Preloader,
        ErrorDisplay,
    },
    
    props: {

        /**
         * サイトID
         * @type {number}
         */
        siteId: Number,

        /**
         * 表示・編集対象データ項目名
         * @type {string}
         */
        entityKey: String,

        /**
         * 表示・編集対象データ値
         * @type {string}
         */
        value: String,

    },

    emits: [
        'updated',
        'input',
        'canceled'
    ],

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
             * リクエストに対するレスポンスがエラーの場合のメッセージを保持。
             *     UI表示連動し、メッセージを設定することでUIにメッセージ表示する。
             * @type {array<string>}
             */
            errors: []
        }
    },

    computed: {
        editedValue: {
            get() {
                return this.value;
            },
            set(value) {
                // データ入力の都度呼び出されるイベント。親コンポーネントの保持値へも反映するために通知。
                this.$emit('input', value);
            }
        }
    },

    methods: {

        /**
         * 編集モードを解除
         */
        cancelEdit() {
            this.$emit('canceled');
            this.isEditMode = false;
            this.errors = [];
        },

        /**
         * サイトデータの更新実行。APIでデータ更新後、親コンポーネントのUI表示を更新。
         */
        async update() {

            this.isProcessing = true;
            try {
                this.errors = [];

                // APIリクエスト
                const response = await this.$entities.site(this.siteId).update({
                    [this.entityKey]: this.editedValue,
                });

                // 失敗の場合はエラー表示して終了
                if (!response.result) {
                    this.errors = response.messages;
                    return;
                }

                // 親コンポーネントへイベント通知し、UI更新
                this.$emit('updated', this.editedValue);

                this.isEditMode = false;
            } finally {
                this.isProcessing = false;
            }
        },

    },
};
</script>

<template>
    <div class="disp" v-show="!isEditMode">
        <span>{{ editedValue }}</span>
        <ButtonIcon
            name="pencil"
            @clickIcon="isEditMode=true"
        ></ButtonIcon>
    </div>
    <div class="edit" v-show="isEditMode">
        <v-text-field
            v-model="editedValue"
            :disabled="isProcessing"
            :hide-details="true"
        ></v-text-field>
        <ErrorDisplay :messages="errors"></ErrorDisplay>
        <EditorButtonSet
            :isProcessing="isProcessing"
            :isUseDestroy="false"
            @clickOk="update"
            @clickCancel="cancelEdit"
            @clickDestroy="destroy"
        ></EditorButtonSet>
    </div>
</template>

<style lang="scss" scoped>
.disp {
    span {
        margin-inline-end: 10px;
    }
}
</style>