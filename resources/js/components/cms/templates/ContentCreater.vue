<script>
import EditorButtonSet from "../parts/EditorButtonSet.vue";
import InputRadios from "../parts/InputRadios.vue";
import InputList from "../parts/InputList.vue";
import ErrorDisplay from "../parts/ErrorDisplay.vue";
import ConfirmModal from "../modal/Confirm.vue";
import Preloader from "../parts/Preloader.vue";

export default {

    components: {
        EditorButtonSet,
        InputRadios,
        InputList,
        ErrorDisplay,
        ConfirmModal,
        Preloader
    },

    props: {

        /**
         * サイトID
         * @type {number}
         */
        siteId: Number,

        /**
         * ページID
         * @type {number}
         */
        pageId: Number,
        
        /**
         * 直前コンテンツID
         * @type {number}
         */
        beforeContentId: Number,
    },

    emits: [
        'created'
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
             * コンテンツ編集でのコンテンツタイプが「コンテンツ」「段組みレイアウト」か。UI表示連動。
             * @type {string}
             */
            currentTab: 'content',

            /**
             * リクエストに対するレスポンスがエラーの場合のメッセージを保持。
             *     UI表示連動し、メッセージを設定することでUIにメッセージ表示する。
             * @type {array<string>}
             */
            errors: [],
            
            /**
             * 登録するコンテンツデータのテンプレート。
             * @type {Object}
             */
            content: {
                siteId: this.siteId,
                pageId: this.pageId,
                beforeContentId: this.beforeContentId,
                type: 'text',
                value: null,
            },

            /**
             * コンテンツタイプの選択項目
             * @type {array<Object>}
             */
            typeSelections: [
                {value: 'text', label: 'テキスト'},
                {value: 'title', label: 'タイトル'},
                {value: 'code', label: 'コード'},
                {value: 'list', label: 'リスト'},
                {value: 'image', label: '画像'}
            ],

            /**
             * 段組みレイアウトのカラム数選択項目
             * @type {array<Object>}
             */
            columnsLayoutSelections: [
                {value: 2, label: '2'},
                {value: 3, label: '3'},
                {value: 4, label: '4'}
            ],

            /**
             * 段組みレイアウトの各カラムのコンテンツタイプ選択値
             * @type {array<string>}
             */
            columnTypes: ['text', 'text']
        }
    },

    methods: {

        /**
         * 編集モードを解除
         */
        cancelEdit() {
            this.content.type = 'text';
            this.content.value = null;
            this.isEditMode = false;
        },

        /**
         * コンテンツの登録。画像コンテンツかその他かで処理内容を分岐
         */
        create() {
            if (this.currentTab === 'columns') {
                this.content.type = 'columns';
            }
            if (this.content.type === 'image') {
                this.uploadFile();
            } else {
                this.createContent();
            }
        },

        /**
         * コンテンツの登録実行。APIでデータ登録後、親コンポーネントのUI表示を更新。
         */
        async createContent() {

            this.isProcessing = true;
            try {
                this.errors = [];

                // APIリクエスト
                const contentEdited = {...this.content};
                const contents = this.$entities
                    .site(this.content.siteId)
                    .page(this.content.pageId)
                    .contents();
                const response = await contents.create(contentEdited);

                // 失敗の場合はエラー表示して終了
                if (!response.result) {
                    this.errors = response.messages;
                    return;
                }

                // 親コンポーネントへイベント通知し、UI更新
                contentEdited.id = response.id;
                this.$emit('created', contentEdited);

                this.cancelEdit();

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
                this.content.value = e.currentTarget.result;
                this.createContent();
            }
            reader.readAsDataURL(this.content.value);
        },

        onSelectType(selectedValue) {
            this.content.type = selectedValue;
            this.content.value = null;
        },

        onChangeValue(value) {
            this.content.value = value;
        },

        onChangeColumnType(columnIndex, type) {
            this.columnTypes[columnIndex] = type;
            this.content.value = this.columnTypes;
        },

        onSelectColumnCount(selectedColumnCount) {
            let curLen = this.columnTypes.length;
            let addCount = selectedColumnCount - curLen;
            for (let i = 0; i < Math.abs(addCount); i++) {
                if (addCount > 0) {
                    this.columnTypes.push('text');
                } else {
                    this.columnTypes.pop();                        
                }
            }
        },
    }
}
</script>

<template>
    <v-container :class="['new', { 'on-edit' : (isEditMode) }]">

        <!-- 追加アイコン -->
        <div
            class="disp icon"
            v-show="!isEditMode"
            @click="this.isEditMode = true"
        >
            <v-icon color="teal-lighten-1">mdi-loupe</v-icon>          
        </div>
        
        <!-- 追加フォーム -->
        <div class="edit" v-show="isEditMode">
            
            <!-- 通常コンテンツか段組みレイアウトかの選択 -->
            <v-btn-toggle
                v-model="currentTab"
                rounded="0"
                color="teal-lighten-1"
                group
                variant="elevated"
                @update:modelValue="content.value=''"
            >
                <v-btn value="content">コンテンツ</v-btn>
                <v-btn value="columns">段組みレイアウト</v-btn>
            </v-btn-toggle>

            <!-- 通常コンテンツ -->
            <div class="tab-content" v-show="currentTab=='content'">

                <!-- コンテンツ種別選択 -->
                <InputRadios
                    :items="typeSelections"
                    :defaultValue="content.type"
                    :isDisabled="isProcessing"
                    @selected="onSelectType"
                ></InputRadios>
                
                <!-- コンテンツ種別：テキスト -->
                <v-textarea
                    v-show="content.type=='text' || content.type=='code'"
                    v-model="content.value"
                    :disabled="isProcessing"
                ></v-textarea>

                <!-- コンテンツ種別：タイトル -->
                <v-text-field
                    v-show="content.type=='title'"
                    v-model="content.value"
                    :disabled="isProcessing"
                ></v-text-field>
                
                <!-- コンテンツ種別：リスト -->
                <InputList
                    :isShow="content.type=='list'"
                    :isDisabled="isProcessing"
                    @changeItems="onChangeValue"
                ></InputList>
                
                <!-- コンテンツ種別：画像 -->
                <v-file-input
                    v-show="content.type=='image'"
                    :disabled="isProcessing"
                    @change="onChangeValue($event.target.files[0])"
                ></v-file-input>
                
                <!-- 入力エラー表示領域-->
                <ErrorDisplay :messages="errors"></ErrorDisplay>

            </div>
            
            <!-- 段組みレイアウト -->
            <div class="tab-columns" v-show="currentTab=='columns'">

                <!-- カラム数の選択 -->
                <span>カラム数</span>
                <InputRadios
                    :items="[
                        {value: 2, label: '2'},
                        {value: 3, label: '3'},
                        {value: 4, label: '4'}
                    ]"
                    :defaultValue="2"
                    :isDisabled="isProcessing"
                    @selected="onSelectColumnCount"
                ></InputRadios>

                <!-- 各カラムのコンテンツ種別の選択 -->
                <div class="columns-type">
                    <div class="" v-for="(columnType, index) in columnTypes" :key="index">
                        <InputRadios
                            :items="typeSelections"
                            :defaultValue="columnType.value"
                            :isDisabled="isProcessing"
                            @selected="onChangeColumnType(index, $event)"
                        ></InputRadios>
                    </div>
                </div>

            </div>

            <!-- ボタン -->
            <EditorButtonSet
                :isProcessing="isProcessing"
                :isUseDestroy="false"
                @clickOk="create"
                @clickCancel="cancelEdit"
                @clickDestroy="destroy"
            ></EditorButtonSet>

        </div>
        
    </v-container>
</template>

<style lang="scss" scoped>
.new {
    position: relative;
    border-bottom: 1px solid transparent;
    min-height: auto;
    &:hover {
        /*
        &:not(.on-edit) {
            border-bottom: 1px solid #4db6ac;
        }
        */
        border-bottom: 1px solid #4db6ac;
    }
    
    &:not(.on-edit) {
        padding: 0;
    }
}
.disp.icon {
    position: absolute;
    bottom: -4px;
    left: -20px;
    border: none;

    &:hover {
        cursor: pointer;
    }
    i {
        color: #4db6ac;
    }
}
.edit {    
    border: 1px solid #26a69a;
    padding: 5px;
}
ul.tab {
    display: flex;
    margin: 0 0 20px 0;

    li {
        margin-right: 15px;
        padding: 8px 0;
        width: 160px;
        text-align: center;
        border-bottom: 1px solid #999999;

        a {
            display: block;
            padding: auto;
            color: #333333;
        }
    }
}
.tab-buttons {
    margin-bottom: 15px;
    button {
        width: 160px;
        margin-inline-end: 5px;
        background-color: #1d7d74;
        &.selected {
            background-color: #2bbbad;
        }
    }
}
.tab-columns {
    span {
        margin-inline-end: 10px;
    }
}
</style>