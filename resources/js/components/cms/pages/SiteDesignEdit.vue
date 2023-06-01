<script>
import CmsHeader from "../templates/CmsHeader.vue";
import SiteHeader from "../templates/SiteHeader.vue";
import CmsSiteMenu from "../templates/CmsSiteMenu.vue";

export default {

    components: {
        CmsHeader,
        CmsSiteMenu,
        SiteHeader,
    },

    data() {
        return {

            /**
             * サイトID
             * @type {number}
             */
            siteId: null,
            
            /**
             * カラー設定。UI連動
             * @type {string}
             */
            color: 'blue',
            
            /**
             * カラー濃度設定。UI連動
             * @type {number}
             */
            density: 2,
            
            // フォント系未実装
            fontSize: 1,
            fontColorNumber: 3,
            fontColors: {
                1: 'grey-darken-3',
                2: 'grey-darken-4',
                3: 'black',
            }
        }
    },

    computed: {

        colorTheme: {
            get() {
                // データ更新用の値生成
                return this.color + '_' + this.density;
            },
            set(value) {    
                // 画面連動の変数用にデータ分割
                const splited = value.split('_');
                this.color = splited[0];
                this.density = splited[1];
            },
        },

    },

    beforeMount() {

        // URLからサイトIDを読み取り、APIでデータ取得してカラー設定適用
        this.siteId = this.$router.currentRoute.value.params.siteId;
        this.getColorTheme();
    },

    methods: {

        /**
         * サイトデータを取得し、連動するカラー設定の変数へセットすることでUIへ反映
         */
        async getColorTheme() {
            const site = await this.$entities.site(this.siteId).fetch();
            this.colorTheme = site.colorTheme;
        },

        /**
         * UIでカラー設定変更時、APIで更新実行し、Vuetifyのテーマ設定を変更することで画面表示への反映
         */
        async changeColorTheme() {
            const response = await this.$entities.site(this.siteId).update({
                color_theme: this.colorTheme,
            });
            if (!response.result) {
                return;
            }
            this.$vuetify.theme.global.name = this.colorTheme;
        },

        // 未実装
        onSelectSpacing() {            
        },
        onSelectFontSize() {            
        },
        onSelectFontColor() {            
        },

    },
};
</script>

<template>

<CmsHeader title="デザイン設定"></CmsHeader>
<CmsSiteMenu :siteId="siteId"></CmsSiteMenu>

<v-main :style="'font-size:' + fontSize + 'rem;'">
    <SiteHeader :siteId="siteId"></SiteHeader>
    <v-container class="my-6">

        <h2>カラー</h2>

        <!-- カラー系統選択 -->
        <v-row>
            <v-col>
                <v-btn-toggle
                    v-model="color"
                    divided
                    variant="outlined"
                    @update:modelValue="changeColorTheme"
                >
                    <v-btn value="grey" color="grey-darken-2">モノトーン</v-btn>
                    <v-btn value="blue" color="blue">ブルー系</v-btn>
                    <v-btn value="red" color="red">レッド系</v-btn>
                    <v-btn value="green" color="green">グリーン系</v-btn>
                    <v-btn value="purple" color="purple">パープル系</v-btn>
                    <v-btn value="orange" color="orange">オレンジ系</v-btn>
                </v-btn-toggle>
            </v-col>
        </v-row>

        <!-- カラー濃度選択 -->
        <v-row align="center">
            <v-col cols="1">濃度</v-col>
            <v-col cols="5" class="pt-7">
                <v-slider
                    v-model="density"
                    min="1"
                    max="3"
                    step="1"
                    show-ticks="always"
                    tick-size="4"
                    :ticks="{1: '薄', 2: '中', 3: '濃'}"
                    @update:modelValue="changeColorTheme"
                ></v-slider>
            </v-col>
        </v-row>
        
        <!-- ※以降、機能未実装 -->

        <h2>スペーシング</h2>
        <v-row align="center">
            <v-col cols="1">マージン</v-col>
            <v-col cols="5" class="pt-7">
                <v-slider
                    min="1"
                    max="3"
                    step="1"
                    show-ticks="always"
                    tick-size="4"
                    :ticks="{1: '小', 2: '中', 3: '大'}"
                    @update:modelValue="onSelectSpacing"
                ></v-slider>
            </v-col>
        </v-row>

        <h2>フォント</h2>
        <v-row align="center">
            <v-col cols="1">サイズ</v-col>
            <v-col cols="5" class="pt-7">
                <v-slider
                    v-model="fontSize"
                    min="0.8"
                    max="1.2"
                    step="0.2"
                    show-ticks="always"
                    tick-size="4"
                    :ticks="{0.8: '小', 1.0: '中', 1.2: '大'}"
                    @update:modelValue="onSelectFontSize"
                ></v-slider>
            </v-col>
        </v-row>
        
        <v-row align="center">
            <v-col cols="1">濃度</v-col>
            <v-col cols="5" class="pt-7">
                <v-slider
                    min="1"
                    max="3"
                    step="1"
                    show-ticks="always"
                    tick-size="4"
                    :ticks="{1: '薄', 2: '中', 3: '濃'}"
                    @update:modelValue="onSelectFontColor"
                ></v-slider>
            </v-col>
        </v-row>

    </v-container>
</v-main>
</template>

<style>
</style>