import Repository from './Repository.js';

/**
 * サイトデータ入出力のリポジトリクラス
 * @class SiteRepository
 * @extends {Repository}
 */
class SiteRepository extends Repository {

    /**
     * Creates an instance of SiteRepository.
     * @param {Object} params
     * @memberof SiteRepository
     */
    constructor(params) {
        super();
        this.setBasePath('/sites');
    }
}

export default SiteRepository;