/**
 *
 * エンティティを表す基底クラス
 * @export
 * @class Entity
 */
export default class Entity {

    /**
     * コンストラクタ
     * @param {number} id
     * @memberof Entity
     */
    constructor(id) {
        this.setId(id);
    }

    /**
     * IDを設定する
     * @param {number} id
     * @returns {Entity} 
     * @memberof Entity
     */
    setId(id) {
        this.id = id;
        return this;
    }

    /**
     * IDを取得する
     * @returns {number} 
     * @memberof Entity
     */
    getId() {
        return this.id;
    }

    /**
     * 親エンティティを設定
     * @param {Entity} parentEntity 
     * @returns {Entity}
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
     * @memberof Entity
     */
    getRepository() {
        if (this.repository === undefined) {
            this.makeRepository();
        }
        return this.repository;        
    }

    /**
     * Repositoryのインスタンスを生成してクラス変数に設定
     * @memberof Entity
     */
    makeRepository() {
        this.repository = null;
    }

    /**
     * データ取得
     * @returns {Object}
     */
    async fetch() {
        const response = await this.getRepository().fetch(this.id);
        return response.data;
    }

    /**
     * データ更新
     * @param {Object} params 
     * @returns {Object}
     */
    async update(params) {
        const response = await this.getRepository().update(this.id, params);
        return {...response.data};        
    }

    /**
     * データ削除
     * @returns {Object}
     */
    async delete() {
        const response = await this.getRepository().destroy(this.id);
        return {...response.data};    
    }
}