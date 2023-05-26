import RepositoryFactory from '../repositories/RepositoryFactory.js';
import EntityCollection from './EntityCollection.js';

/**
 * ページのエンティティの集合を表すクラス
 * @export
 * @class Pages
 * @extends {EntityCollection}
 */
export default class Pages extends EntityCollection {

    /**
     * PageRepositoryのインスタンスを生成してクラス変数に設定
     * @memberof Pages
     */
    makeRepository() {
        this.repository = RepositoryFactory.provide('Page', {
            siteId: this.getParent().getId(),
        });
    }
}