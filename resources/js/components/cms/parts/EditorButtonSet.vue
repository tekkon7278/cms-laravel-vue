<script>
import ButtonIcon from "./ButtonIcon.vue";
import Preloader from "./Preloader.vue";

/**
 * 編集フォームのボタン一式
 */
export default {

    components: {
        ButtonIcon,
        Preloader,
    },

    props: {
        
        /**
         * 処理中フラグ。親コンポーネントでの更新中などへの移行に連動して無効化する場合などに利用
         * @type {boolean}
         */
        isProcessing: {
            type: Boolean,            
            default: false,
        },

        /**
         * Okボタンの表示フラグ。不要な場合はfalseを指定。
         * @type {boolean}
         */
        isUseOk: {
            type: Boolean,            
            default: true,
        },

        /**
         * キャンセルボタンの表示フラグ。不要な場合はfalseを指定。
         * @type {boolean}
         */
        isUseCancel: {
            type: Boolean,            
            default: true,
        },

        /**
         * 削除ボタンの表示フラグ。不要な場合はfalseを指定。
         * @type {boolean}
         */
        isUseDestroy: {
            type: Boolean,            
            default: true,
        },

    },

    emits: [
        'clickOk',
        'clickCancel',
        'clickDestroy',
    ],

};
</script>

<template>
    <v-container class="buttons">
        <ButtonIcon
            v-if="isUseOk"
            name="check"
            :isDisabled="isProcessing"
            @clickIcon="$emit('clickOk')"
        ></ButtonIcon>
        <ButtonIcon
            v-if="isUseCancel"
            name="pencil-off"
            :isDisabled="isProcessing"
            @clickIcon="$emit('clickCancel')"
        ></ButtonIcon>
        <ButtonIcon
            v-if="isUseDestroy"
            name="delete"
            :isDisabled="isProcessing"
            @clickIcon="$emit('clickDestroy')"
        ></ButtonIcon>
        <Preloader
            :isShow="isProcessing"
        ></Preloader>
    </v-container>
</template>

<style lang="scss" scopled>
</style>