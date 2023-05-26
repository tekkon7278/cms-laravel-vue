<script>
export default {
    
    props: {

        /**
         * ラジオボタン選択項目リストデータ
         * @type {array<Object>}
         */
        items: Array,
        
        /**
         * デフォルト選択値
         * @type {string|number}
         */
        defaultValue: {
            type: [String, Number],
            default: null
        },

        /**
         * 入力無効フラグ。親コンポーネントでの更新中などへの移行に連動して無効化する場合などに利用
         * @type {boolean}
         */
        isDisabled: {
            type: Boolean,            
            default: false
        },

    },

    emits: [
        'selected',
    ],
    
    data() {
        return {
            value: this.defaultValue,
        }
    },
};
</script>

<template>
    <v-radio-group
      inline
      v-model="value"
      @change="$emit('selected', $event.target.value)"
    >
        <v-radio
            v-for="(item, index) in items"
            :key="index"
            :label="item.label"
            :value="item.value"
            color="teal-lighten-1"
        ></v-radio>
    </v-radio-group>
</template>

<style lang="scss">
.radios {
    display: inline-block;
    margin-bottom: 10px;
    span {
        padding-left: 25px!important;
    }
    label {
        margin-inline-end: 10px;
    }
}
</style>
