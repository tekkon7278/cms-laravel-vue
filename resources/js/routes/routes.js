
import SiteList from "../components/cms/pages/SiteList.vue"
import SiteBaseEdit from "../components/cms/pages/SiteBaseEdit.vue"
import SitePageList from "../components/cms/pages/SitePageList.vue"
import SiteDesignEdit from "../components/cms/pages/SiteDesignEdit.vue"
import PageEdit from "../components/cms/pages/PageEdit.vue"
import Page from "../components/site/Page.vue"

let basePath = '/';
if (location.pathname.substring(0, 4) == '/cms') {
    basePath = '/cms';
}
export {basePath};

let routes = [];
if (basePath === '/cms') {
    routes = [
        {
            path: '/sites',
            name: 'site-list',
            component: SiteList,
        },
        {
            path: '/sites/:siteId',
            name: 'site-edit',
            component: SiteBaseEdit,
            props: true,
        },
        {
            path: '/sites/:siteId/base',
            name: 'site-base-edit',
            component: SiteBaseEdit,
            props: true,
        },
        {
            path: '/sites/:siteId/menu',
            name: 'site-page-list',
            component: SitePageList,
        },
        {
            path: '/sites/:siteId/design',
            name: 'site-design-edit',
            component: SiteDesignEdit,
        },
        {
            path: '/sites/:siteId/pages/:pageId',
            name: 'page-edit',
            component: PageEdit,
        },
    ];
} else {
    routes = [
        {
            path: '/sites/:siteId',
            name: 'page',
            component: Page,
        },
        {
            path: '/sites/:siteId/pages/:pageId',
            name: 'page',
            component: Page,
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'page',
            component: Page,
        },
    ];
}
export {routes};