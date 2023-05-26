<script>

export default {
    props: {
        isShow: Boolean
    },
};
</script>

<template>
    <v-progress-circular
        class="progress"
        indeterminate
        v-show="isShow"
        color="blue"
    ></v-progress-circular>
</template>

<style>
</style>