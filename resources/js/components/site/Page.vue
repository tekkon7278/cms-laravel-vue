<script>
import SiteHeader from "../cms/templates/SiteHeader.vue";

export default {
    
    components: {
        SiteHeader,
    },

    props: {

        /**
         * サイトID
         * @type {number}
         */
        siteId: {
            type: Number,
            default: null,
        },

        /**
         * ページID
         * @type {number}
         */
        pageId: {
            type: Number,
            default: null,
        },

    },

    data() {
        return {

            /**
             * サイトデータ。UI連動。
             * @type {Object}
             */
            page: {},

            /**
             * サイトのコンテンツデータ。UI連動。
             * @type {array<Object>}
             */
            contents: [],

        }
    },

    beforeMount() {

        // 初期表示時にページ表示に必要なデータを遅延取得しコンテンツ描画
        this.getPage();
        this.getContents();
    },

    methods: {

        /**
         * ページデータを取得
         */
        async getPage() {
            this.page = await this.$entities
                .site(this.siteId)
                .page(this.pageId)
                .fetch();
        },

        /**
         * ページのコンテンツデータを取得
         */
        async getContents() {
            this.contents = await this.$entities
                .site(this.siteId)
                .page(this.pageId)
                .contents()
                .fetchAll();
        },
    },
};
</script>

<template>

<v-app>
    
    <!-- サイトヘッダ表示 -->
    <SiteHeader :siteId="siteId"></SiteHeader>

    <v-main>
        <v-container class="my-6">
            
            <h1 v-if="page.isShowTitle">{{ page.title }}</h1>            
            <v-container>
                
                <!-- コンテンツ表示 -->
                <v-container
                    v-for="content in contents" :key="content.id"
                >
                
                    <!-- 通常コンテンツ -->
                    <div class="text" v-if="content.type == 'text'">{{ content.value }}</div>
                    <ul v-if="content.type == 'list'">
                        <li v-for="(item, index) in content.value" :key="index">{{ item }}</li>
                    </ul>
                    <h2 v-if="content.type == 'title'">{{ content.value }}</h2>
                    <pre v-if="content.type == 'code'">{{ content.value }}</pre>
                    <img v-if="content.type == 'image'" :src="content.value">
                    
                    <!-- 段組みレイアウトコンテンツ -->
                    <v-row  v-if="content.type == 'columns'">
                        <v-col
                            class="column"
                            v-for="(innerContent, index) in content.value"
                            :key="index"
                        >
                            <v-container class="pa-0">
                                <div class="text" v-if="innerContent.type == 'text'">{{ innerContent.value }}</div>
                                <ul v-if="innerContent.type == 'list'">
                                    <li v-for="(item, index) in innerContent.value" :key="index">{{ item }}</li>
                                </ul>
                                <h2 v-if="innerContent.type == 'title'">{{ innerContent.value }}</h2>
                                <pre v-if="innerContent.type == 'code'">{{ innerContent.value }}</pre>
                                <img v-if="innerContent.type == 'image'" :src="innerContent.value">
                            </v-container>
                        </v-col>
                    </v-row>
                </v-container>

            </v-container>
        </v-container>  
    </v-main>
</v-app>

</template>

<style lang="scss" scoped>
.columns-layout {
    display: flex;

    .column {
        flex: 1;
    }
}
.text {
    white-space: pre-wrap;
}
ul {
    margin-left: 15px;
}
pre {
    background-color: #eeeeee;
    padding: 10px 20px;
}
</style>
