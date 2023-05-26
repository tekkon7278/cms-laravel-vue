import RepositoryFactory from '../repositories/RepositoryFactory.js';
import EntityCollection from './EntityCollection.js';

/**
 * コンテンツのエンティティの集合を表すクラス
 * @export
 * @class Contents
 * @extends {EntityCollection}
 */
export default class Contents extends EntityCollection {

    makeRepository() {
        this.repository = RepositoryFactory.provide('Content', {
            siteId: super.getParent().getParent().getId(),
            pageId: super.getParent().getId(),
        });
    }

}