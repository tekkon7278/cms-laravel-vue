<script>

/**
 * CMSの上部メニュー
 */
export default {
    
    props: {

        /**
         * 現在のCMS画面の機能タイトル表示
         * @type {string}
         */
        title: String,

        /**
         * メニューデータ
         * @type {array<Object>}
         */
        menus: {
            type: Array,
            defalut: [],
        },
    },

    emits: [
        'clickIcon',
    ],

}
</script>

<template>
    <v-app-bar
        density="compact"
        color="grey-darken-3"
    >
        <!-- CMS機能タイトル -->
        <v-app-bar-title
            class="text-subtitle-1"
        >{{ title }}</v-app-bar-title>

        <!-- CMSメニュー -->
        <v-btn
            v-for="(menu, index) in menus" :key="index"
            @click="$emit('clickIcon', menu.key)"
        >
            <v-icon
                class="mr-1"
            >mdi-{{ menu.icon }}</v-icon>
            {{ menu.text }}
        </v-btn>
    </v-app-bar>
</template>
