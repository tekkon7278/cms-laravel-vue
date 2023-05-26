import EntityFactory from './EntityFactory.js';

export default {
    /**
     * vueコンポーネントでプラグインとして機能するために必要な実装
     * コンポーネント内でthis.$repositoryFactoryでRepositoryFactoryのインスタンスを得る
     * @param {*} app
     */
    install(app) {
        const user = EntityFactory.provide('User');
        app.config.globalProperties.$entities = user;
    }
}

