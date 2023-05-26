import Entity from './Entity.js';
import EntityCollection from './EntityCollection.js';
import User from './User.js';
import Site from './Site.js';
import Sites from './Sites.js';
import Page from './Page.js';
import Pages from './Pages.js';
import Content from './Content.js';
import Contents from './Contents.js';

/**
 * 文字列のエンティティ名称とそれに対応するエンティティクラスのマッピング
 * @type {Object}
 */
const entities = {
    User: User,
    Site: Site,
    Sites: Sites,
    Page: Page,
    Pages: Pages,
    Content: Content,
    Contents: Contents,
}

/**
 * エンティティクラスを生成するのファクトリ
 * @class EntityFactory
 */
export default class EntityFactory {

    /**
     * nameに該当するリポジトリクラスを取得
     * @static
     * @param {string} name
     * @param {number} id
     * @returns {Entity|EntityCollection} 
     * @memberof EntityFactory
     */
    static provide(name, id) {
        return new entities[name](id);
    }
}
