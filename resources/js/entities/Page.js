import RepositoryFactory from '../repositories/RepositoryFactory.js';
import EntityFactory from './EntityFactory.js';
import Entity from './Entity.js';
import Contents from './Contents.js';
import Content from './Content.js';

/**
 * ページを表すエンティティクラス
 * @export
 * @class Page
 * @extends {Entity}
 */
export default class Page extends Entity {
    
    /**
     * PageRepositoryのインスタンスを生成してクラス変数に設定
     * @memberof Page
     */
    makeRepository() {
        this.repository = RepositoryFactory.provide('Page', {
            siteId: this.getParent().getId()
        });
    }
    
    /**
     * ページのコンテンツリストを表すContentsクラスのインスタンス取得
     * @returns {Contents} 
     * @memberof Page
     */
    contents() {
        return EntityFactory.provide('Contents').setParent(this);
    }

    /**
     * ページのコンテンツを表すContentクラスのインスタンスをコンテンツID指定で取得
     * @param {number} contentId
     * @returns {Content} 
     * @memberof Page
     */
    content(contentId) {
        return EntityFactory.provide('Content', contentId).setParent(this);
    }
}