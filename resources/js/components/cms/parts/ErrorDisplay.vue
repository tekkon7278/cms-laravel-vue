<script>

/**
 * エラーメッセージ表示領域
 */
export default {

    props: {

        /**
         * エラーメッセージの配列
         * @type {array<string>}
         */
        messages: {
            type: Array,
            default: []
        }
    },

};
</script>

<template>
    <ul class="errors" v-show="messages.length > 0">
        <li v-for="message in messages" :key="message">{{ message }}</li>
    </ul>
</template>

<style lang="scss">
.errors {
    margin: 0 0 0 20px;
    padding: 0;
    li {
        margin: 0;
        padding: 0;
        float: none;
        color: #ff0000;
    }
}
</style>