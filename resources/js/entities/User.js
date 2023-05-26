import EntityFactory from './EntityFactory.js';
import Entity from './Entity.js';
import Sites from './Sites.js';
import Site from './Site.js';

/**
 * ログインユーザーを表すクラス
 * @export
 * @class User
 * @extends {Entity}
 */
export default class User extends Entity {

    /**
     * ユーザーの所有するサイトリストを表すSitesのインスタンス取得
     * @returns {Sites} 
     * @memberof User
     */
    sites() {
        return EntityFactory.provide('Sites');
    }

    /**
     * ユーザーの所有するサイトを表すSiteクラスのインスタンスをサイトID指定で取得
     * @param {number} siteId
     * @returns {Site} 
     * @memberof User
     */
    site(siteId) {
        return EntityFactory.provide('Site', siteId);
    }
}
