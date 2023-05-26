import SiteRespository from './SiteRepository.js';
import PageRespository from './PageRepository.js';
import ContentRespository from './ContentRepository.js';
import Repository from './Repository.js';

/** @type {Object} */
const repositories = {
    Site: SiteRespository,
    Page: PageRespository,
    Content: ContentRespository,
}

/**
 * リポジトリクラスのインスタンスを生成するファクトリ
 * @class RepositoryFactory
 */
class RepositoryFactory {

    /**
     * nameに該当するリポジトリクラスを取得
     * @param {string} name
     * @param {Object} params
     * @returns {Repository} 
     * @memberof RepositoryFactory
     */
    static provide(name, params) {
        return new repositories[name](params);
    }
}

export default RepositoryFactory;
