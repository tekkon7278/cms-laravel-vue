import RepositoryFactory from '../repositories/RepositoryFactory.js';
import EntityFactory from './EntityFactory.js';
import Entity from './Entity.js';
import Pages from './Pages.js';
import Page from './Page.js';

/**
 * サイトを表すエンティティクラス
 * @export
 * @class Site
 * @extends {Entity}
 */
export default class Site extends Entity {

    /**
     * SiteRepositoryのインスタンスを生成してクラス変数に設定
     * @memberof Site
     */
    makeRepository() {
        this.repository = RepositoryFactory.provide('Site');
    }
    
    /**
     * サイトのページリストを表すPagesクラスのインスタンス取得
     * @returns {Pages} 
     * @memberof Site
     */
    pages() {
        return EntityFactory.provide('Pages').setParent(this);
    }

    /**
     * サイトのページを表すPageクラスのインスタンスをページID指定で取得
     * @param {number} pageId
     * @returns {Page} 
     * @memberof Site
     */
    page(pageId) {
        return EntityFactory.provide('Page', pageId).setParent(this);
    }
}