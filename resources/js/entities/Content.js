import RepositoryFactory from '../repositories/RepositoryFactory.js';
import Entity from './Entity.js';

/**
 * コンテンツを表すエンティティクラス
 * @export
 * @class Content
 * @extends {Entity}
 */
export default class Content extends Entity {
    
    /**
     * ContentRepositoryのインスタンスを生成してクラス変数に設定
     * @memberof Content
     */
    makeRepository() {
        this.repository = RepositoryFactory.provide('Content', {
            siteId: super.getParent().getParent().getId(),
            pageId: super.getParent().getId(),
        });
    }
}