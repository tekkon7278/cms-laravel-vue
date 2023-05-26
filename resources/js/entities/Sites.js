import RepositoryFactory from '../repositories/RepositoryFactory.js';
import EntityCollection from './EntityCollection.js';

/**
 * サイトのエンティティの集合を表すクラス
 * @export
 * @class Sites
 * @extends {EntityCollection}
 */
export default class Sites extends EntityCollection {

    /**
     * SiteRepositoryのインスタンスを生成してクラス変数に設定
     * @memberof Sites
     */
    makeRepository() {
        this.repository = RepositoryFactory.provide('Site');
    }
    
}