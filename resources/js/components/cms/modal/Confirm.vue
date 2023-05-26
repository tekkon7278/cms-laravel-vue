<script>
export default {
    props: {
    },
    data() {
        return {
            isOpened: false,
            message: '',
        }
    },
    methods: {
        sleep() {
            return new Promise((resolve) => {
                setTimeout(resolve, 100);
            });
        },
        open(message) {
            return new Promise(async (resolve) => {
                this.message = message;
                this.isOpened = true;
                while (this.isOpened) {
                    await this.sleep();
                }
                resolve(this.isOk);
            });
        },
        close() {
            this.message = '';
            this.isOpened = false;
        },
        closeOk() {
            this.isOk = true;
            this.close();
        },
        closeCancel() {
            this.isOk = false;
            this.close();
        }
    },
};
</script>

<template>
    <v-dialog
        v-model="isOpened"
        persistent
        width="auto"
        min-width="400"
    >
        <v-card>
            <v-card-text class="ma-3">{{ message }}</v-card-text>
            <v-divider thickness="1"></v-divider>
            <v-card-actions class="justify-end">
                <v-btn @click="closeCancel" color="primary">キャンセル</v-btn>
                <v-btn @click="closeOk" color="primary">OK</v-btn>
            </v-card-actions>  
        </v-card>
    </v-dialog>
</template>

<style lang="scss">
</style>