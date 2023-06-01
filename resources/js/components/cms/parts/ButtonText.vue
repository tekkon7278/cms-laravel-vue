<script>

/**
 * テキスト型の四角形ボタン
 */
export default {
    props: {

        /**
         * ボタン表示テキスト
         * @type {string}
         */
        text: String,
        
        /**
         * テキストの左にアイコンを表示したい場合のアイコン名。MDIアイコンのキー。"mdi-"のプレフィックスはなしで指定
         * @type {string}
         */
        icon_name: {
            type: String,
            default: '',
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
        'clickButton',
    ],

};
</script>

<template>
    <v-btn
        size="small"
        :prepend-icon="'mdi-' + icon_name"
        :color="(isDisabled) ? 'grey' : 'teal-darken-3'"
        variant="tonal"
        @click="$emit('clickButton', $event)"
    >{{ text }}</v-btn>
</template>

<style lang="scss" scopled>
</style>