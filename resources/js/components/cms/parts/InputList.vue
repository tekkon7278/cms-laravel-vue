<script>
import ButtonIcon from "./ButtonIcon.vue";

/**
 * フォーム用リスト入力
 */
export default {

    components: {
        ButtonIcon,
    },

    props: {
        
        /**
         * 初期表示リストデータ
         * @type {array<string>}
         */
        items: {
            type: Array,
            default: []
        },

        /**
         * 全体の表示フラグ。falseで非表示になる
         * @type {boolean}
         */
        isShow: {
            type: Boolean,
            default: true
        },

        /**
         * 入力無効フラグ。親コンポーネントでの更新中などへの移行に連動して無効化する場合などに利用
         * @type {boolean}
         */
        isDisabled: {
            type: Boolean,            
            default: false
        }
    },

    data() {
        return {

            /**
             * 編集中のリストデータ
             * @type {array<string>}
             */
            editedItems: this.items,

        }
    },

    emits: [
        'changeItems'
    ],

    methods: {        

        /**
         * 新規の空項目を追加
         */
        addItem() {
            this.editedItems.push('');
            this.fireParentEvent();
        },

        /**
         * 指定インデックスの項目の削除
         */
        removeItem(index) {
            this.editedItems.splice(index, 1);
            this.fireParentEvent();
        },
        
        /**
         * 指定インデックスの項目値の更新
         */
        updateValue(index, event) {
            this.editedItems[index] = event.target.value;
            this.fireParentEvent();
        },

        /**
         * 親コンポーネントへリスト変更イベント通知。項目の追加・更新・削除いずれの場合にもイベント発生。
         */
        fireParentEvent() {
            this.$emit('changeItems', this.editedItems);
        }
        
    }
};
</script>

<template>
    <div class="input-list-container" v-show="isShow">
        <v-list class="pb-0">
            <v-list-item
                v-for="(item, index) in editedItems"
                :key="index" 
            >
                <v-text-field
                    hide-details="auto"
                    :model-value="item"
                    :disabled="isDisabled"
                    @blur="updateValue(index, $event)"
                >
                    <template v-slot:append>
                        <ButtonIcon
                            name="delete"
                            :isDisabled="isDisabled"
                            @clickIcon="removeItem(index)"
                        ></ButtonIcon>
                    </template>
                </v-text-field>
            </v-list-item>
        </v-list>
        <v-container class="py-0">
            <ButtonIcon
                className="text-h4"
                name="plus-circle"
                @clickIcon="addItem"
            ></ButtonIcon>
        </v-container>
    </div>
</template>

<style lang="scss" scoped>
</style>
