import Repository from './Repository.js';

/**
 * コンテンツデータ入出力のリポジトリクラス
 * @class ContentRepository
 * @extends {Repository}
 */
class ContentRepository extends Repository {

    /**
     * Creates an instance of ContentRepository.
     * @param {Object} params
     * @memberof ContentRepository
     */
    constructor(params) {
        super();
        this.setBasePath('/sites/' + params.siteId + '/pages/' + params.pageId + '/contents');
    }
}

export default ContentRepository;