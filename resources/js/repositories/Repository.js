import axios from 'axios';

axios.defaults.baseURL = '/api';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error);
    }
);

/**
 * リポジトリのベースクラス
 *
 * @export
 * @class Repository
 */
export default class Repository {    

    /**
     * Creates an instance of Repository.
     * @memberof Repository
     */
    constructor() {
        // axiosはRepositoryで内包
        this.axios = axios;
    }
    
    /**
     * リクエスト先URLのベースパスを設定
     *
     * @param {string} basePath
     * @memberof Repository
     */
    setBasePath(basePath) {
        this.basePath = basePath;
    }

    /**
     * リクエストURLを取得
     *
     * @param {number} id リソースのID
     * @returns {string} リクエストURL
     * @memberof Repository
     */
    getUrl(id) {
        let url = this.basePath;
        if (id !== undefined) {
            url += '/' + id;
        }
        return url;
    }

    /**
     * ID指定でGET
     *
     * @param {number} id
     * @param {Object} params
     * @returns {Object} 
     * @memberof Repository
     */
    fetch(id, params) {
        return axios.get(this.getUrl(id), params);
    }

    /**
     * リストGET
     *
     * @param {Object} params
     * @returns {Object} 
     * @memberof Repository
     */
    fetchAll(params) {
        return axios.get(this.getUrl(), params);
    }

    /**
     * POST
     *
     * @param {Object} params
     * @returns {Object} 
     * @memberof Repository
     */
    store(params) {
        return axios.post(this.getUrl(), params);
    }

    /**
     * ID指定でUPDATE
     *
     * @param {number} id
     * @param {Object} params
     * @returns {Object} 
     * @memberof Repository
     */
    update(id, params) {
        return axios.put(this.getUrl(id), params);
    }

    /**
     * ID指定でDELETE
     *
     * @param {number} id
     * @param {Object} params
     * @returns {Object} 
     * @memberof Repository
     */
    destroy(id, params) {
        return axios.delete(this.getUrl(id), params);
    }
    
};