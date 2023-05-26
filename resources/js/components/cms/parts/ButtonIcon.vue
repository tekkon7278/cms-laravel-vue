<script>

/**
 * アイコン表示型のボタン
 */
export default {
    props: {

        /**
         * アイコン名。MDIアイコンのキー。"mdi-"のプレフィックスはなしで指定
         * @type {string}
         */
        name: String,
        
        /**
         * アイコンのタグにclassを設定したい場合に指定
         * @type {string}
         */
        className: {
            type: String,
            default: ''
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

    emits: [
        'clickIcon',
    ],

};
</script>

<template>
    <v-icon
        :class="['icon-button', className]"
        :color="(isDisabled) ? 'grey' : 'teal-lighten-1'"
        v-bind:disabled="isDisabled"
        @click="$emit('clickIcon', $event)"
    >mdi-{{ name }}</v-icon>
</template>

<style lang="scss" scopled>
.icon-button {
    cursor: pointer!important;
    margin-inline-end: 10px;
}
</style>