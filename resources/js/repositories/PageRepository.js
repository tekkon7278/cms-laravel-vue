import Repository from './Repository.js';

/**
 * ページデータ入出力のリポジトリクラス
 * @class PageRepository
 * @extends {Repository}
 */
class PageRepository extends Repository {

    /**
     * Creates an instance of PageRepository.
     * @param {Object} params
     * @memberof PageRepository
     */
    constructor(params) {
        super();
        this.setBasePath('/sites/' + params.siteId + '/pages');
    }
}

export default PageRepository;