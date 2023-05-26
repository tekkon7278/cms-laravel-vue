<script>
import ButtonIcon from "../parts/ButtonIcon.vue";
import EditorButtonSet from "../parts/EditorButtonSet.vue";
import Preloader from "../parts/Preloader.vue";
import ErrorDisplay from "../parts/ErrorDisplay.vue";
import { nextTick } from "vue/dist/vue.esm-bundler";

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
         * 表示する画像データ
         * @type {string}
         */
        value: String,

        /**
         * Siteエンティティの対象項目名
         * @type {string}
         */
        entityKey: String,
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
             * フォームの入力値(ファイルパス)
             * @type {string}
             */
            file: '',

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
        }
    },

    methods: {

        /**
         * 編集モードを解除
         */
        cancelEdit() {
            this.$emit('canceled');
            this.isEditMode = false;
        },

        /**
         * サイトデータの更新実行。APIでデータ更新後、親コンポーネントのUI表示を更新。
         */
        // async update() {

        //     this.isProcessing = true;
        //     try {

        //         // APIリクエスト
        //         const response = await this.$entities.site(this.siteId).update({
        //             [this.entityKey]: this.editedValue,
        //         });

        //         // 失敗の場合はエラー表示して終了
        //         if (!response.result) {
        //             this.errors = response.messages;
        //             return;
        //         }

        //         await nextTick();

        //         // 親コンポーネントへイベント通知し、UI更新
        //         this.$emit('updated', this.editedValue);

        //         this.isEditMode = false;
        //     } finally {
        //         this.isProcessing = false;
        //     }
        // },

        /**
         * 子コンポーネントのUIで入力された値を変数に保持
         * @param {string} file
         */
        setLogoPath(file) {
            this.file = file;
        },

        /**
         * 画像コンテンツの場合のアップロードと更新
         */
        uploadLogoImage() {
            
            this.isProcessing = true;
            this.errors = [];
            
            // フォームで指定されたローカルの画像データをbase64形式のデータとして読み取る
            const reader = new FileReader();
            reader.onload = (e) => {
                // 読み取り完了後、更新実行
                this.updateLogoImage(e.currentTarget.result);
            }
            reader.readAsDataURL(this.file);
        },

        /**
         * サイトデータの更新実行。APIでデータ更新後、親コンポーネントのUI表示を更新。
         */
        async updateLogoImage(base64Image) {

            try {
                this.errors = [];

                // APIリクエスト
                const response = await this.$entities.site(this.siteId).update({
                    [this.entityKey]: base64Image,
                });

                // 失敗の場合はエラー表示して終了
                if (!response.result) {
                    this.errors = response.messages;
                    return;
                }
                
                // 親コンポーネントへイベント通知し、UI更新
                this.$emit('updated', base64Image);

                this.file = null;
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
        <img :src="value">
        <ButtonIcon
            name="pencil"
            @clickIcon="isEditMode=true"
        ></ButtonIcon>
    </div>
    <div class="edit" v-show="isEditMode">
        <v-file-input
            :disabled="isProcessing"
            :hide-details="true"
            @change="setLogoPath($event.target.files[0])"
        ></v-file-input>
        <ErrorDisplay :messages="errors"></ErrorDisplay>
        <EditorButtonSet
            :isProcessing="isProcessing"
            :isUseDestroy="false"
            @clickOk="uploadLogoImage"
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