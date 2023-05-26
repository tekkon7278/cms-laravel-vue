import Repository from '../repositories/Repository.js';
import Entity from './Entity.js';

/**
 * エンティティのリストを表す基底クラス
 * @export
 * @class EntityCollection
 */
export default class EntityCollection {

    /**
     * 親エンティティを設定
     * @param {Entity} parentEntity 
     * @returns {EntityCollection}
     */
    setParent(parentEntity) {
        this.parentEntity = parentEntity;
        return this;
    }

    /**
     * 親エンティティを取得
     * @returns {Entity}
     */
    getParent() {
        return this.parentEntity;
    }

    /**
     * Repositoryのインスタンスを取得
     * @returns {Repository} 
     * @memberof EntityCollection
     */
    getRepository() {
        if (this.repository === undefined) {
            this.makeRepository();
        }
        return this.repository;        
    }

    /**
     * Repositoryのインスタンスを生成してクラス変数に設定
     * @memberof EntityCollection
     */
    makeRepository() {
        this.repository = null;
    }

    /**
     * リストデータ取得
     * @returns {array}
     */
    async fetchAll() {
        const response = await this.getRepository().fetchAll();
        return response.data;
    }

    /**
     * 登録
     * @param {Object} params 
     * @returns {Object}
     */
    async create(params) {
        const response = await this.getRepository().store(params);
        return {...response.data};        
    }
}